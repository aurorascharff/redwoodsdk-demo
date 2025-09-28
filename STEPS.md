# DEMO STEPS

## Setup and starting point

- I'm here in a app based on the RedwoodSDK standard starter, which includes the cloudflare setup, and also a db setup with prisma. It also includes an auth setup with passkeys.
- RedwoodSDK is essentially just added as a vite plugin. It unlocks the ssr and server components and things like realtime features, and a cloudflare locale dev environment with access to database, storage, queues. Also hooked up to the compiler!
- We configure our app inside our worker.tsx file here, the entrypoint for our cloudflare worker.

## Worker.tsx routes and functions, middleware, documents

- So, in redwood, every route is just a function. I have a simple response and also a jsx component returned here. The browser makes a request, we match a route, and we respond with content. Notice we can use the native Request and Response here. Ownership request and response.
- Notice the different routes return simple Response and our JSX. Colocate JSX and api routes.
- This is just functions, which means we have max flexibility.
- Further up we also have some middleware, common headers and session, and then we can add getUserMiddleware the user to our app context which will be passed to our components. Mutable object thats passed to each request handler, interuptors, and server functions. Using cloudflare durable objects for session management.
- For our routes, we can render the NOJSDocument. The document will be applied to all routes that are passed to it. Right now, this is just a plain document and theres no client side hydration here, plain server-side rendering.
- Return Home page wrapped in AppLayout. Route matched, placed into that document. Wrap another layout() mainlayout, enabling nested layouts. They also receive requestinfo.

## Api routes, server components TodosSimple, forms, react 19, d1 database

- Add simple-todos route.
- Add a simple crud api route here with api prefix(), all native SSR and req/res.
- Redwoodsdk uses server components as the default, similar to nextjs, and everything you might be used to there works with the same mental model in redwoodsdk.
- Enabling server-side fetching and composability without need for useEffect, with less boilerplate. It's streaming and suspense friendly, and ensures the fastest time to visible content.
- Simple todos! Whats a demo without todos? Using simple SSR, no javascript! Just the mental model of server components that React suggests. Web standard form actions.
- Using the simplified React 19 metadata, so I can add this anywhere and it wil automatically be added to the head.
- Prisma Hooked up to the cloudflare d1 database! Uses miniflare to emulate cloudflare workers. It just works between dev and prod.

## Hydrated Document, script, initClient. UserRoutes, protect profile, interupptor, interactive login with 'use client'

- Extract regular Document enabling client side hydration with adding the script tag. Add initClient to client.tsx to init hydration of our rsc payload. Then, init client nav as well. Internal links will now be intercepted by redwoodSDK, handle pushing the URL, fetch the new RSC payload, and then hydrate it on the client.
- I can also bring in a bunch of route handlers for a user page.
- I extracted a section of my route handlers here to a set of userRoutes with a couple of user pages and a logout route. We can colocate our logic and our ui. Handlers with a 302 redirect response. Built in web standards.
- Showcase profile. Using the context from our app context to access the user.
- Now, let's say I want to protect my routes. This is where interruptors come in! Let's return arrays here instead with an authenticated and a redirect interruptor! Just reusable functions, executed in sequence for each matched request.
- Showcase protected profile route.
- Login page is a client component to get a nice interactive spinner and execute our passkey login using the webauthN API included in the standard starter.
- We can use React 19 as its best suited. UseActionState and server functions. It just works.
- Showcase redirect on sign-in route.

## Client side navigation

- Now, we have a few routes here, still we don't have client side nav, were just returning documents. Let's init client side navigation as well here. Internal links will now be intercepted by redwoodSDK, handle pushing the URL, fetch the new RSC payload, and then hydrate it on the client.
- Now we have our client side navs no browser spinner!
- (SSR false, we are in SPA mode! Or static marketing side with RSC payload false).

## Fancy todos and view transitions

- Since we have client side nav, redwoodsdk actually implements it using the suspense enabled router pattern, meaning it uses transitions under the hood, which means we can also add view transitions.
- Let's say we want to animate across the navigation into a fancier todos route. Add viewtrans to fancy todos link, add it also on the destination route, shared element transition into this. And I also added them on the suspense.
- This fancier todos uses useActionState sort of like an async reducer, so since our state depends on the previous state and its also async, and we want ordering, this is a perfect use case. Using the actions convention across all interactions! Works with useoptimistic to make it snappy. Also using server functions instead of API routes. Also forms. Also using use() to read a promise from the server in this client component and suspend with a fallback. Streaming with Suspense and server components.

## Fetch based to stream based payload

- I have a third route here, a realtime reactions page. Getting server components from a durable object, mutation with server functions.
- Double tabs, not working.
- Now, let's try switching from a fetch-based RSC payload to a streamed-based RSC payload.
- We can switch from InitClient -> InitRealtimeClient with a key that determines which group of clients should share updates, we'll just do the pathname. Same durable object instance.
- Export the realtime durable object in worker.tsx, then wire up our worker route with realtimeRoute of a reactions durable object here, connecting the websocket route to the appropriate durable object.
- Now, our page can update over websockets, persistent bidirectional connection! Try it double tabs again.
- Triggering server functions, client connected on the same key. Regenerate payload to all client on same key, client receive same RSC payload. Durable objects scale infinitely.

## Release to production

- Pnpm release will push all this to production with ease. Upload website to cloudflare, create database assets, storage assets. Can also add --env=staging for multiple environments.
- I already deployed this.
- Open released version on realtime page. Let them scan.
- See the realtime reactions streaming in. Hopefully they've seen it already.

## Conclusion

- While they send reactions: We built this all on web standard request response, with complete control of the document. We have a simple SSR form action todo app, no client side js. But we have fancy todos and passkey auth. All in the same app! We can use our all the newest React features in a way that feels intentional, with server components as the base. Server functions and other React 19 hooks like useActionState, Action and useOptimistic complete the interactive picture. We can even use viewtrans with redwoods client side nav! And finally, we can just like that initialize a realtime route and stream RSCs using websockets. Taking React and TS and CLoudflare, binding together as something that feels cohesive, but based on web standards.
