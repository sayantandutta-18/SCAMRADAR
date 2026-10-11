# ScamRadar — Phase 1 & Phase 2 Implementation Context

## 1. Project Overview & Current Architecture
- **Application**: ScamRadar — Real-Time AI Scam Intelligence, Blockchain Proof Explorer & Threat Defense System
- **Frontend**: React 19 (`^19.2.8`), Vite (`^8.2.2`), Tailwind CSS (`^4.3.3`), Three.js (`^0.183.2`), `@react-three/fiber` (`^9.5.0`), `@react-three/drei` (`^10.7.7`), React Router DOM (`^7.18.2`), Axios (`^1.20.0`), Leaflet (`^1.9.4`), React-Leaflet (`^5.0.0`), Recharts (`^3.10.1`), Framer Motion (`^13.1.1`), Lucide React.
- **Backend**: Express 5 REST API, MongoDB Mongoose ODM, Google Gemini 3.1 Flash Lite via `@google/genai`, Ethers.js 6.
- **Blockchain**: Hardhat, Solidity 0.8.24, OpenZeppelin contracts (`ScamReportRegistry.sol` on Polygon / EVM).

---

## 2. Checkpoints Completed

### Phase 1: Threat Intelligence & 3D Globe (Checkpoints 0 – 4)
- **Checkpoint 0**: Baseline Git freeze, `.env.example` templates, secret protection audit.
- **Checkpoint 1**: Resolved API base URL, fixed `useApi` hook execution signatures, fixed response array parsing in `HomePage`, `DashboardPage`, `ScamChecker`, and `ReportForm`.
- **Checkpoint 2**: Cyber UI refresh, glowing neon cybersecurity theme, layout padding decoupling, PII masking toggle (`maskIdentifier`), ethical threat language.
- **Checkpoint 3**: Three.js/R3F Cyber Threat Globe with restrained OrbitControls, ambient/directional lighting, WebGL detection, and responsive fallback.
- **Checkpoint 4**: Real data integration via `GET /api/reports/map`, spherical coordinates conversion, risk indicator pins, interactive HUD, 2D Leaflet & incident list fallbacks, and live `ThreatIntelPanel`.

---

### Phase 2: Trust, Emergency & Awareness (Checkpoints 5 – 7)

### Checkpoint 5 — Public Blockchain Proof Explorer
- **Deterministic Canonical Payload**:
  Reconstructed the exact canonical JSON payload structure used during smart contract anchoring:
  ```javascript
  const canonicalPayload = {
    reportId: report._id.toString(),
    identifier: report.identifier,
    identifierType: report.identifierType,
    message: report.message,
    scamType: report.scamType,
    riskScore: report.riskScore,
    riskLevel: report.riskLevel,
    createdAt: report.createdAt,
  };
  const calculatedHash = `0x${crypto.createHash("sha256").update(JSON.stringify(canonicalPayload)).digest("hex")}`;
  ```
- **Backend Verification Endpoint**:
  - Implemented `verifyReportOnChain(reportId)` in `Backend/src/services/report.service.js`.
  - Added controller `verifyReportController` in `Backend/src/controllers/report.controller.js`.
  - Mounted routes `GET /api/reports/:id/verify` and `GET /api/reports/verify/:id` in `Backend/src/routes/report.routes.js`.
- **4 Cryptographic Verification States Handled**:
  1. `VERIFIED`: Calculated canonical SHA-256 matches on-chain smart contract hash byte-for-byte.
  2. `NOT_REGISTERED_ON_CHAIN`: Report exists in MongoDB database but has not yet been anchored to smart contract.
  3. `HASH_MISMATCH`: Smart contract record exists but hash differs from recalculated payload (tamper detected).
  4. `RPC_UNAVAILABLE`: Hardhat / Polygon RPC node unreachable; surfaces retry option without claiming failure.
- **Cryptographic & Privacy Guarantees**:
  - **Zero Private Key Exposure**: Browser executes strictly read-only view calls (`getReport()`). Private keys are never loaded in browser memory.
  - **No Fake Verification**: A report is never claimed as verified simply because a transaction hash exists in MongoDB.
  - **PII Protection**: Raw phone numbers, victim names, and sensitive details are never written to public blockchain storage; only irreversible 256-bit cryptographic digests.
- **Frontend Explorer UI (`ExplorerPage.jsx`)**:
  - Search by Report ID or select quick-test sample chips.
  - Side-by-side calculated vs on-chain stored hash comparison with visual match indicators.
  - Smart contract transaction metadata viewer (Contract address, Submitter address, Block timestamp, Transaction Hash).
  - Exact Canonical Payload JSON viewer with 1-click copy.
  - Deep integration from `ReportDetailPage.jsx` via "Audit Smart Contract Proof" button.

### Checkpoint 6 — Emergency Help Center
- **Immediate Response Flow (`EmergencyPage.jsx`)**:
  - Prominent "I've Already Been Scammed — Immediate Incident Response" design.
  - **5-Step Golden Hour Protocol**:
    1. *Sever All Communication Immediately*: Stop contact, hang up, never pay unlocking/recovery fees.
    2. *Act Within the Golden Hour*: Freeze banking, initiate chargeback with 12-digit UPI UTR, block cards.
    3. *Purge Malicious Software*: Uninstall AnyDesk, TeamViewer, RustDesk; revoke app permissions; change passwords.
    4. *Lodge Official Complaints*: File on `cybercrime.gov.in`, `sancharsaathi.gov.in` (Chakshu), `sachet.rbi.org.in`.
    5. *Preserve & Assemble Unaltered Evidence*: Maintain original timestamps and logs.
- **Interactive Evidence Checklist**:
  - 8-point checklist covering UPI UTR reference, scammer VPA, chat screenshots, call logs, fraud URLs/APKs, payment receipts, email headers (.eml), and chronological timeline.
  - Real-time completion progress bar.
  - Persistent browser storage via `localStorage` (`scamradar_emergency_checklist`).
  - "Copy Dossier" feature compiles formatted text ready to paste into police FIRs or bank dispute forms.
- **Verified Official Helpline Directory**:
  - Real, verified contact numbers only: National Cyber Crime Helpline `1930`, `cybercrime.gov.in`, DoT Sanchar Saathi / Chakshu, RBI Sachet.
  - Major bank fraud 24/7 hotlines (SBI, HDFC, ICICI, Axis, PNB, Bank of Baroda).
  - Explicit warning alert against secondary "fund recovery" scams (hackers asking for upfront fees).

### Checkpoint 7 — Safety Center & Awareness Lab
- **11 Complete Scam Category Defense Guides (`safetyGuides.js` & `SafetyPage.jsx`)**:
  1. *UPI & QR Code Scams*
  2. *KYC & Bank Account Block Fraud*
  3. *Work-From-Home & Fake Job Scams*
  4. *Investment & Crypto Ponzi Schemes*
  5. *Phishing Websites & Spoofed Domains*
  6. *Courier & Package Delivery Fraud*
  7. *Predatory Instant Loan Apps*
  8. *Lottery, Lucky Draw & KBC Scams*
  9. *Digital Arrest & Law Enforcement Impersonation*
  10. *Romance & Matrimonial Scams*
  11. *Tech Support & Remote Access Fraud*
- **Structured Knowledge Schema**:
  - Warning Signs & Red Flags (⚠️)
  - What to Avoid (🚫)
  - Defensive Actions (🛡️)
  - Official Reporting Options (📢)
- **Interactive Scam Awareness Lab (Quiz Simulator)**:
  - 5 realistic social engineering incident scenarios.
  - Interactive multiple-choice selection with instant visual feedback (Correct vs Vulnerable).
  - Detailed psychological manipulation analysis (explaining urgency, authority bias, bait-and-switch tactics).
  - Reflex scoring system (Cyber Shield Master, Cyber Aware, Vulnerability Detected) with reset capability.
- **Multilingual Support**:
  - Complete support for English (`en`), Bengali (`bn` / বাংলা), and Hindi (`hi` / हिन्दी) across all 11 guides, UI text, and quiz scenarios.
  - Seamless one-click language toggle.

---

## 3. Files Modified & Created in Phase 2

### Created Files
- `Backend/tests/blockchain-verify.test.js`: Integration test suite for canonical hashing and smart contract verification.
- `Frontend/src/data/safetyGuides.js`: Multilingual dataset for 11 scam guides and interactive awareness quiz.
- `Frontend/src/pages/ExplorerPage.jsx`: Blockchain Proof Explorer UI.
- `Frontend/src/pages/EmergencyPage.jsx`: Emergency Help Center UI with Golden Hour protocol and evidence checklist.

### Modified Files
- `Backend/src/services/report.service.js`: Added `verifyReportOnChain` service function with canonical hashing.
- `Backend/src/controllers/report.controller.js`: Added `verifyReportController`.
- `Backend/src/routes/report.routes.js`: Mounted `GET /api/reports/:id/verify` and `GET /api/reports/verify/:id`.
- `Frontend/src/api/reports.api.js`: Exported `verifyReportOnChain(id)` client method.
- `Frontend/src/App.jsx`: Mounted `/explorer` and `/emergency` lazy routes.
- `Frontend/src/components/layout/Navbar.jsx`: Added Proof Explorer (`/explorer`) and high-visibility Emergency (`/emergency`) links with mobile menu support.
- `Frontend/src/components/layout/Footer.jsx`: Added Blockchain Explorer and Emergency Help navigation links.
- `Frontend/src/pages/SafetyPage.jsx`: Complete overhaul with 11 guides, multilingual toggle (EN/BN/HI), micro-tabs, and Awareness Lab Quiz.
- `Frontend/src/pages/ReportDetailPage.jsx`: Added "Audit Smart Contract Proof" deep-link button.

---

## 4. Tests Performed & Verification

| Test | Target | Result | Evidence |
| :--- | :--- | :--- | :--- |
| **Blockchain Verification Test Suite** | `Backend/tests/blockchain-verify.test.js` | **PASS** | Validated `VERIFIED` state (`6a914e66...`), missing report 404, and canonical SHA-256 byte matching |
| **Unregistered On-Chain State Test** | `GET /api/reports/6a9093432608fd4d03a894a6/verify` | **PASS** | Returned `status: "NOT_REGISTERED_ON_CHAIN"`, `verified: false` |
| **Verified On-Chain State Test** | `GET /api/reports/6a914e6632a4ccf1de34b5fc/verify` | **PASS** | Returned `status: "VERIFIED"`, `verified: true`, on-chain hash and transaction hash matching |
| **Non-Existent Report Test** | `GET /api/reports/507f1f77bcf86cd799439011/verify` | **PASS** | Returned HTTP 404 `{ success: false, message: 'Scam report not found' }` |
| **Backend Health Check** | `GET /api/health` | **PASS** | `{ success: true, message: 'ScamRadar API is running' }` |
| **Frontend Production Build** | `npm run build` | **PASS** | Vite built clean production bundle in 2.90s; all chunks valid |
| **Frontend Linter Check** | `npm run lint` | **PASS** | 0 errors across 48 files |

---

## 5. Running the Project

### Prerequisites
- Node.js v18+ (tested on Node v22.12.0)
- MongoDB running locally or Atlas connection configured in `Backend/.env`

### Start Hardhat Node (for Blockchain local development)
```bash
cd blockchain
npx hardhat node
```

### Start Backend API Server
```bash
cd Backend
npm start
# Server listens on http://localhost:5000
```

### Start Frontend Application
```bash
cd Frontend
npm run dev
# Application accessible on http://localhost:5173
```

---

## 6. Next Checkpoint
**Checkpoint 8 — Community Trust & Automated Threat Intelligence**
- Automated batch registration daemon for pending off-chain reports.
- Community voting / reputation scoring for corroborated incident reports.
- Exportable PDF / JSON incident dossier generator with cryptographic QR verification stamps.
