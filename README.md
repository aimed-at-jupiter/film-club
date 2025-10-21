🎬 **Film Club**

Film Club is a full-stack event management platform for hosting and attending film screenings and discussions.
Users can sign up, purchase tickets securely via Stripe, and add events directly to their Google Calendar.

🌐 Hosted Project
| Service | URL |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| Frontend (Netlify) | [https://jupiter-film-club.netlify.app](https://jupiter-film-club.netlify.app) |
| Backend (Render) | [https://film-club-9zsg.onrender.com](https://film-club-9zsg.onrender.com) |
| Database (Supabase PostgreSQL) | Hosted (production only) |

### Overview
- Frontend: React + Vite + Bootstrap
- Backend: Node.js + Express + PostgreSQL (via Supabase in production)
- Authentication: JSON Web Tokens (JWT)
- Payments: Stripe Checkout (test and live keys supported)
- Calendar Integration: Google Calendar URL method (no OAuth required)
- Hosting: Render (API) & Netlify (client)
- Uses OMDb API for film metadata.

🔑 Signup & API key setup
### OMDb
1.	Visit: https://www.omdbapi.com/apikey.aspx
2.	Signup for a free developer key.
3.	Put it into /server/.env.development as OMDB_API_KEY.

### Stripe
1.	 Create a Stripe account at ~[https://stripe.com](https://stripe.com/)
2.	 In the Dashboard → Developers → API keys:
	* Copy **Publishable key** → add to /client/.env.local as VITE_STRIPE_PUBLIC_KEY
	* Copy **Secret key** → add to /server/.env.development as STRIPE_SECRET_KEY
3.	 Toggle **“View test data”** in Stripe Dashboard to run test transactions.

### 💳 How to test payments (including on hosted site)
* Ensure your Stripe keys are **test keys** (prefix pk_test_ / sk_test_) for testing.
* Use Stripe’s test card for Checkout:

⠀
### 💳 Stripe Test Card Details

Use the following details to simulate a successful payment when testing checkout:

| Field | Test Value |
|:-|:-|
| **Card Number** | `4242 4242 4242 4242` |
| **Expiry Date** | Any future date (e.g. `12/34`) |
| **CVC** | Any 3 digits (e.g. `123`) |
| **Name** | Any name (e.g. `Jane Doe`) |
| **Email** | Any valid email (e.g. `test@example.com`) |

> 🧪 **Tip:** Payments made using this test card will not charge real money.  
> You can safely use it in both local and live (test mode) environments.


⚙️ **Running Locally**

1. ### Clone the repo
   git clone https://github.com/aimed-at-jupiter/film-club

2. ### Install dependencies
   Install dependencies in both directories:
   cd server
   npm install

cd ../client
npm install

3. ### Database setup (local Postgres)
   Make sure PostgreSQL is running locally, then from /server:
   npm run setup-dbs
   npm run seed
   setup-dbs creates the required databases (development, test).
   seed populates them with sample users, events, and signups.

4. ### Create environment variables (make sure you add .env* to your .gitignore)
   🗄️ **Server** (/server/.env.development)

- DATABASE_URL=postgres://localhost:5432/film_club
- JWT_SECRET=your_jwt_secret
- OMDB_API_KEY=your_omdb_api_key
- STRIPE_SECRET_KEY=your_stripe_test_secret
- CLIENT_URL=http://localhost:5173

For production (.env.production), replace these with live keys and URLs.

💻 **Client** (/client/.env.local)

- VITE_API_URL=http://localhost:9090
- VITE_STRIPE_PUBLIC_KEY=your_stripe_test_public_key

For deployment (.env.production), replace with your live API URL and keys.

5. ### Start the app
Run both the server and client in separate terminals:

Terminal 1 – backend
cd server
npm run dev

Terminal 2 – frontend
cd client
npm run dev

Then open http://localhost:5173

🧪 Testing
To run automated backend tests:
cd server
npm test

Seeds the test database automatically
Runs Jest integration tests for database and API endpoints

👩‍💻 Fake User Accounts
| Role | Email | Password |
| ----- | --------------------------------------------------------- | -------- |
| Staff | [admin@filmclub.com](mailto:admin@filmclub.com) | admin123 |
| User | [olive@example.com](mailto:olive@example.com) | olive123 |
| … | more sample users in `/db/data/development-data/users.js` | |

⚠️ Passwords are hashed before insertion and intended for demonstration only.

🧾 Example API Routes
| Method | Endpoint | Access | Description |
| -------- | ------------------------------ | ------------------- | --------------------------------------------------------- |
| **GET** | `/api/events` | Public | Retrieve all film events |
| **GET** | `/api/events/:event_id` | Public | Retrieve detailed data for a single event |
| **POST** | `/api/events` | Staff only | Create a new event |
| **GET** | `/api/my-signups` | Authenticated users | Fetch all events the current user has signed up for |
| **POST** | `/api/signups` | Authenticated users | Sign up for an event |
| **POST** | `/api/create-checkout-session` | Authenticated users | Initiate Stripe Checkout for paid events |
| **POST** | `/api/auth/register` | Public | Register a new user account |
| **POST** | `/api/auth/login` | Public | Log in and receive a JWT token |
| **GET** | `/api/omdb` | Staff only | Retrieve film data from the OMDb API for event enrichment |

🗓️ Google Calendar Integration — Technical Note

This application provides a quick way for users to add Film Club events to their Google Calendar using a pre-filled **Google Calendar event link**. When clicked, the button opens a new tab with all event details pre-populated in Google Calendar, allowing the user to confirm and save the event manually.
This implementation avoids the need for OAuth authentication and sensitive scope verification by Google, offering a lightweight and privacy-friendly solution. However, this also means:
* Users **must already be signed into Google** in their browser session.
* If they are not signed in, Google will first redirect them to the login page.
* After signing in, users may need to **click the “Add to Google Calendar” button again** to open the event.

This design was chosen intentionally to maintain full functionality without requiring app verification or OAuth consent screens, while still delivering a smooth experience for most users. Whilst I initially implemented the use of Google calendar API, **as of August 28, 2025, Google requires that apps requesting sensitive OAuth scopes undergo an extensive verification process before they can access user data in production capacity**. This means that only users listed as test users in your Google Cloud project's OAuth consent screen can authorize the app during development and testing. 

I have decided to leave the code for Google Calendar API integration in (although not currently being used) so you can see how I would handle that level of functionality.

Please feel free to drop me a message if you have any questions!
