🎬 Film Club
Film Club is a full-stack event management platform for hosting and attending film screenings and discussions.
Users can sign up, purchase tickets securely via Stripe, and add events directly to their Google Calendar.

🌐 Hosted Project
| Service | URL |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| **Frontend (Netlify)** | [https://jupiter-film-club.netlify.app](https://jupiter-film-club.netlify.app) |
| **Backend (Render)** | [https://film-club-9zsg.onrender.com](https://film-club-9zsg.onrender.com) |
| **Database (Supabase PostgreSQL)** | Hosted (production only) |

Overview
Frontend: React + Vite + Bootstrap
Backend: Node.js + Express + PostgreSQL (via Supabase in production)
Authentication: JSON Web Tokens (JWT)
Payments: Stripe Checkout (test and live keys supported)
Calendar Integration: Google Calendar URL method (no OAuth required)
Hosting: Render (API) & Netlify (client)

⚙️ Running Locally

1. Clone the repo
   git clone https://github.com/aimed-at-jupiter/film-club

2. Install dependencies
   Install dependencies in both directories:
   cd server
   npm install

cd ../client
npm install

3. Database setup (local Postgres)
   Make sure PostgreSQL is running locally, then from /server:
   npm run setup-dbs
   npm run seed
   setup-dbs creates the required databases (development, test).
   seed populates them with sample users, events, and signups.

4. Environment variables
   🗄️ Server (/server/.env.development)

DATABASE_URL=postgres://localhost:5432/film_club
JWT_SECRET=your_jwt_secret
OMDB_API_KEY=your_omdb_api_key
STRIPE_SECRET_KEY=your_stripe_test_secret
CLIENT_URL=http://localhost:5173

For production (.env.production), replace these with live keys and URLs.

💻 Client (/client/.env.local)

VITE_API_URL=http://localhost:9090
VITE_STRIPE_PUBLIC_KEY=your_stripe_test_public_key

For deployment (.env.production), replace with your live API URL and keys.

5 Start the app
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

Deployment Notes

Frontend (Netlify) automatically builds from /client
Backend (Render) deploys from /server, using npm start
Environment variables for production must be set in both Render and Netlify dashboards
The backend CLIENT_URL must match your deployed Netlify domain to avoid CORS issues

Uses OMDb API for film metadata.
