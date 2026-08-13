# Northstar Sprint — Team Working Agreement (Team Charter)

**Project:** Northstar Retail Co. — Support Deflection MVP  
**Sprint Duration:** 5 days (Day 1 Setup → Day 5 Delivery)  
**Team Name:** Pod Northstar  
**Repository:** `testproject` (monorepo — MERN Stack)

---

## 1. Team Members & Roles

| Member | Role | Primary Area |
|---|---|---|
| Dennis Amutsa | Tech Lead / Full-Stack | Backend API, Auth, DevOps |
| [Member 2 Name] | Frontend Developer | Customer Dashboard, Stock Page |
| [Member 3 Name] | Backend Developer | Returns & Refund routes, Models |
| [Member 4 Name] | QA / Documentation | Testing, Go-Live Note, Audit Log |

> **Signed:** All members below confirm they have read, understood, and agreed to this charter before Day 1 ends.
>
> - Dennis Amutsa ✓  
> - [Member 2] ✓  
> - [Member 3] ✓  
> - [Member 4] ✓

---

## 2. Communication Norms

| Rule | Detail |
|---|---|
| **Primary channel** | WhatsApp group "Pod Northstar" for async updates |
| **Daily standup** | 9:00 AM each day — 3 questions: What did I do yesterday? What will I do today? Any blockers? |
| **Response time** | All messages must be acknowledged within **2 hours** during working hours (8 AM – 8 PM) |
| **Code questions** | GitHub Issues or PR comments — not WhatsApp, so everything is traceable |
| **Blocker rule** | If blocked for **>1 hour**, post in the group immediately — do not wait for standup |

---

## 3. Task & Board Rules

- Every task lives on the **Project Board** before any code is written
- No task may be larger than **4 hours of work** — split it until the Definition of Done is a single checkable sentence
- Board status must be updated **the same day the work is done** — not batched at the end of the week
- Valid statuses: `To Do` → `In Progress` → `In Review` → `Done`
- **Zero visible board or commit activity for 2+ consecutive days** triggers the escalation path (see Section 6)

---

## 4. Commit Convention

All commits **must** follow this format:

```
<type>: <what changed> - <why it matters>
```

**Allowed types:** feat | fix | refactor | docs | style | chore | test

**Good examples:**
- feat: add public order tracking by ID - allows guests to track without login
- fix: correct return status enum to include refund_processing - fixes 400 error on admin update
- docs: add Go-Live note with known limitations and env var list

**Not acceptable:** wip, updates, fixed, done, fixed admin

---

## 5. Deadline Rules

| Milestone | Deadline | Owner |
|---|---|---|
| Charter signed + Board populated (10+ tasks) | End of Day 1 | All members |
| All 3 ticket categories functional (API + UI) | End of Day 3 | Full team |
| Day 4 mid-sprint audit | Start of Day 4 | Tech Lead |
| Go-Live Note written | Day 5, 10 AM | Documentation lead |
| Peer Reliability Index submitted (confidential) | Day 5, before final submission | Each individual |
| Final submission packaged | Day 5, 5 PM | Tech Lead |

---

## 6. Conflict Resolution & Escalation Path

**Level 1 — Peer-to-Peer (first 4 hours):** Raise directly in WhatsApp. Keep it factual.

**Level 2 — Full Team (unresolved after 4 hours):** Bring to standup. Team votes. Decision logged in GitHub Issues.

**Level 3 — External Escalation (unresolved after 24 hours or 0-activity detected):** Tech Lead contacts course coordinator with written summary.

> Zero activity for **2+ consecutive days** skips directly to Level 3.

---

## 7. Quality Standards

- All API routes return consistent JSON shapes
- No hardcoded credentials — environment variables only (.env)
- Every UI component tested manually before task is marked Done
- Prototype must be demoable end-to-end by Day 5
- Go-Live Note must be honest about known broken things

---

## 8. Peer Reliability Index (Confidential)

5-question private evaluation of each teammate on: communication clarity, timeliness, charter adherence, technical contribution, team support.

> Ratings and verbatim comments are **never shared between teammates**.

---

*Last updated: Day 1 of the Northstar Sprint*
