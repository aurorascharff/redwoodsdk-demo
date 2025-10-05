# DEMO STEPS

## Setup and starting point

- I'm here in a app based on the RedwoodSDK starter, which includes the cloudflare setup.
- RedwoodSDK is essentially just added as a vite plugin. It unlocks the ssr and server components and things like realtime features, and a cloudflare locale dev environment with access to database, storage, queues.
- We configure our app inside our worker.tsx file here, the entrypoint for our cloudflare worker.

## Worker.tsx routes and functions, middleware, documents

- Imagine a simple world. A react framework, where every route is just a function. I have a simple response and also a jsx component returned here. The browser makes a request, we match a route, and we respond with content. They also receive requestinfo (unwrap argument).
- Just using the native Request and Response here. This is just functions, which means we have max flexibility, and ownership of request and response.
- However, we also have some middleware further up, common headers and session. Using cloudflare durable objects for session management. We can actually run middleware freely by adding more functions before or after here, and our request will run through all of this sequentially. Add getUserMiddleware.
- App context is a mutable object thats passed to each request handler, interruptors, and server functions, and components. See type.
- Adds the user to our app context which can be used anywhere.
- For our routes, we can simply render the NOJSDocument. The document will be applied to all routes that are passed to it.
- Return Home page wrapped in AppLayout. Route matched, placed into that document. Right now, this is just a plain document and theres no client side hydration here, plain server-side rendering.

## Api routes, server components TodosSimple, forms, react 19, d1 database

- Let's move a bit further, let's say need some dynamic data using a databases and api routes. Let's say we want some simple todos! Whats a demo without todos?
- Wrap another layout() mainlayout, enabling nested layouts. Match the 'simple-todos' page.
- Add a simple crud api route here with api prefix(), all native SSR and req/res.
- Prisma Hooked up to the cloudflare d1 database! Locally, it uses miniflare to emulate cloudflare workers. It just works between dev and prod.
- Redwoodsdk uses server components as the default, and everything you might be used to in a framework like next.js works with the same mental model in redwoodsdk.
- Enabling server-side fetching and composability without need for useEffect, with less boilerplate. It's streaming and suspense friendly, and ensures the fastest time to visible content.
- Try it out: Using simple SSR, no javascript! Just the mental model of server components that React suggests. Web standard form actions.
- (Using the new React 19 metadata, so I can add this anywhere and it wil automatically be added to the head).

## Hydrated Document, script, initClient. UserRoutes, protect profile, interupptor, interactive login with 'use client'

- Ok, let's continue with some enhancements. What if we do want hydration after all for other routes?
- Copy paste regular Document. Move home there. Enabling client side hydration with adding the script tag, client,tsx. Containing initClient to init hydration of our rsc payload.
- I extracted a section of my route handlers here to a set of userRoutes with a couple of user pages and a logout route. We can colocate our logic and our ui. Logout with a 302 redirect response. Built in web standards.
- Login page is a client component, using useActionState and server functions. Get a nice interactive spinner and execute our mock login using a session durable object.
- We can simply use React 19 as its best suited. UseActionState and server functions that access request response. It just works.
- Showcase profile. Actually using the context from our app context to access the user.
- Now, let's say I want to protect my routes. This is where interruptors come in! Let's return arrays here instead with an authenticated and a redirect interruptor! Just reusable functions, executed in sequence for each matched request.
- Showcase redirect on sign-in route if logged in.
- Log out. Showcase protected profile route if logged out.

## Client side navigation

- What else might we want? Well, client side navigation.
- Now, we have a few routes here, still we don't have client side nav, were just returning documents. Let's init client side navigation as well here. Internal links will now be intercepted by redwoodSDK, handle pushing the URL, fetch the new RSC payload, and then hydrate it on the client.
- Now we have our client side navs no browser spinner!
- (SSR false, we are in SPA mode! Or static marketing side with RSC payload false).

## Fancy todos and view transitions

- Let's jump ahead, from our simple world to the current state of React.
- Since we have client side nav, redwoodsdk actually implements it using the suspense enabled router pattern, meaning it uses transitions under the hood, which means we can also add view transitions.
- Let's say we want to animate across the navigation into a fancier todos route.
- Add viewtrans to fancy todos link, unique name.
- Add fancy todos page as snippet to worker.
- Add it also on the destination route, same name, shared element transition into this.
- Also using use() to read a promise from the server in this client component and suspend with a fallback. Streaming with Suspense and server components. All of the latest in and greatest in React.
- And I also added them on the suspense.
- This fancier todos uses useActionState sort of like an async reducer, so since our state depends on the previous state and its also async, and we want ordering, this is a perfect use case. Also using server functions instead of API routes. Using forms and actions with the Action naming convention across all interactions! Works with useoptimistic to make it snappy while syncing to the server.
- We can use all regular and modern React in a predictable way!

## Fetch based to stream based payload

- We can actually move beyond that. Redwood actually provides realtime functionality. I have a third route here, a realtime reactions page. Add it to worker outside mainlayout.
- Getting the theme and reactions from a durable object, using server components.
- Mutation with an emoji picker client component and server functions.
- Double tabs, working as expected here.
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

- While they send reactions
- We built this all on web standard request response, with complete control of the document. We created a simple SSR form action todo app, no client side js, with server components as the base. Hooked up to Cloudflare durable objects and databases. But we could also hook up hydration, use our all the newest React features in a way that feels natural. Like server functions and Actions, and  other React 19 hooks like useActionState and useOptimistic to complete the interactive picture. And add client side navigation, that works with the new viewtrans! And beyond, we can just like that initialize a realtime route and stream RSCs using websockets. All in the same app! RedwoodSDK takes React and TS and Cloudflare, and binds it together as something that feels cohesive, but still web standard.
