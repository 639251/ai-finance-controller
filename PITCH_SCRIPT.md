# 🎙️ Razorpay AI Finance Controller — 5-Minute Pitch Script

> **Target Problem**: Autonomous Finance-Operations 3-Way Reconciliation across 50+ Synthetic Record Batch  
> **Key Metrics**: Match Rate (83.3% Auto-Closed), Anomaly Isolation & HITL Resolution

---

## ⏱️ Minute-by-Minute Pitch Timeline

### 0:00 - 0:45: The Problem & Razorpay Challenge Brief
* *"Hi everyone! In modern corporate finance and B2B operations, finance teams spend hundreds of hours manually reconciling vendor invoices against bank and payment gateway settlement feeds like Razorpay UTRs and Purchase Orders."*
* *"Real-world complexities—such as Section 194C/194J statutory TDS deductions, GST tax rate discrepancies, vendor alias variations, shadow spend with missing POs, and duplicate payments—result in month-end delays and severe cash leakage."*
* *"To solve this, we built the **Razorpay AI Finance Controller**—an autonomous agent that ingests a 50+ record corporate batch, executes multi-pass reconciliation, reports live match rates, and isolates unresolvable exceptions into an intelligent triage console."*

---

### 0:45 - 2:00: Live Demo — The 50+ Batch & Match Rate
* *(Show Dashboard & Click **"Run FinOps Loop"**)*
* *"Here is our executive FinOps dashboard. When I click **Run FinOps Loop**, our autonomous agent processes a 60-record enterprise batch in just 124 milliseconds."*
* *"Notice the top KPIs:*
  * ***Batch Match Rate**: **83.3% Auto-Closed** (50 out of 60 records reconciled).*
  * ***Auto-Closed Volume**: **₹1.36 Crore**.*
  * ***Exceptions Flagged**: **10 records** requiring review.*
  * ***Value at Risk**: **₹19.92 Lakh** in anomalies locked.*
  * ***AI Confidence Index**: **95.2%**.*
* *(Show the Distribution Donut Chart and Recharts Analytics).*

---

### 2:00 - 3:15: Multi-Pass Agent Architecture
* *"How did the agent achieve this? It runs a 4-pass pipeline:*
  1. ***Pass 1: Deterministic Exact Match*** *(100% parity across Invoice #, net amount, and bank UTR).*
  2. ***Pass 2: Statutory TDS Mathematical Match*** *(Automatically identifies Section 194C @ 2% and 194J @ 10% net payouts).*
  3. ***Pass 3: Fuzzy Vendor Alias Match*** *(Normalizes aliases like 'AMZN AWS INDIA' vs 'Amazon Web Services India Pvt Ltd').*
  4. ***Pass 4: Anomaly Diagnostics*** *(Isolates non-compliant edge cases)."*

---

### 3:15 - 4:15: Exception Triage & Human-in-the-Loop (HITL) Resolution
* *(Switch to **"Exception Triage Console"** Tab)*
* *"Look at the unresolved exceptions. Instead of generic errors, our agent provides deep root-cause diagnostics:*
  * ***Amount Mismatch***: *Billed amount differs by ₹8,500 due to an unrecorded line item.*
  * ***GST Tax Discrepancy***: *Vendor billed 28% GST instead of the contracted 18% SAC rate.*
  * ***Missing PO Reference***: *Shadow spend detected without an approved Purchase Order.*
  * ***Duplicate Payment Risk***: *Flagged two independent bank debits referencing the identical invoice.*
* *(Click **"Approve Variance Waiver"** on an exception)*
* *"With 1 click, the Finance Controller approves a policy waiver—and notice how the Match Rate immediately recalculates in real-time!"*

---

### 4:15 - 5:00: Audit Trail, Compliance & Conclusion
* *(Click **"Audit Report"** & show CSV/JSON export)*
* *"Every decision is backed by an automated audit trail exportable as compliance CSV and JSON statements."*
* *"The Razorpay AI Finance Controller transforms tedious finance ops into an autonomous, closed-loop system with complete accuracy, speed, and governance. Thank you!"*
