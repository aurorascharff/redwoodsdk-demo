# DEMO STEPS

## Worker.tsx routes and functions, middleware, documents

- Here in worker.tsx, the entrypoint for our cloudflare worker.
- In redwood, every route is just a function.
- I have a few simple responses here for a few routes. Just using the native Request and Response here. We have max flexibility, and ownership of request and response.
- Prefix for a set of routes, extracted.
- We can also return jsx! Snippet.
- The browser makes a request, we match a route, and we respond with content.
- We can also have some middleware further up, common headers and session. Using cloudflare durable objects for session management. We can actually run middleware freely by adding more functions before or after here, and our request will run through all of this sequentially. Add getUserMiddleware.
- Adds the user to our app context which can be used anywhere.
- With App context, we get a mutable object thats passed to each request handler, interruptors, and server functions, and components. See type.
- For our routes, we can simply render the NOJSDocument. The document will be applied to all routes that are passed to it. Move JSX inside. Then static Home page.
- Layouts: wrapped in AppLayout.
- Route matched, placed into that document. Right now, this is just a plain document and theres no client side hydration here, plain server-side rendering.

## Api routes, server components TodosSimple, forms, react 19, d1 database

- Let's move a bit further, let's say need some dynamic data using a databases and api routes. Whats a demo without todos? Go to todos.
- Check out the simple crud api route here with api prefix(), all native req/res.
- Wrap another layout() mainlayout, enabling nested layouts. Match the 'simple-todos' page.
- Prisma Hooked up to the cloudflare d1 database! (Locally, it uses miniflare to emulate cloudflare workers. It just works between dev and prod.)
- Redwoodsdk uses server components as the default, and everything you might be used to in a framework like next.js works with the same mental model in redwoodsdk.
- Enabling server-side fetching and composability without need for useEffect, with less boilerplate. It's streaming and suspense friendly, and ensures the fastest time to visible content.
- Try it out: Using simple SSR, no javascript! Just the mental model of server components that React suggests. Web standard form actions.
- (Using the new React 19 metadata, so I can add this anywhere and it wil automatically be added to the head).

## Hydrated Document, script, initClient. UserRoutes, protect profile, interupptor, interactive login with 'use client'

- Let's jump forward, to the current state of React.
- What if we DO want hydration after all for some routes to add interactivity?
- Snippet regularDocument. Remove Home from noJS. More routes. Enabling client side hydration with adding the script tag, client,tsx. Containing initClient to init hydration of our rsc payload.
- Interactive login. Go to login. I extracted a section of my route handlers here to a set of userRoutes with a couple of user pages and a logout route. We can colocate our logic and our ui. Logout with a 302 redirect response. Built in web standards.
- Login page is a client component, using useActionState and server functions. Get a nice interactive spinner and execute our mock login using a session durable object.
- We can simply use React 19 as its best suited. UseActionState and server functions that access request response. It just works.
- Showcase profile. Actually using the context from our app context added in middleware to access the user.
- Now, let's say I want to protect my routes. This is where interruptors come in! Return arrays here with an authenticated and a redirect interruptor! Just reusable functions, executed in sequence for each matched request.
- Showcase redirect on sign-in route if logged in.
- Log out. Showcase protected profile route if logged out.

## Client side navigation

- What else might we want? Well, client side navigation. Doing full page reload.
- Let's init client side navigation as well here. Internal links will now be intercepted by redwoodSDK, handle pushing the URL, fetch the new RSC payload, and then hydrate it on the client.
- Now we have our client side navs no browser spinner in our hydrated document.
- (SSR false, we are in SPA mode! Or static marketing side with RSC payload false).

## Fancy todos and view transitions

- Let's jump further, to some modern React patterns and new stuff.
- Since we have client side nav, redwoodsdk actually uses transitions under the hood, which means we can also add view transitions.
- Let's say we want to animate across the navigation into a fancier todos route.
- Add fancy todos page as snippet to worker. Showcase viewtransition.
- Showcase also on the destination route, same name, shared element transition into this.
- And I also added VT on the suspense. Execute navigation. Streaming with Suspense and server components, animating.
- Todos, lots of modern, fancy stuff, using use() to read a promise from the server in this client component and suspend with a fallback.
- Since modern React. This fancier todos uses useActionState sort of like an async reducer, because our state depends on the previous state and its also async, and we want ordering, this is a perfect use case. Also using server functions instead of API routes. Works with useoptimistic to make it snappy while syncing to the server! Using forms and actions with the Action naming convention across all transitions! And I added a View transition to the sort feature for animated reordering.
- We can use all latest in React in a predictable way!

## Fetch based to stream based payload

- We can actually move beyond this. Redwood provides realtime functionality, utilizing websockets and cloudflare durable objects. I have a third route here, a realtime reactions page. Add it to worker outside mainlayout. 
- Getting the theme and reactions from a durable object, using server components.
- Mutation with an emoji picker client component and server functions.
- (Double tabs, working as expected here).
- Now, let's try switching from a fetch-based RSC payload to a streamed-based RSC payload.
- We can switch from InitClient -> InitRealtimeClient with a key that determines which group of clients should share updates, we'll just do the pathname. Same durable object instance.
- Exported the realtime durable object in worker.tsx, then wire up our worker route with realtimeRoute of a reactions durable object here, connecting the websocket to the appropriate durable object.
- Now, our page can update over websockets, persistent bidirectional connection! (Try it double tabs again).
- Triggering server functions, client connected on the same key. Regenerate payload to all client on same key, client receive same RSC payload. Durable objects scale infinitely.

## Release to production

- Pnpm release will push all this to production with ease. Upload website to cloudflare, create database assets, storage assets. (Can also add --env=staging for multiple environments).
- I already deployed this.
- Open released version on realtime page. Let them scan.
- See the realtime reactions streaming in.

## Conclusion

- While they send reactions
- We built this all on web standard request response, with complete control of the document. We created a simple SSR form action todo route, no client side js, with server components as the base. Hooked up to Cloudflare durable objects and databases. But also hooked up hydration, and could use our all the newest React features in a way that felt predictable. Like server functions and Actions, and other React 19 hooks like useActionState and useOptimistic to complete the interactive picture. And we added client side navigation, that works with the new view trans! And beyond, we can just like that initialize a realtime route and stream RSCs using websockets. All in the same app! RedwoodSDK takes React and TS and Cloudflare, and binds it together as something that feels cohesive, but still based on web standards.
