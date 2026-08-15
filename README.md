# Freelance Gig Platform

> A full-stack marketplace where clients post work and freelancers submit, track, and manage bids.

This project explores a two-sided freelance workflow. Clients can publish gigs, review proposals, and accept or reject bids. Freelancers can browse open work, submit proposals with price and delivery time, and track their bid status from a dedicated dashboard.

## Project status

The current branch contains an implemented MVP. The frontend production build and backend health smoke test have been verified locally. A public demo and automated end-to-end workflow tests are not configured in this repository yet.

| Capability | Status |
|---|---|
| Registration and login | Implemented |
| Client and freelancer roles | Implemented |
| Gig creation and browsing | Implemented |
| Bid submission and tracking | Implemented |
| Accept/reject bid flow | Implemented |
| Protected routes and JWT auth | Implemented |
| Automated backend smoke test | Implemented |
| Public deployment | Not configured in this repository |
| Payments, messaging, and project delivery | Roadmap |

## Main workflow

```text
Client creates a gig
        ↓
Freelancer discovers the gig
        ↓
Freelancer submits proposal, price, and delivery time
        ↓
Client reviews bids
        ↓
Client accepts or rejects a bid
```

Each state transition is protected by authentication and role checks. The next testing milestone is an integration test that exercises the complete workflow with disposable local accounts.

## Features

- Email/password registration and JWT authentication.
- Role-based access for clients and freelancers.
- Gig creation with category, budget, description, and deadline.
- Search and filtering for open gigs.
- Bid submission with proposal text, price, and delivery time.
- Client dashboard for reviewing, accepting, and rejecting bids.
- Freelancer dashboard for tracking submitted bids and statuses.
- Responsive React UI with loading, empty, and notification states.

## Technology stack

- **Frontend:** React 18, React Router, Axios, React Toastify, date-fns, CSS3
- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Security:** JWT authentication, bcrypt password hashing, role authorization
- **Testing:** Node’s built-in test runner for the backend health endpoint

## Repository structure

```text
backend/
  config/          MongoDB configuration
  controllers/     Auth, gig, and bid logic
  middleware/      JWT protection and role authorization
  models/          User, gig, and bid schemas
  routes/          Express route definitions
  test/            Backend smoke tests
  server.js        API entrypoint
frontend/
  src/             React pages, components, context, and API client
```

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, local or hosted

### Backend

```bash
git clone https://github.com/aggarwalshivam301/freelance-gig-platform.git
cd freelance-gig-platform/backend
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:5000` by default. Check it with:

```bash
curl http://localhost:5000/health
```

### Frontend

```bash
cd ../frontend
npm install
npm start
```

The development frontend runs on `http://localhost:3000`. Set `REACT_APP_API_URL` in `frontend/.env` when the API uses a different URL.

## Testing and builds

```bash
cd backend
npm test

cd ../frontend
npm run build
```

The backend smoke test verifies the health endpoint without requiring MongoDB. Add integration tests for registration, role authorization, bid submission, and bid acceptance next.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check |
| `POST` | `/api/auth/register` | Public | Register a client or freelancer |
| `POST` | `/api/auth/login` | Public | Authenticate a user |
| `GET` | `/api/gigs` | Public | Browse gigs |
| `POST` | `/api/gigs` | Client | Create a gig |
| `POST` | `/api/bids` | Freelancer | Submit a bid |
| `PUT` | `/api/bids/:id/accept` | Client | Accept a bid |
| `PUT` | `/api/bids/:id/reject` | Client | Reject a bid |

Protected endpoints require `Authorization: Bearer <token>`.

## Security and configuration

Copy `.env.example` to `.env` and provide a local MongoDB URI plus a unique, strong `JWT_SECRET`. Do not commit `.env` files, database credentials, or hosted service keys. Credentials that appeared in earlier public versions should be revoked and rotated before deployment.

## Roadmap

- Add end-to-end tests for the complete client–freelancer flow.
- Add a public demo with disposable seed data.
- Add messaging, payments, reviews, and project-delivery states.
- Add CI checks for dependency installation, tests, and production builds.
- Add rate limiting and request validation coverage for public endpoints.

## License

MIT

## Contact

- GitHub: [@aggarwalshivam301](https://github.com/aggarwalshivam301)
- Email: [shivaggarwal272@gmail.com](mailto:shivaggarwal272@gmail.com)
