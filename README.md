# LocalFind

**Live site:** https://localfind-frontend.vercel.app
**API:** https://localfind-backend.onrender.com

LocalFind is a location-based marketplace for local services. Basically, if you need a math tutor, a dog sitter, someone to clean your house, whatever, you write what you need in plain text and the app finds providers near you who offer that. You contact them directly over WhatsApp or by phone, there's no chat or payment system built into the app.

I built this as my final project, working on it alone.

## Repository structure

This repo is the backend only. The React frontend is in a separate repo: https://github.com/nethanel24/localfind-frontend

```
/server      Express + TypeScript backend, MongoDB with Mongoose, REST API
/screens     Static HTML/CSS mockups I used as the design reference while building the screens
```

## How it's built

It's a Node + Express backend written in TypeScript, with MongoDB Atlas as the database through Mongoose. Every request gets validated with Joi before it even reaches a controller, so bad input gets rejected early instead of causing weird bugs down the line.

Auth is JWT based: you register or log in, get a token back, and send it on every request that needs to be protected. There's a `protect` middleware that checks the token is valid and attaches the user to `req.user`, and an `authorize` middleware on top of that for routes that should only work for a specific role, like the admin routes. Passwords are hashed with bcrypt before saving, and the password field is set to not come back in query results by default, so it can't accidentally leak in an API response.

On top of that the server uses helmet to set security-related HTTP headers, and express-rate-limit to cap how many requests a client can make in a window (with a stricter limit on the auth routes), so the API isn't wide open to abuse.

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

## API endpoints

| Method | Route | What it does | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Register with email and password | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |
| POST | `/api/auth/google` | Log in or register with a Google token | No |
| GET | `/api/users/profile` | Get the logged-in user's profile | Yes |
| PUT | `/api/users/profile` | Update name, email, phone, image | Yes |
| PUT | `/api/users/change-password` | Change password | Yes |
| DELETE | `/api/users/account` | Delete own account | Yes |
| GET | `/api/providers` | List providers, sorted by distance | No |
| GET | `/api/providers/profile` | Get the logged-in provider's own profile | Yes |
| GET | `/api/providers/:id` | Get one provider with reviews | No |
| POST | `/api/providers` | Create a provider profile | Yes |
| PUT | `/api/providers/:id` | Update a provider profile | Yes |
| DELETE | `/api/providers/:id` | Delete a provider profile | Yes |
| POST | `/api/providers/detect-category` | AI-detect a category from free text | Yes |
| POST | `/api/search` | AI free-text search for providers | No |
| GET | `/api/categories` | List categories with provider counts | No |
| POST | `/api/categories/add` | Add a category | Yes (admin) |
| DELETE | `/api/categories/:id` | Delete a category | Yes (admin) |
| GET | `/api/favorites` | Get the user's saved providers | Yes |
| POST | `/api/favorites/:providerId` | Save a provider | Yes |
| DELETE | `/api/favorites/:providerId` | Remove a saved provider | Yes |
| POST | `/api/requests` | Send a request to a provider | Yes |
| GET | `/api/requests/provider/:providerId` | Get a provider's requests | Yes |
| PUT | `/api/requests/:id` | Mark a request as handled | Yes |
| POST | `/api/reviews/add` | Add a review | Yes |
| GET | `/api/reviews?provider=:id` | Get reviews for a provider | No |
| POST | `/api/file` | Upload an image | Yes |
| GET | `/api/admin/users` | List all users | Yes (admin) |
| GET | `/api/admin/stats` | Platform statistics | Yes (admin) |

## Environment variables

You'll need a `.env` file inside `/server`. There's a `.env.example` in the repo you can copy from. The variables are:

| Variable | What it's for |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the server runs on |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Key used to sign and verify JWT tokens |
| `JWT_EXPIRE` | How long a login token stays valid, e.g. `30d` |
| `OPENAI_API_KEY` | For the OpenAI calls in search and category detection |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID, used to verify Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BASE_URL` | Public URL of the server, used to build file URLs for uploads |
| `CLIENT_URL` | The frontend URL, used to allow it through CORS |

## Running it locally

```
cd server
npm install
npm run dev
```

That runs the API with nodemon so it restarts on changes. `npm run build` compiles the TypeScript into `/dist`, and `npm start` runs the compiled version.