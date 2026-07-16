# LocalFind

LocalFind is a location-based marketplace for local services. Basically, if you need a math tutor, a dog sitter, someone to clean your house, whatever, you write what you need in plain text and the app finds providers near you who offer that. You contact them directly over WhatsApp or by phone, there's no chat or payment system built into the app.

## Repository structure

This repo is the backend only. The React frontend is in a separate repo: [add the frontend repo link here].

```
/server      Express + TypeScript backend, MongoDB with Mongoose, REST API
/screens     Static HTML/CSS mockups I used as the design reference while building the screens
```

## How it's built

It's a Node + Express backend written in TypeScript, with MongoDB Atlas as the database through Mongoose. Every request gets validated with Joi before it even reaches a controller, so bad input gets rejected early instead of causing weird bugs down the line.

Auth is JWT based: you register or log in, get a token back, and send it on every request that needs to be protected. There's a `protect` middleware that checks the token is valid and attaches the user to `req.user`, and an `authorize` middleware on top of that for routes that should only work for a specific role, like the admin routes. Passwords are hashed with bcrypt before saving, and the password field is set to not come back in query results by default, so it can't accidentally leak in an API response.

Two parts of the app use OpenAI (`gpt-4o-mini`):
- Searching in the feed: you type what you need in free text, and it gets matched to one of the existing categories, then providers in that category near you show up.
- Provider onboarding: instead of making a new provider pick a category from a list, they just describe what they do and the app suggests the matching category.

For location stuff, providers use MongoDB's geospatial features (2dsphere index, `$near` queries), so search results are sorted by real distance from the user. Requests don't have a location field, so there's no distance-based sorting for provider leads right now, just newest-first.

## Data model

Five collections:

**User** — every account, whether it's someone looking for a service or a provider. Has a `role` field (`user`, `provider`, or `admin`), and a `favorites` array pointing to `Provider` documents.

**Provider** — a provider's profile. Belongs to one `User` and one `Category`. Has a description, price, city, a GeoJSON location, and an average rating that updates automatically.

**Category** — the list of service types (dog sitting, math tutoring, etc). Everything is grouped by category.

**Request** — when a user sends a lead to a provider. Points to both the `User` who sent it and the `Provider` it's for, plus a status of `pending` or `handled`.

**Review** — a rating and comment left for a provider. Also points to both a `User` and a `Provider`. Saving a review triggers a recalculation of that provider's average rating and review count.

So basically: `Provider` sits between a `User` and a `Category`, and both `Request` and `Review` connect a `User` to a `Provider`.

## Environment variables

You'll need a `.env` file inside `/server` with:

| Variable | What it's for |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Key used to sign and verify JWT tokens |
| `JWT_EXPIRE` | How long a login token stays valid, e.g. `30d` |
| `OPENAI_API_KEY` | For the OpenAI calls in search and category detection |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID, used to verify Google sign-in |
| `PORT` | Port the server runs on |
| `DOMAIN_BASE` | Public domain/host, used to build file URLs for uploads |
| `NODE_ENV` | `development` or `production` |

## Running it locally

```
cd server
npm install
npm run dev
```

That runs the API with nodemon so it restarts on changes. `npm run build` compiles the TypeScript into `/dist`, and `npm start` runs the compiled version.
