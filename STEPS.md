# DEMO STEPS

## Setup and starting point

- I'm here in a app based on the RedwoodSDK standard starter, which includes the cloudflare setup, and also a db setup with prisma. It also includes an auth setup with passkeys.
- RedwoodSDK is essentially just added as a vite plugin. It unlocks the ssr and server components and things like realtime features.
- We configure out app inside our worker.tsx file here, the entrypoint for our cloudflare worker.

## Worker.tsx

- So, in redwood, every route is just a function. I have a simple response and also a jsx component returned here. Notice we can use the native Request and Response here.
- Further up we also have some middleware, where we are handling our session logic, and adding the user to our app context which will be passed to our components.
