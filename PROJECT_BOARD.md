# Northstar Sprint — Project Board

**Sprint:** 5 Days | **Status tracked:** To Do → In Progress → In Review → Done  
**Rule:** No task > 4 hrs. Definition of Done must be a single checkable sentence.

---

## Day 1 — Setup Tasks

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 1 | Initialize monorepo with pnpm workspaces, client (Vite+React) and server (Express) | Dennis | 🔴 High | 1 hr | `pnpm install` runs without errors in project root | ✅ Done |
| 2 | Set up MongoDB Atlas cluster and create `.env` with `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` | Dennis | 🔴 High | 30 min | Server connects to DB and `/api/health` returns 200 | ✅ Done |
| 3 | Implement JWT auth — register, login, logout routes + `protect` + `adminOnly` middleware | Dennis | 🔴 High | 2 hrs | POST `/api/auth/login` returns a valid JWT cookie | ✅ Done |
| 4 | Draft and sign Team Charter with all team members | All | 🔴 High | 45 min | `TEAM_CHARTER.md` committed to repo with all signatures | ✅ Done |

---

## Day 2 — Build: Order Status Feature

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 5 | Create `Order` mongoose model with fields: orderId, status, items, tracking, timestamps | Member 3 | 🔴 High | 1 hr | `Order.create({})` persists to DB without validation errors | ✅ Done |
| 6 | Build `GET /api/orders/:orderId` — public endpoint to track by order ID | Dennis | 🔴 High | 1 hr | Returns order JSON with status and items for a valid orderId; 404 for invalid | ✅ Done |
| 7 | Build `GET /api/orders/email/:email` — public guest order lookup by email | Dennis | 🔴 High | 1 hr | Returns array of orders for a valid email; empty array if none found | ✅ Done |
| 8 | Build `CustomerOrders.jsx` with email lookup form + order card + progress bar | Member 2 | 🔴 High | 3 hrs | A guest can enter their email and see a list of orders with status badges | ✅ Done |

---

## Day 2–3 — Build: Returns & Refunds Feature

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 9 | Create `Return` mongoose model with fields: returnId, orderId, reason, status, refundAmount | Member 3 | 🔴 High | 1 hr | `Return.create({})` persists with correct enum validation | ✅ Done |
| 10 | Build `GET /api/returns/policy` — public endpoint returning the 30-day return policy | Dennis | 🟡 Medium | 30 min | Returns policy JSON with windowDays, eligibleConditions, process steps | ✅ Done |
| 11 | Build `POST /api/returns` — authenticated endpoint for customers to submit return requests | Dennis | 🔴 High | 1.5 hrs | Authenticated user can POST a return and receive a returnId in response | ✅ Done |
| 12 | Build `GET /api/returns/email/:email` — public guest return lookup | Dennis | 🔴 High | 45 min | Guest can look up existing returns by email without logging in | ✅ Done |
| 13 | Build `CustomerReturns.jsx` with policy display, email lookup, and return status cards | Member 2 | 🔴 High | 3 hrs | Guest sees return status + refund amount when entering their email | ✅ Done |

---

## Day 3 — Build: Stock Availability Feature

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 14 | Create `Product` mongoose model with fields: name, category, variants (size/color/stock), totalStock, isAvailable | Member 3 | 🔴 High | 1 hr | Product with nested variants saves and `totalStock` is computed correctly | ✅ Done |
| 15 | Build `GET /api/stock/search?query=&category=` — public product search | Dennis | 🔴 High | 1 hr | Searching "headphone" returns matching products; empty query returns all | ✅ Done |
| 16 | Build `StockPage.jsx` with search bar, category filter, stock-level tabs, and variant display | Member 2 | 🔴 High | 3 hrs | User can search a product and see In Stock / Low Stock / Out of Stock badge plus size variants | ✅ Done |

---

## Day 3 — Build: Admin Panel & Help Center

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 17 | Build Admin dashboard with order management — view all orders, update status to shipped/delivered | Dennis | 🟡 Medium | 2.5 hrs | Admin can change an order status from processing → shipped and a tracking number is saved | ✅ Done |
| 18 | Build Admin returns panel — view all returns, update status, set refund amount | Dennis | 🟡 Medium | 2 hrs | Admin can mark a return as refunded and set a KES amount | ✅ Done |
| 19 | Build `HelpPage.jsx` with FAQ accordion, quick-link tiles, and search | Member 2 | 🟡 Medium | 2 hrs | FAQ accordion opens/closes; quick links navigate to orders, returns, stock, contact pages | ✅ Done |

---

## Day 4 — Checkpoint

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 20 | Pull commit log + board timestamp snapshot — verify all members have activity | Dennis | 🔴 High | 1 hr | `audit-log.md` created with commit history; contribution balance confirmed | ✅ Done |
| 21 | Fix any non-compliant commit messages from earlier in sprint | All | 🔴 High | 1 hr | All commits follow `<type>: <what> - <why>` format in git log | ✅ Done |

---

## Day 5 — Delivery

| # | Task | Owner | Priority | Est. | Definition of Done | Status |
|---|---|---|---|---|---|---|
| 22 | Write `GO_LIVE_NOTE.md` — what works, what is known-broken, handover instructions | Member 4 | 🔴 High | 1.5 hrs | 1-page document exists in repo root covering all 3 sections | ✅ Done |
| 23 | Update `README.md` with project description, setup steps, live URL, and team | Dennis | 🟡 Medium | 30 min | A new developer can clone the repo and get it running using only the README | ✅ Done |
| 24 | Deploy server to Render, client to Vercel — verify live demo URL works end-to-end | Dennis | 🔴 High | 1.5 hrs | Live URL loads, email lookup returns orders, stock page shows products | ✅ Done |
| 25 | Each member submits individual self-assessment + Peer Reliability Index (confidential) | All | 🔴 High | 45 min | Self-assessment document committed; PRI submitted via confidential channel | ✅ Done |

---

## Board Summary

| Category | Count |
|---|---|
| Total tasks | 25 |
| Tasks ≤ 4 hours | 25/25 ✅ |
| Tasks with owner assigned | 25/25 ✅ |
| Tasks with Definition of Done | 25/25 ✅ |
| Tasks completed | 25/25 ✅ |
