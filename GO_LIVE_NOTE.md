# Northstar Retail Co. — Go-Live Readiness Note

**Project:** Support Deflection MVP  
**Prepared by:** Pod Northstar  
**Date:** August 13, 2026  
**Sprint Duration:** 5 days  
**Prototype Type:** Self-serve customer dashboard + public tracking pages

---

## Section 1: What Works (Demoable End-to-End)

### ✅ Order Status Deflection
- Customers can look up any order using their **email address** or a direct **Order ID** — no login required
- Order status is displayed with a 4-step visual progress bar: Processing → Shipped → Out for Delivery → Delivered
- Tracking number and estimated delivery date are shown when the admin has entered them
- Admin panel allows updating order status, adding tracking numbers, and setting delivery dates

**Demo path:** Visit `/orders` → enter a registered email → see all orders with live status

---

### ✅ Returns & Refunds Deflection
- A **public return policy page** (`GET /api/returns/policy`) answers "How do I return this?" without any human involvement — 30-day window, eligibility conditions, and the 4-step return process are all returned automatically
- Customers can look up the status of **existing return requests** using their email — no login required
- Authenticated customers can submit a **new return request** from their dashboard
- Admin panel allows updating return status through the full lifecycle (requested → approved → received → refund_processing → refunded) and setting the refund amount in KES

**Demo path:** Visit `/returns` → enter email → see return status and refund amount

---

### ✅ Stock Availability Deflection
- Public product catalog at `/stock` — no login required
- Customers can search by product name or filter by category (9 categories supported)
- Stock tabs: All / Good Stock / Low Stock / Out of Stock
- **Variant-level display** — shows each size/color and its individual stock count
- Products with 0 stock show "Out of Stock" badge; 1–9 units show "Low Stock (N left)"; 10+ show "In Stock"

**Demo path:** Visit `/stock` → search a product name → see variant-level availability

---

### ✅ Customer Dashboard (Authenticated)
- Logged-in customers see: active orders count, active returns count, pending refunds count, products in stock count
- Quick action tiles: Track an Order | Request a Return | Check Product Stock
- Popular FAQ links that answer the top 5 support questions before a ticket is ever opened

---

## Section 2: What Is Known-Broken / Limitations

| Issue | Impact | Workaround |
|---|---|---|
| **Guests cannot submit new return requests** | Guests can only look up existing returns; submitting a new return requires login | Direct guest to Sign Up page; return submission takes < 60 seconds |
| **No email notifications** | When an admin updates order/return status, the customer is not notified by email | Customers must actively check the dashboard or tracking page |
| **No real payment integration** | Refund amounts are set manually by admin; no automated payment reversal | Admin sets refund amount; customer receives refund through original payment method manually |
| **Orders must be created by admin** | There is no customer-facing shopping/checkout flow — orders are seeded or created by admin | Northstar's existing e-commerce system creates the orders; this MVP only handles post-purchase support |
| **No stock restock alerts** | Customers cannot subscribe to "back in stock" alerts | Customer must manually check the stock page |
| **Single admin account** | Roles are binary (admin/customer); no sub-roles (e.g., support agent vs. inventory manager) | Use the single admin account for all staff; role expansion is a Phase 2 task |

---

## Section 3: Handover Instructions (For Northstar's Team)

### Prerequisites
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (free tier works)

### Environment Variables

**Server (`server/.env`):**
```
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any long random string>
CLIENT_URL=<your Vercel frontend URL>
NODE_ENV=production
PORT=5000
```

**Client (`client/.env`):**
```
VITE_API_URL=<your Render backend URL>/api
```

### Running Locally
```bash
# From project root
pnpm install
pnpm --filter server run dev     # starts backend on :5000
pnpm --filter client run dev     # starts frontend on :5173
```

### Creating the First Admin Account
```bash
cd server
node src/seedAdmin.js
# Creates: admin@northstar.co / Admin@123
```

### Deployment
- **Backend:** Render.com (see `render.yaml` in project root)
- **Frontend:** Vercel (see `vercel.json` in `client/`)
- Connect your GitHub repo to both platforms; they auto-deploy on push to `main`

### Adding Orders and Products
Log in as admin → navigate to Admin Panel → use the Orders and Products sections to add data.

---

## What Northstar Needs to Pick This Up Without Our Team

1. Set up environment variables (Section 3 above)
2. Deploy backend to Render, frontend to Vercel
3. Run `seedAdmin.js` to create the admin account
4. Add products via the Admin Panel → Products
5. Add orders via the Admin Panel → Orders (or integrate with your existing order management system via the API)

**Live demo URL:** [to be added after deployment]  
**API base URL:** [to be added after deployment]

---

*This note was prepared on Day 5 of the Northstar Sprint. For questions during handover, contact: dennis@example.com*
