# DEMO STEPS

## Setup and starting point

- I'm here in a app based on the RedwoodSDK standard starter, which includes the cloudflare setup, and also a db setup with prisma. It also includes an auth setup with passkeys.
- RedwoodSDK is essentially just added as a vite plugin. It unlocks the ssr and server components and things like realtime features, and a cloudflare locale dev environment with access to database,storage, queues.
- We configure out app inside our worker.tsx file here, the entrypoint for our cloudflare worker.

## Worker.tsx every route is just a function

- So, in redwood, every route is just a function. I have a simple response and also a jsx component returned here. Notice we can use the native Request and Response here. Ownership request and response.
- Notice the different routes return simple Response and our JSX. Colocate JSX adn api routes.
- This is just functions, which means we have max flexibility.
- For our routes, we can render the NOJSDocument. Right now, this is just a plain document and theres no client side hydration here, plain server-side rendering. Showcase network. Route 'simple-todos'. Route matched, placed into that document. Notice no js network.

## React Server Components and api routes, d1 database

- Redwoodsdk uses server components as the default, similar to nextjs, and everything you might be used to there works with the same mental model in redwoodsdk.
- Enabling server-side fetching and composability without need for useEffect, with less boilerplate. It's streaming and suspense friendly, and ensures the fastest time to visible content.
- Add a simple crud api route here, all native SSR and req/res. Simple todos! Whats a demo without todos? Using simple SSR and streaming with Suspense and server components! Just the mental model of server components that React suggests. Web standard form actions. RSC payload converted to html and streamed to browser, picked up by client side hydration.
- Hooked up to the cloudflare d1 database provided in the starter! Set up with miniflare to emulate cloudflare workers. It just works between dev and prod.

## Hydration/client-side rendering and server functions, layouts, middleware, interruptors and auth

- Add a regular Document enabling client side hydration with adding the script tag. Add initClient to client.tsx.
- Add an layout() applayout and index() home route. Wrap another layout() mainlayout.
- We can colocate our logic and our ui, for example I can bring in a bunch of route handlers for a user page.
- Further up we also have some middleware, we can add some session logic, and adding the user to our app context which will be passed to our components. Using cloudflare durable objects for session management.
- I extracted a section of my route handlers here to a set of userRoutes with a couple of user pages and a logout route handlers with a 302 redirect response. Built in web standards.
- Now, let's say I want to protect my routes. This is where interruptors come in! Let's return arrays here instead with an authenticated and a redirect interruptor! Just reusable functions.
- Login page is a client component to get a nice interactive spinner and execute our passkey login. Showcase, showcase interupptors.
- Using the context from our app context to access the user.
- We can use React 19 as its best suited. UseActionState and server functions. It just works.

## Client side navigation

- Now, we have a few routes here, still we don't have client side nav, were just returning documents. Let's init client side navigation as well here.
- Now we have our client side navs no browser spinner!
- SSR false or RSC payload false? We are in SPA mode! Or static marketing side?

## Fancy todos and wiew transitions

- Since we have client side nav, redwoodsdk actually implements it using the suspense enabled router pattern, meaning it uses transitions under the hood, which means we can also add view transitions.
- Let's say we want to animate across the navigation into a fancier todos route. Add fancy todos, shared element transition into this.
- This fancier todos uses useActionState sort of like an async reducer, so since our state depends on the previous state and its also async, and we want ordering, this is a perfect use case. Using the actions convention across all interactions! Works with useoptimistic to make it snappy. Also using server functions instead of API routes. Also forms. Also using use() to read a promise from the server in this client component and suspend with a fallback.
- Viewtrans our suspense loading state on enter exit. Default none.
- Add viewtransition to our sort button, switch this for a action prop so we can handle the sort as a transition, activation the view transition, letting react automatically animate from the result of the transition into this new UI.

## Fetch based to stream based payload

- I have a third route here, a realtime reactions page. Getting server components from a durable object, mutation with server functions.
- Double tabs, not working.
- Now, let's try switching from a fetch-based RSC payload to a streamed-based RSC payload.
- We can switch from InitClient -> InitRealtimeClient with a key that determines which group of clients should share updates, we'll just do the pathname.
- Export the reltime durable object in worker.tsx, then wire up our worker route with realtimeRoute of a reactions durable object here.
- Now, our page can update over websockets! Try it double tabs again.
- Triggering server functions, client connected on the same key. Regenerate payload to all client on same key, client receive same RSC payload. Durable objects scale infinitely.

## Release to production

- Pnpm release will push all this to production with ease. Upload website to cloudflare, create database assets, storage assets. Can also add --env=staging for multiple environments.
- I already deployed this.
- Open released version on realtime page. Let them scan.
- See the realtime reactions streaming in. Hopefully they've seen it already.

## Conclusion

- While they send reactions: We built this all on web standard request response, with complete control of the document. We have a simple SSR form action todo app, no client side js. But we have fancy todos and passkey auth. We can use our all the newest React features in a way that feels intentional, with server components as the base. Server functions and other React 19 hooks like useActionState, Action and useOptimistic complete the interactive picture. We can even use viewtrans with redwoods client side nav! And finally, we can just like that initialize a realtime route and stream RSCs using websockets. Everything in the same app! Standard typescript, standard react, standard request response.
