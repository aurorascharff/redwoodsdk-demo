'use server';
import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

import { env } from 'cloudflare:workers';
import { requestInfo } from 'rwsdk/worker';
import { db } from '@/db';
import { sessions } from '@/session/store';
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/server';

function getWebAuthnConfig(request: Request) {
  const rpID = env.WEBAUTHN_RP_ID ?? new URL(request.url).hostname;
  const rpName = import.meta.env.VITE_IS_DEV_SERVER ? 'Development App' : env.WEBAUTHN_APP_NAME;
  return {
    rpID,
    rpName,
  };
}

export async function startPasskeyRegistration(username: string) {
  const { rpName, rpID } = getWebAuthnConfig(requestInfo.request);
  const { response } = requestInfo;

  const options = await generateRegistrationOptions({
    authenticatorSelection: {
      // Require the authenticator to store the credential, enabling a username-less login experience
      residentKey: 'required',
      // Prefer user verification (biometric, PIN, etc.), but allow authentication even if it's not available
      userVerification: 'preferred',
    },
    rpID,
    rpName,
    userName: username,
  });

  await sessions.save(response.headers, { challenge: options.challenge });

  return options;
}

export async function startPasskeyLogin() {
  const { rpID } = getWebAuthnConfig(requestInfo.request);
  const { headers } = requestInfo;

  const options = await generateAuthenticationOptions({
    allowCredentials: [],
    rpID,
    userVerification: 'preferred',
  });

  await sessions.save(headers, { challenge: options.challenge });

  return options;
}

export async function finishPasskeyRegistration(username: string, registration: RegistrationResponseJSON) {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await sessions.load(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const verification = await verifyRegistrationResponse({
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
    response: registration,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return false;
  }

  await sessions.save(headers, { challenge: null });

  const user = await db.user.create({
    data: {
      username,
    },
  });

  await db.credential.create({
    data: {
      counter: verification.registrationInfo.credential.counter,
      credentialId: verification.registrationInfo.credential.id,
      publicKey: verification.registrationInfo.credential.publicKey,
      userId: user.id,
    },
  });

  return true;
}

export async function finishPasskeyLogin(login: AuthenticationResponseJSON) {
  const { request, headers } = requestInfo;
  const { origin } = new URL(request.url);

  const session = await sessions.load(request);
  const challenge = session?.challenge;

  if (!challenge) {
    return false;
  }

  const credential = await db.credential.findUnique({
    where: {
      credentialId: login.id,
    },
  });

  if (!credential) {
    return false;
  }

  const verification = await verifyAuthenticationResponse({
    credential: {
      counter: credential.counter,
      id: credential.credentialId,
      publicKey: credential.publicKey,
    },
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: env.WEBAUTHN_RP_ID || new URL(request.url).hostname,
    requireUserVerification: false,
    response: login,
  });

  if (!verification.verified) {
    return false;
  }

  await db.credential.update({
    data: {
      counter: verification.authenticationInfo.newCounter,
    },
    where: {
      credentialId: login.id,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: credential.userId,
    },
  });

  if (!user) {
    return false;
  }

  await sessions.save(headers, {
    challenge: null,
    userId: user.id,
  });

  return true;
}
