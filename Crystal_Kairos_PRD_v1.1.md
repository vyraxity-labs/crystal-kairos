# Crystal Kairos — Product Requirements Document (PRD)

**Version:** 1.1 (Draft)
**Author:** Olawuyi Kemi (Product), compiled with Claude
**Status:** Draft — pending stakeholder review and sign-off
**Date:** July 4, 2026
**Source Materials:** Crystal Kairos Ventures pitch deck; WhatsApp business-rules discussion; Figma user flow and Whimsical wireframe; in-progress codebase ([github.com/vyraxity-labs/crystal-kairos](https://github.com/vyraxity-labs/crystal-kairos)); stakeholder clarification on offline payment/confirmation model (this version)

> **What changed in v1.1:** This revision incorporates a critical clarification from the product owner: **all money movement (Ajo contributions/payouts, savings deposits/withdrawals, loan disbursement/repayment) happens offline**, outside the app, for now. Users pay into a cooperative bank account and upload a receipt; an **admin manually confirms** the payment before it's reflected in the user's records. The same manual-confirmation pattern applies in reverse when the cooperative disburses money to a user. This version also adds **multi-bank-account management** (for disbursement routing) and a **next-of-kin** feature. These changes touch almost every transactional flow in the app and are reflected throughout this document — most significantly in Sections 8.8–8.10 (new) and the reworked transaction lifecycle in Section 8.2–8.5.

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Goals and Objectives
4. Target Users & Personas
5. User Research Insights
6. Competitive Analysis
7. Scope and Prioritization (MoSCoW)
8. Functional Requirements
9. User Stories
10. User Flow & Design Artifacts
11. Non-Functional Requirements
12. Success Metrics
13. Release Plan
14. Risks, Assumptions & Open Questions
15. Glossary

---

## 1. Executive Summary

Crystal Kairos is a digital cooperative savings platform that reimagines the traditional Nigerian "Ajo" (rotating savings and credit association, also known as "esusu") for a mobile/web-first, digitally verifiable experience. The product removes the interpersonal risk of conventional Ajo — where members can default, disappear, or become incapacitated before their turn to collect — by having Crystal Kairos itself act as the guarantor/insurer of each member's payout.

**Important operating model clarification:** in this phase of the product, Crystal Kairos does **not** move money programmatically through a payment gateway. Instead, all financial transactions are **offline-initiated and admin-confirmed**:

- When a user owes a payment (Ajo contribution, savings deposit, loan repayment), they pay directly into the cooperative's designated bank account, then **upload a receipt/proof of payment** in the app.
- An **admin reviews the receipt** on an admin dashboard and either **confirms** (crediting the record to the user's Ajo group, savings plan, or loan account) or **rejects** it (with a reason, prompting the user to re-upload or contact support).
- When Crystal Kairos owes a user money (Ajo payout, savings maturity, loan disbursement), the **admin manually disburses** the funds to one of the user's registered bank accounts and marks the disbursement as **paid** in the admin dashboard, which then reflects in the user's in-app ledger.
- Users may register **multiple bank accounts**; payouts and disbursements are routed to a bank account the user selects (or has set as default) at the point of triggering the transaction (e.g., choosing where an Ajo payout should land).
- Users may also register one or more **next of kin**, so the cooperative has a designated contact/beneficiary on record in case of a member's incapacitation or death — directly addressing the very risk (members becoming "incapacitated" mid-cycle) that motivated Crystal Kairos in the first place.

The app therefore functions, for now, as a **system of record and workflow tool** layered on top of manual banking activity — not a payments processor. This has significant implications for UX (every money screen needs a "pending admin confirmation" state), for the admin experience (which becomes a first-class, high-traffic surface), and for trust/fraud controls (receipt authenticity, reconciliation, and turnaround time all become core product concerns).

### 1.1 Vision Statement

> "To become Africa's most trusted digital cooperative savings platform, empowering individuals and groups to save, borrow, and achieve financial goals securely."

### 1.2 Mission / Motto

- **Vision (cooperative motto):** To ensure no member is financially stranded.
- **Motto:** "All for one and one for all."

---

## 2. Problem Statement

Traditional, informal Ajo groups are widely used across Nigeria for group savings and access to lump-sum capital, but they carry structural risks that Crystal Kairos is built to solve:

- Fund mismanagement by collectors who physically hold contributed cash.
- Fraud and lack of transparency in who has paid, how much, and when.
- Members defaulting on contributions, especially once they have already collected their payout.
- Poor record-keeping, typically manual or memory-based, leading to disputes.
- Limited access to emergency funds or loans outside the Ajo cycle itself.
- In the worst cases, only the first two or three members in a 6-person group are reliably paid; later members are left stranded when earlier collectors become unable or unwilling to pay, occasionally requiring police intervention to compel repayment.
- **No formal mechanism for what happens to a member's contributions or entitlements if they die or become incapacitated mid-cycle** — a gap the new next-of-kin feature directly addresses.

Crystal Kairos addresses this by having the cooperative stand behind every payout: a participant does not need to know, trust, or depend on other members — they receive their disbursement on schedule regardless of other members' payment status, in exchange for a service fee scaled to the financial risk the cooperative absorbs on their behalf. In this phase, that guarantee is operationalized through **verified bank transfers reconciled by an admin**, rather than automated payment rails.

---

## 3. Goals and Objectives

### 3.1 Business Goals

- Formalize informal Ajo participation into a transparent, digitally verifiable cooperative product — even while the underlying money movement remains manual/offline.
- Generate sustainable revenue through Ajo maintenance fees, savings-plan margin, loan interest, and (proposed) membership fees.
- Build a large, retained member base that cross-sells into savings and loan products (Gold/Silver/Member tiers).
- Establish Crystal Kairos as a trusted brand in a market that already has fear of losing money and lack of trust in group-savings schemes — reinforced here by transparent receipt trails and admin-confirmed records.

### 3.2 Product Goals

- Ship an MVP that removes the top pain points surfaced in user research: fear of losing money, lack of trust, and difficulty tracking contributions — achieved via a clear, auditable receipt-upload-and-confirmation trail rather than automated payments (for now).
- Provide full transparency and an auditable trail for every Ajo, savings, and loan transaction, including who confirmed it, when, and against what receipt.
- Make joining an Ajo group, submitting a contribution, and requesting a payout as low-friction as possible within a manual-confirmation model (fast admin turnaround is a product-critical metric, not just an operations concern).
- Provide members with a credible, fast path to loans, which is the feature most differentiated versus incumbents (PiggyVest, Cowrywise).
- Give the admin team a dashboard fit for high-volume, low-error manual reconciliation, since this is now a core, frequently used surface rather than a back-office afterthought.

---

## 4. Target Users & Personas

### 4.1 Primary Persona — "Aisha" (Member)

| Attribute | Detail |
|---|---|
| Age | 34 |
| Occupation | Small business owner |
| Motivation | Participates in Ajo to access working capital for her business |
| Needs | Secure savings and quick access to loans; a simple way to prove she's paid |
| Frustrations | Frustrated by unreliable group members in traditional Ajo; wants fast confirmation once she's paid, not radio silence |

### 4.2 New Persona — "Mr. Bello" (Admin / Cooperative Officer)

| Attribute | Detail |
|---|---|
| Role | Cooperative staff member responsible for reconciling payments |
| Daily task | Reviews a queue of uploaded receipts against the cooperative's bank statement, confirms or rejects each, and processes outgoing disbursements |
| Needs | A fast, low-error way to review receipts, cross-reference bank alerts, and keep an audit trail; bulk actions where safe |
| Frustrations | Manual reconciliation is currently done ad hoc (e.g., over WhatsApp); needs structure to avoid missed or duplicate confirmations as volume grows |

### 4.3 Secondary Audiences

- Individual savers looking for fixed, regular, or staggered savings products with competitive interest.
- Salary/informal earners who want short-tenure, no-collateral loans and are willing to save first to qualify for better loan terms.
- Existing cooperative members being migrated from a manual/WhatsApp-based process to the app.
- Next of kin / designated beneficiaries, who may need to be contacted or verified by the cooperative in an eventuality (not app users themselves in V1, but their data is captured and stored).

---

## 5. User Research Insights

Common pain points identified among Ajo participants during discovery interviews:

- Fear of losing money
- Lack of trust in collectors and co-members
- Difficulty tracking contributions
- Need for accessible loans
- Desire for convenience, transparency, and accountability

These map directly onto the receipt-upload-and-confirmation model: users need to **see** the status of their payment (uploaded → pending review → confirmed) at every step, or the manual process will reintroduce the very "did my money actually get recorded?" anxiety the app is meant to remove.

---

## 6. Competitive Analysis

| Feature | Traditional Ajo | PiggyVest | Cowrywise | Crystal Kairos |
|---|---|---|---|---|
| Group Savings | Yes | No | No | Yes |
| Digital Tracking | No | Yes | Yes | Yes |
| Loan Access | Limited | Limited | Limited | Yes (full loan product) |
| Automated Collection | No | Yes | Yes | **No (manual, receipt-based) — for now** |
| Traditional Ajo Structure | Yes | No | No | Yes |
| Admin-Verified Manual Payments | N/A | No | No | **Yes (differentiator for markets without reliable payment-gateway access, at the cost of speed)** |

Crystal Kairos's differentiation is combining the culturally familiar rotating-savings structure with digital trust and loan access — but, unlike PiggyVest/Cowrywise, it currently trades payment automation for a manually-confirmed, receipt-based trust model. This should be framed to users as **"every transaction is checked and confirmed by a real person,"** turning the current technical limitation into a trust narrative, while the roadmap moves toward automated payment rails in a later phase (see Section 13.3).

---

## 7. Scope and Prioritization (MoSCoW)

### 7.1 Must Have (MVP — Version 1.0)

- Digital Ajo groups (create/join, defined payout order, fee preview)
- **Offline payment workflow**: receipt upload for contributions, repayments, and savings deposits
- **Admin Dashboard**: receipt review queue, confirm/reject actions, disbursement recording
- **Multi-bank-account management**: add/edit/remove bank accounts, select default/payout account
- **Next of kin management**: add/edit next-of-kin details
- Wallet-equivalent ledger (reflects admin-confirmed transactions only, not live balances from a payment processor)
- Loan management (application, guarantor/collateral capture, admin-confirmed disbursement and repayment)

### 7.2 Should Have (Fast-follow)

- Target, fixed, regular, and staggered savings plans with interest accrual (still admin-confirmed deposits/withdrawals)
- Notifications and reminders (contribution due, receipt confirmed/rejected, payout disbursed, loan due, defaulter alerts)
- Admin-side bulk actions and basic reconciliation reporting

### 7.3 Could Have (Later phases)

- Credit scoring engine to drive loan eligibility and pricing
- Investment products beyond savings and Ajo
- **Automated payment gateway integration** (bank transfer APIs / card payments) to remove manual receipt confirmation entirely — the natural evolution once transaction volume justifies it

### 7.4 Out of Scope for V1

- Public "name-and-shame" defaulter board — legal/reputational review required before build
- Guarantor dividend payout automation (proposed in loan T&Cs but not yet specified in enough detail to build)
- Paid membership/renewal billing (currently free; monetization proposed for future review)
- Automated payment collection/disbursement (explicitly deferred; V1 is manual/admin-confirmed by design, per stakeholder direction)
- Multi-currency or cross-border support
- Next-of-kin self-service portal or claims workflow (next of kin details are captured for record-keeping only in V1; the claims/eventuality process itself is an offline, human-handled process outside the app for now)

---

## 8. Functional Requirements

### 8.1 User Registration & Membership

Every user must complete a membership form to receive a unique membership number before they can participate in any Crystal Kairos package. This membership number is required for loan access and for verifying a user's activity within the system.

#### 8.1.1 Membership Tiers

| Tier | Definition |
|---|---|
| Gold Member | A member who participates in Savings packages |
| Silver Member | A member who participates in Ajo only |
| Member | A user who has only taken a loan |

#### 8.1.2 Membership Fees & Renewal

- Membership registration is currently free (subsidized by management).
- Annual renewal is currently free.
- **Proposed future pricing (not yet active):** ₦5,000 membership fee and ₦2,000 annual renewal fee.
- Membership status is not permanent — it must be renewed yearly.

> ⚠ **Open Question:** The historical FAQ states free registration "till the end of 2022" and proposes future paid tiers. Product must confirm the current, live pricing policy with the business owner before implementing billing logic.

---

### 8.2 Digital Ajo Groups (Core Product)

An Ajo group lets members contribute a fixed amount on a recurring cadence (daily/weekly/monthly) for a fixed duration, with each member assigned a turn ("pick order") at which they receive the pooled payout. Crystal Kairos guarantees the payout on schedule regardless of other members' payment status, and charges a maintenance/service fee that decreases the earlier vs. later a member is scheduled to collect.

**Revised transaction model:** contributions are paid by the member directly into the cooperative's bank account outside the app; the member then uploads a receipt in-app, which enters an admin confirmation queue. The member's ledger only reflects the contribution once an admin confirms it. Payouts work in reverse: the admin disburses funds to the member's selected bank account and marks the payout as paid, which then appears in the member's in-app ledger and notification feed.

#### 8.2.1 Group Setup Parameters

- Contribution amount (e.g., ₦10,000)
- Cadence: daily, weekly, or monthly
- Duration: e.g., 4 months / 16 weeks, or standard 6-month / 12-month plans
- Pick order: the month/week in which the member elects to cash out

#### 8.2.2 Worked Example (from stakeholder brief)

Scenario: ₦10,000/month contribution, 4-month Ajo.

| Pick Position | Gross Payout | Fee Basis | Fee % | Fee Amount | Net Payout |
|---|---|---|---|---|---|
| 1st | ₦40,000 | ₦30,000 (amount advanced by company) | 10% | ₦3,000 | ₦37,000 |
| 2nd | ₦40,000 | ₦20,000 (amount advanced) | 7% | ₦1,400 | ₦38,600 |
| 3rd | ₦40,000 | ₦10,000 (amount advanced) | 4% (also cited as 3%) | ₦300–400 | ₦39,600–39,700 |
| 4th (Last) | ₦40,000 | ₦0 advanced (self-funded) | 1% | — | ₦~39,600+ |

Logic: the fee is charged only on the portion of the payout that Crystal Kairos is fronting ahead of the member's own contributions to date.

> ⚠ **Open Question:** The brief gives two slightly different versions of this 4-position fee schedule. Engineering should implement fee tiers as a configurable table per plan length rather than hard-coding percentages, and product must confirm the authoritative schedule with finance before launch.

#### 8.2.3 Standard 6-Month Plan Fee Schedule

| Pick Position | Fee (% of amount received) |
|---|---|
| 1st | 10% of amount given to the member |
| 2nd | 8% of amount given, minus the member's own contribution |
| 3rd | 6% of amount given, minus the member's own contribution |
| 4th | 4% of amount, added to their contribution |
| 5th | 2% of amount, added to their contribution |
| 6th (Last) | 1% of amount, added to their contribution |

#### 8.2.4 Standard 12-Month Plan Fee Schedule

| Pick Position | Fee % |
|---|---|
| 1st | 20% |
| 2nd | 18% |
| 3rd | 16% |
| 4th | 14% |
| 5th | 12% |
| 6th | 10% |
| 7th | 8% |
| 8th | 6% |
| 9th | 4% |
| 10th | 2% |
| 11th | 1% |
| 12th (Last) | 1% |

> ⚠ **Open Question:** The 6-month and 12-month schedules, and the two 4-position worked examples, are not fully mathematically reconciled in the source material. Before implementation, finance/product must publish one canonical formula: `{fee_base, fee_percentage}` per `(plan_length, pick_position)`, modeled as data, not hard-coded logic.

#### 8.2.5 Ajo Functional Requirements

1. The system shall allow a member to create an Ajo group by specifying contribution amount, cadence, and duration (4-month/16-week case studies, plus standard 6-month and 12-month plans).
2. The system shall allow members to join an existing Ajo group and select an available pick position.
3. The system shall calculate and display the applicable maintenance fee and net payout for a given pick position before the member confirms their selection.
4. **The system shall allow a member to record a contribution by uploading a receipt/proof of payment (image or PDF) tied to a specific group and due date.**
5. **Each uploaded receipt shall enter an admin review queue with status `Pending Review`.**
6. **The system shall allow an admin to `Confirm` or `Reject` a receipt.** On confirmation, the contribution is credited to the member's ledger and the group's pool. On rejection, the admin must supply a reason, and the member is notified to re-upload or contact support.
7. **The system shall allow an admin to record and mark a payout as `Disbursed`**, specifying the amount, date, and the member's selected receiving bank account. This updates the member's in-app ledger and triggers a notification.
8. The system shall maintain a transparent, member-visible ledger of all contributions and payouts within a group, including the status of each (Pending Review / Confirmed / Rejected / Disbursed).
9. The system shall send reminders ahead of each contribution due date, and status-change notifications when a receipt is confirmed, rejected, or a payout is disbursed.

---

### 8.3 Savings Packages

Three savings modes are supported, distinct from Ajo:

| Type | Description |
|---|---|
| Fixed Savings | Save a bulk amount (e.g., ₦100,000) for a fixed term (6 months or 1 year) and collect the principal plus interest at maturity. |
| Regular Savings | Save a specific amount on a recurring cadence (daily, weekly, or monthly) toward a term goal (e.g., 6 months). |
| Staggered Savings | Save any amount, on any day, at any time, with no fixed schedule. |

#### 8.3.1 Interest Rates

| Plan | Term | Interest |
|---|---|---|
| Fixed Savings | 6 months | 12% |
| Fixed Savings | 1 year | 36% |
| Regular Savings | 6 months | 4.5% |
| Regular Savings | 1 year | 10.5% |

#### 8.3.2 Savings Rules

- No penalty for early withdrawal — a member can request their cash at any time.
- **Trade-off:** withdrawing before term-end forfeits the term interest (4.5%/10.5% for regular savings; by extension, fixed savings early withdrawal should forfeit the 12%/36% interest, pending confirmation).
- **Loan eligibility:** members on either savings plan are entitled to borrow up to double the amount they have saved, as a cooperative member.

#### 8.3.3 Revised Savings Transaction Model

- Every savings deposit follows the same offline pattern as Ajo contributions: the member pays into the cooperative's account, uploads a receipt, and an admin confirms it before the amount is added to the member's savings balance.
- Every savings withdrawal (at maturity, or early with interest forfeited) is admin-processed: the admin disburses funds to the member's selected bank account and marks the withdrawal as `Disbursed`, which updates the member's balance and ledger.

> ⚠ **Open Question:** The brief does not specify whether "no penalty, request anytime" also applies to Fixed Savings (typically less liquid by design) or only to Regular Savings. Confirm before building the withdrawal flow.

---

### 8.4 Loan Packages

#### 8.4.1 Baseline Loan Terms

| Segment | Interest | Collateral | Guarantor | Processing Time |
|---|---|---|---|---|
| Members | 5% per month | Not required | Required (must be a Crystal member) | 3–7 days |
| Non-Members | 10% per month | Required | Not specified | 1–2 weeks |

#### 8.4.2 Refined Loan Interest Tiers (per later review)

| Tier | Condition | Interest | Max Term | Other Fees |
|---|---|---|---|---|
| 1 | Member without savings | 5% per month | 6 months | — |
| 2 | Member with savings, loan < ₦20,000 | 0% (interest-free) | 1 month | ₦500 bank transfer charge |
| 3 | Member with savings, loan ₦20,000–₦100,000 | 5% per month | 2 months | ₦2,000 application form fee |
| 4 | Member with savings, loan > ₦100,000 | 3.5% per month | 3–6 months | ₦2,000 application form fee |
| 5 | Non-member | 10% per month | Not specified | Collateral required |

> ⚠ **Open Question:** Sections 8.4.1 (baseline) and 8.4.2 (refined tiers) appear to be two iterations of the same policy from different points in the WhatsApp discussion. Confirm with the business owner which is authoritative.

#### 8.4.3 Loan Terms & Conditions / Default Handling

- A grace period of 1 week after the due date is granted before a loan is considered late.
- Loans repaid after the grace period incur a fine and are re-rated at a 10% default interest rate for the defaulting period.
- A discount is available for members who repay before their due date.
- Guarantors receive dividends from the cooperative whenever a member they guaranteed (their "referee") repays successfully and on time.
- **Public defaulter disclosure** (naming defaulters and guarantors with photos) is marked Out of Scope pending legal review (see Section 11.5).

#### 8.4.4 Revised Loan Transaction Model

- **Disbursement:** once a loan is approved, the admin disburses the approved amount to the member's selected bank account and marks the loan as `Disbursed` in the admin dashboard; this triggers the repayment schedule and updates the member's in-app loan record.
- **Repayment:** the member pays into the cooperative's bank account and uploads a receipt against a specific repayment installment; an admin confirms the receipt, which marks that installment as `Paid` and updates the loan balance and (if applicable) grace-period/default status.
- **Guarantor dividends**, if implemented, would also follow admin-confirmed disbursement to the guarantor's selected bank account (deferred to a later phase per Section 7.3/13.3).

#### 8.4.5 Loan Functional Requirements

1. The system shall allow a member to apply for a loan, capturing amount, term, and (if required) collateral and guarantor details.
2. The system shall automatically determine the applicable interest tier based on membership status and existing savings balance.
3. The system shall route non-member loan applications through a collateral-verification step before approval.
4. **The system shall allow an admin to approve a loan application and record its disbursement**, including the destination bank account and disbursement date.
5. **The system shall allow a member to upload a receipt against a specific repayment installment**, which enters the admin confirmation queue.
6. **The system shall allow an admin to confirm or reject a repayment receipt**, updating the loan's outstanding balance and status accordingly.
7. The system shall track repayment schedules, apply the 1-week grace period, and flag overdue loans for the default interest rate.
8. The system shall record and surface guarantor relationships and (in a later phase) calculate guarantor dividends.

---

### 8.5 Wallet / Ledger (Revised)

Because there is no live payment-processor balance in this phase, the "Wallet" is reframed as a **consolidated ledger** reflecting all admin-confirmed activity across Ajo, Savings, and Loans, plus any general-purpose deposits/withdrawals a member makes outside those specific products.

- The ledger shall display a running balance derived only from `Confirmed`/`Disbursed` transactions — never from a `Pending Review` receipt, to avoid giving members a false sense of available funds.
- Each ledger entry shall show its type (Ajo / Savings / Loan / General), status (Pending Review / Confirmed / Rejected / Disbursed), date, amount, and — where relevant — the linked receipt and the bank account used.
- Members may submit a **general wallet top-up** (receipt-based, admin-confirmed) or a **general withdrawal request** (admin-disbursed to a selected bank account), independent of a specific Ajo/Savings/Loan product, if the product decides to support a general-purpose balance.

> ⚠ **Open Question:** Confirm whether a general-purpose wallet balance (not tied to a specific Ajo/Savings/Loan product) is in scope for V1, or whether all funds must always be attributed to a specific product ledger. This affects both the data model and the UI.

---

### 8.6 Notifications & Reminders

- Automated reminders ahead of each Ajo contribution or loan repayment due date.
- **Notification when a receipt upload is confirmed or rejected** (with reason, if rejected).
- **Notification when a payout, savings withdrawal, or loan disbursement has been marked `Disbursed` by an admin**, including which bank account it was sent to.
- Notification on savings plan maturity.

---

### 8.7 Admin & Transparency (Revised — Admin Dashboard is now a core surface)

The admin dashboard is no longer a lightweight back-office view — it is a **primary, high-frequency workspace** given that every transaction in the system passes through it.

#### 8.7.1 Admin Dashboard Requirements

1. The system shall provide an admin-only dashboard listing all `Pending Review` receipts across Ajo contributions, savings deposits, and loan repayments, sorted by oldest first by default.
2. Each pending item shall show: member name and membership number, transaction type, amount claimed, uploaded receipt (viewable inline), date uploaded, and associated group/plan/loan.
3. The admin shall be able to **Confirm** (crediting the member's ledger) or **Reject** (with a mandatory reason) each item, individually or via bulk-select for same-type/same-amount batches where appropriate.
4. The system shall provide a separate **Disbursement queue**: Ajo payouts due, savings withdrawals due/requested, and approved-but-undisbursed loans — each showing the member's selected destination bank account.
5. The admin shall be able to mark a disbursement item as **Disbursed**, optionally attaching a reference number/proof of transfer, which updates the member's ledger and triggers their notification.
6. The system shall maintain a full audit log of every admin action (who confirmed/rejected/disbursed what, and when), immutable and exportable.
7. The system shall verify each member's identity/data against their unique membership number before granting access to loans; members flagged as unverifiable should be surfaced to admins for manual review rather than being silently cut off.
8. The admin dashboard shall support basic filtering/search (by member, group, date range, status, transaction type) given the manual-review volume this model implies.

---

### 8.8 Bank Account Management (New)

1. The system shall allow a member to **add one or more bank accounts** (bank name, account number, account name), to be used as destinations for Ajo payouts, savings withdrawals, and loan disbursements.
2. The system shall support a **name-match/verification check** where feasible (e.g., confirming the account name matches the member's registered name) to reduce disbursement errors and fraud risk.
3. The member shall be able to **set a default bank account** and, at the point of triggering a payout/withdrawal/disbursement request, **choose which registered account** it should be sent to (defaulting to the default account).
4. The system shall allow members to **edit or remove** a bank account, with appropriate safeguards (e.g., cannot remove the only account tied to a pending disbursement without selecting a replacement).
5. The admin dashboard's disbursement queue (Section 8.7.1) shall always display the specific bank account selected for each pending disbursement to avoid manual lookup errors.
6. The system shall maintain a history of which bank account was used for each past disbursement, for audit purposes.

> ⚠ **Open Question:** Confirm whether bank account verification will use a third-party account-name-lookup service (e.g., a bank verification/BVN-linked API) or remain a manual admin check in V1. This has cost, latency, and fraud-risk implications.

---

### 8.9 Next of Kin Management (New)

1. The system shall allow a member to add **next-of-kin details**: full name, relationship to member, phone number, and (optionally) email and address.
2. The system shall allow a member to add **more than one next of kin** where desired, with an indication of primary/priority contact.
3. Next-of-kin details shall be **editable at any time** by the member.
4. Next-of-kin information shall be visible to admins (for use in an eventuality such as a member's incapacitation or death) but shall **not** be visible to other members.
5. **V1 scope note:** the next-of-kin feature in this phase is limited to **capturing and storing** this information for the cooperative's records. Any claims process, verification of an eventuality, or fund release to a next of kin is an **offline, human-handled process** outside the app (see Section 7.4) — the app's role is solely to make sure this data exists and is reachable when needed.
6. The system should prompt users to add next-of-kin details during or shortly after onboarding (e.g., a dashboard reminder banner if the field is empty), given its importance to the product's core promise of protecting members from being "financially stranded."

---

### 8.10 Transaction Lifecycle Summary (New — cross-cutting reference)

To keep the admin-confirmation model consistent across Ajo, Savings, and Loans, all money-in and money-out flows should use the same underlying status model:

**Money-in (member owes Crystal Kairos — contribution, deposit, repayment):**

`Awaiting Payment` → `Receipt Uploaded (Pending Review)` → `Confirmed` (credited to ledger) *or* `Rejected` (returns to `Awaiting Payment` with a reason, prompting re-upload)

**Money-out (Crystal Kairos owes the member — payout, withdrawal, disbursement):**

`Due / Requested` → `Approved` (where applicable, e.g., loans) → `Disbursed` (admin confirms transfer to selected bank account, reference optionally attached) → reflected in member ledger + notification sent

This shared model should be implemented as one reusable transaction/status entity in the codebase rather than three separate implementations for Ajo/Savings/Loans, both for engineering efficiency and to guarantee consistent admin UX across transaction types.

---

## 9. User Stories

- As a saver, I want to join an Ajo group so I can save with others.
- As a member, I want automatic contribution reminders so I don't miss a payment.
- **As a member, I want to upload a receipt after I've paid my contribution, so my payment gets recorded against my Ajo group.**
- **As a member, I want to see whether my uploaded receipt is still pending review, confirmed, or rejected, so I always know the true status of my payment.**
- **As a member, I want to be notified immediately when my receipt is confirmed or rejected, so I'm not left wondering.**
- As a user, I want to track my savings balance in real time (reflecting only admin-confirmed activity).
- As a borrower, I want to apply for a loan quickly and see my eligible interest tier upfront.
- **As a borrower, I want to upload proof of repayment and see it reflected in my outstanding balance once confirmed.**
- **As a member, I want to add and manage multiple bank accounts, and choose which one my Ajo payout or loan disbursement goes to.**
- **As a member, I want to add my next of kin's details, so the cooperative knows who to contact if something happens to me.**
- **As an admin, I want a single queue of all pending receipts across Ajo, Savings, and Loans, so I can efficiently confirm or reject payments.**
- **As an admin, I want a separate queue of disbursements that are due, showing each member's selected bank account, so I can process payouts accurately.**
- **As an admin, I want every confirm/reject/disburse action logged with my identity and a timestamp, so the cooperative has a full audit trail.**
- As a member with savings, I want to see how much loan I qualify for (up to 2x my savings) directly from my savings dashboard.
- As a guarantor, I want visibility into the repayment status of loans I've guaranteed.

---

## 10. User Flow & Design Artifacts

The end-to-end onboarding and navigation flow (sign-up, login, password reset, and dashboard branches into Home, Get Loan, Join Ajo, Invest, Track Savings, and Cash Out) has been mapped in Google Stitch:

**Note for this revision:** these existing flows predate the offline-payment/admin-confirmation model and do not yet include receipt-upload steps, transaction-status states, the admin dashboard, bank-account management, or next-of-kin screens. These flows should be updated (or a companion design brief generated) to reflect Sections 8.2–8.10 above before high-fidelity design work proceeds.

---

## 11. Non-Functional Requirements

### 11.1 Security

- All member funds data, KYC details, bank account details, next-of-kin data, and transaction history must be encrypted in transit and at rest.
- Membership number/verification data should be the single source of truth for loan eligibility checks.
- **Uploaded receipts (images/PDFs) must be stored securely with access restricted to the uploading member and authorized admins.**

### 11.2 Reliability & Availability

- Since payouts depend on admin action rather than an automated job, the product should define and monitor an **admin turnaround-time SLA** (e.g., receipts reviewed within X business hours) as a reliability metric in place of system uptime for payment processing.

### 11.3 Auditability

- Every fee calculation, interest accrual, and payout must be traceable to the specific rule/version that produced it, given the evolving and sometimes conflicting fee schedules in the current business rules.
- **Every admin confirm/reject/disburse action must be logged immutably** (admin identity, timestamp, before/after state, attached receipt or disbursement reference) — this is now a core requirement, not a nice-to-have, since the admin is the sole point of truth for whether money actually moved.

### 11.4 Compliance

- As a cooperative offering savings and lending products, Crystal Kairos should confirm applicable regulatory requirements (e.g., cooperative society registration, CBN/financial-conduct considerations for taking public deposits and issuing loans) before scaling beyond a closed member base.
- **Storing next-of-kin and bank account data introduces additional data-protection obligations (e.g., NDPR in Nigeria)** — confirm consent language and data-retention policy for this data.

### 11.5 Privacy & Reputational Risk

- The proposed public "name and shame" defaulter/guarantor disclosure feature carries meaningful data-privacy and reputational risk and should not be built without legal review.
- Next-of-kin data should never be visible to other members and should be scoped to admin-only access, used strictly for the cooperative's own record-keeping in an eventuality.

### 11.6 Fraud & Reconciliation Risk (New)

- **Receipt fraud** (fabricated, altered, or duplicate receipts) is a first-order risk in a manual-confirmation model; the admin dashboard should support surfacing potential duplicates (e.g., same receipt image or reference number uploaded twice) to reduce double-crediting.
- **Reconciliation drift** — admins confirming a receipt without the money having actually landed in the cooperative's account — should be mitigated with admin training/process (e.g., cross-checking against a bank statement) as this is a process, not purely a software, risk; the software should make cross-checking as easy as possible (e.g., surfacing amount and expected payer name prominently).

### 11.7 Usability

- Given that user research surfaced "fear of losing money" and "lack of trust" as top concerns, every screen involving money movement (contribution, payout, loan disbursement) should surface a clear, real-time status (Pending Review / Confirmed / Rejected / Disbursed) to reinforce trust, precisely because the underlying process is manual and could otherwise feel opaque or slow.

---

## 12. Success Metrics

### 12.1 Business Metrics

- Number of active users
- Number of active Ajo groups
- Monthly transaction volume
- Loan repayment rate

### 12.2 Product Metrics

- User retention rate
- Contribution completion rate
- Average savings per user
- Customer satisfaction score

### 12.3 Operational Metrics (New — specific to the admin-confirmation model)

- **Average admin turnaround time** from receipt upload to confirm/reject decision
- **Receipt rejection rate** (and reasons breakdown), as a signal of user confusion or fraud attempts
- **Disbursement turnaround time** from a payout/withdrawal becoming due to being marked `Disbursed`
- **Percentage of members with a verified bank account on file**
- **Percentage of members with next-of-kin details on file**

---

## 13. Release Plan

### 13.1 Version 1.0 (MVP Launch) Features

- User registration and verification
- Create and join Ajo groups
- **Receipt upload for contributions, savings deposits, and loan repayments**
- **Admin dashboard: pending-receipt review queue and disbursement queue**
- **Multi-bank-account management**
- **Next-of-kin management**
- Wallet/ledger reflecting admin-confirmed transactions
- Loan application and admin-confirmed disbursement/repayment tracking

### 13.2 Phase 2 (Should Have)

- Full interest-bearing savings plan variants (fixed, regular) with maturity payout automation (still admin-confirmed disbursement)
- Expanded notification types (guarantor alerts, maturity alerts)
- Admin-side bulk actions and basic reconciliation reporting/exports

### 13.3 Phase 3 (Could Have)

- Credit scoring engine to dynamically price loans
- Additional investment products
- Guarantor dividend automation
- **Automated payment gateway/bank-transfer API integration**, removing the need for manual receipt upload and admin confirmation for standard transactions — the long-term direction once volume and reliability requirements justify the integration cost

---

## 14. Risks, Assumptions & Open Questions

### 14.1 Key Risks

- Conflicting/ambiguous fee and interest schedules across source material could lead to incorrect member payouts if implemented as-is.
- The core Ajo model requires Crystal Kairos to front capital to early collectors before later members have paid — this creates liquidity/solvency risk for the cooperative, compounded by the fact that money movement is manual and slower to reconcile. A treasury/liquidity-reserve policy should be defined.
- **Admin bottleneck risk:** as the member base grows, a manual confirm/reject/disburse workflow could become a scaling constraint; the admin dashboard's efficiency (bulk actions, filtering, clear queues) directly determines how far this model can scale before Phase 3 automation becomes necessary.
- **Receipt fraud and reconciliation error risk**, as outlined in Section 11.6.
- Regulatory exposure from operating a savings-and-loan cooperative digitally at scale, now compounded by handling next-of-kin and multi-bank-account personal data.
- Reputational/legal risk from the proposed public defaulter list.

### 14.2 Assumptions

- All monetary values are in Nigerian Naira (₦).
- The cooperative has (or will designate) one or more official bank accounts into which members pay, and admins have visibility into that account's statement for reconciliation.
- The existing Figma/Whimsical artifacts and in-progress GitHub codebase remain the front-end starting point but will need updates to reflect the offline-payment model described here.

### 14.3 Open Questions (consolidated)

- Which Ajo fee schedule is authoritative, and how does it generalize to arbitrary group sizes/durations?
- Does the "withdraw anytime, no penalty" rule apply to Fixed Savings, or only Regular Savings?
- Is the baseline loan table (8.4.1) or the refined tiered table (8.4.2) the current live policy?
- What is the current, active membership fee policy?
- Will the public defaulter/guarantor disclosure feature proceed at all, and if so, in what legally-reviewed form?
- How are guarantor dividends calculated and paid out?
- **Is bank account verification manual (admin) or automated (third-party API) in V1?**
- **Is a general-purpose wallet balance (not tied to a specific product) in scope for V1?**
- **What is the target admin turnaround SLA for receipt confirmation, and how many admins/what tooling is needed to hit it at expected launch volume?**
- **What happens, process-wise, when a next-of-kin claim is actually triggered?** (Explicitly out of scope for the app in V1, but the business process should exist somewhere.)

---

## 15. Glossary

| Term | Definition |
|---|---|
| Ajo | A traditional rotating savings and credit association (ROSCA) where members contribute periodically and take turns collecting the pooled amount. |
| Pick Position | The turn (month/week number) at which a member is scheduled to collect their Ajo payout. |
| Gold Member | A member participating in Savings packages. |
| Silver Member | A member participating in Ajo only. |
| Guarantor | A Crystal Kairos member who vouches for a borrower without savings-backed collateral, and may receive dividends when that borrower repays successfully. |
| Referee | The borrowing member associated with a given guarantor. |
| Maintenance Fee | The service fee Crystal Kairos charges on the portion of an Ajo payout it fronts ahead of a member's own contributions. |
| Receipt | Proof of payment (image or PDF) uploaded by a member after paying into the cooperative's bank account offline. |
| Pending Review | The status of an uploaded receipt or requested transaction before an admin has confirmed or rejected it. |
| Confirmed | The status applied by an admin once a receipt has been verified as a genuine payment, crediting the member's ledger. |
| Disbursed | The status applied by an admin once a payout, withdrawal, or loan amount has been paid out to a member's selected bank account. |
| Next of Kin | A designated contact/beneficiary recorded by a member for use by the cooperative in the event of the member's incapacitation or death. |
