# ScamRadar — Implementation Context & Progress

## 1. Project Overview & Architecture
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

### Phase 2: Trust, Emergency & Awareness (Checkpoints 5 – 7)
- **Checkpoint 5**: Public Blockchain Proof Explorer (`ExplorerPage.jsx`), exact canonical SHA-256 serialization matching smart contract storage, 4 handled verification states (`VERIFIED`, `NOT_REGISTERED_ON_CHAIN`, `HASH_MISMATCH`, `RPC_UNAVAILABLE`), Zero Private Key exposure guarantee.
- **Checkpoint 6**: Emergency Help Center (`EmergencyPage.jsx`), 5-step Golden Hour protocol, interactive evidence checklist with `localStorage` persistence, verified official contacts (`1930`, `cybercrime.gov.in`, `sancharsaathi.gov.in`, RBI Sachet, bank hotlines), anti-recovery scam warning.
- **Checkpoint 7**: Safety Center & Awareness Lab (`SafetyPage.jsx`), 11 complete scam defense guides, interactive Awareness Lab Quiz with scoring and explanations, multilingual support in English (`en`), Bengali (`bn`), and Hindi (`hi`).

---

### Phase 3: Advanced Intelligence & Pattern Forensics (Checkpoints 8 – 10)

### Checkpoint 8 — Screenshot OCR & Message Scanner
- **Dual Input Modes (`ScannerPage.jsx`)**:
  - Drag-and-drop or file picker for screenshot images (PNG, JPEG, WebP) with strict client-side validation (max 5 MB).
  - Direct paste option for SMS, WhatsApp, Telegram, or email messages with loadable real-world test scenarios.
- **Optical Character Recognition (OCR)**:
  - Ephemeral multimodal OCR transcription using Google Gemini (`gemini-3.1-flash-lite`).
  - **Editable Review Textarea**: Extracted text is presented in an editable review area before running AI threat evaluation, allowing users to correct any OCR typos or append context.
  - Graceful handling of unreadable screenshots: returns clear guidance if no legible text is detected.
- **AI Threat Evaluation**:
  - Predicts scam classification, numerical risk score (0-100), and categorical risk level (`LOW`, `MEDIUM`, `HIGH`).
  - Specific **Threat Indicators Detected** (e.g. "Artificial urgency", "Unauthorized contact number to bypass support", "Threat of service termination").
  - Detailed **AI Threat Explanation**.
  - Actionable **Safe Next Steps Checklist** (e.g. "Do not call the phone number provided", "Verify status only through official portal").
  - Direct "Prefill Incident Report" button pre-populating `ReportForm` for community reporting.
- **Data Privacy & Zero File Retention**:
  - Images are processed in-memory as base64 buffers and immediately released; zero raw images are written to server disk.
  - Explicit UI disclaimer warning users never to upload private government identity documents (Aadhaar, Passport) or banking credentials.

### Checkpoint 9 — URL & Email Threat Intelligence
- **URL Intelligence Analyzer (`UrlEmailIntelPage.jsx` & `intelligence.service.js`)**:
  - Normalizes URLs and extracts **Verified Deterministic Facts**:
    - Hostname, main domain, TLD, High-Risk TLD detection (`.xyz`, `.top`, `.click`, `.buzz`, etc.), SSL protocol scheme (`HTTPS` vs insecure `HTTP`), port, IP-as-host, Punycode/IDN homograph attack detection, and detected target brand keywords (`sbi`, `kyc`, `hdfc`, `fedex`, etc.).
    - Cross-references with ScamRadar database for prior reported incident counts.
  - **Reputation Signals**:
    - Evaluates local database occurrences and structural risks.
    - Explicitly treats unavailable third-party reputation as **`UNKNOWN`**, never defaulting to `SAFE`.
  - **SSRF Protection Subsystem (`ssrf.util.js`)**:
    - Validates target hostnames and resolved IP addresses against private / loopback / reserved CIDR blocks:
      - IPv4: `0.0.0.0/8`, `10.0.0.0/8`, `100.64.0.0/10`, `127.0.0.0/8`, `169.254.0.0/16`, `172.16.0.0/12`, `192.168.0.0/16`, `198.18.0.0/15`, `224.0.0.0/4`, `240.0.0.0/4`.
      - IPv6: `::1`, `fc00::/7`, `fe80::/10`, `ff00::/8`, `::ffff:0:0/96`.
      - Metadata targets: `169.254.169.254`, `metadata.google.internal`, `localhost`.
    - Automatically blocks internal network probes with an immediate SSRF Security Alert banner.
    - Enforces request timeout (3500ms), max redirect limit, response size cap (100KB), and non-execution of content.
  - **Fact vs. AI Separation**:
    - Clearly delineates deterministic verified facts (TLD, SSL, IP format, port) from heuristic AI interpretation (risk score, targeted brand, threat summary, red flags).
- **Email Intelligence Analyzer**:
  - Analyzes message body text for urgency triggers, credential harvesting, and payment coercion.
  - **RFC 822/5322 Header Parser**:
    - Parses `From:`, `Reply-To:`, `Return-Path:`, `Subject:`, `Authentication-Results:`, `Received-SPF:`, `DKIM-Signature:`.
    - Detects **Sender Mismatches**: flags when `From` domain differs from `Reply-To` (e.g. `From: security@bank.co.in` but `Reply-To: phisher@scam-mail.top`).
    - Inspects SPF, DKIM, and DMARC verification results (`PASS`, `FAIL`, `UNKNOWN`).
    - Privacy Guarantee: Operates without requiring mailbox passwords, OAuth tokens, or email account access.

### Checkpoint 10 — Scam Pattern Intelligence & Graph Correlation
- **Correlation Engine (`intelligence.service.js`)**:
  - Correlates reports in ScamReport database using multi-vector similarity heuristics:
    - Shared exact or prefix-matched identifiers (phones, UPI handles, domains).
    - Geographic proximity clusters (same city and state).
    - Tactical Modus Operandi similarity (shared scam category and attack vectors).
- **Interactive SVG Network Graph (`PatternGraphPage.jsx`)**:
  - Interactive nodes:
    - **Incident Reports** (color-coded by risk severity).
    - **Masked Identifiers** (blue/cyan with lock indicator).
    - **Location Clusters** (green/emerald city nodes).
    - **Threat Vectors** (purple/indigo modus operandi hubs).
  - Force-style circular layout with interactive pan, zoom, and drag-and-drop node positioning.
  - Edges labeled with explicit **`POSSIBLE`** relationship qualifications:
    - `POSSIBLE: Associated Identifier`
    - `POSSIBLE: Shared Identifier Corroboration`
    - `POSSIBLE: Geographic Proximity`
    - `POSSIBLE: Similar Modus Operandi`
- **Performance & Ethical Safeguards**:
  - Performance limits: Max Nodes limit slider (10 to 60 nodes) and category/city filters prevent DOM bloat.
  - Selected Node / Edge Inspector Drawer displays underlying reports, correlation confidence percentages, and direct incident links.
  - Privacy: All phone numbers, emails, and UPI VPAs are cryptographically masked (`maskValue`).
  - Ethical Disclaimer: Relationships are derived from statistical pattern correlation; ScamRadar explicitly avoids declaring personal legal guilt or making judicial accusations.

---

## 3. Files Modified & Created in Phase 3

### Created Files
- `Backend/src/utils/ssrf.util.js`: SSRF guard with private/loopback/cloud metadata IP validation and safe fetch wrapper.
- `Backend/src/services/intelligence.service.js`: Multimodal OCR extraction, evidence threat analysis, URL intelligence, RFC email header parsing, and scam pattern correlation graph generator.
- `Backend/src/controllers/intelligence.controller.js`: Handlers for OCR scan, evidence analysis, URL inspection, email analysis, and pattern graph.
- `Backend/src/routes/intelligence.routes.js`: API routes mounted at `/api/intelligence`.
- `Backend/tests/intelligence.test.js`: 27-assertion automated integration test suite.
- `Frontend/src/api/intelligence.api.js`: Client API module for intelligence endpoints.
- `Frontend/src/pages/ScannerPage.jsx`: Screenshot OCR & message threat scanner UI with review textarea.
- `Frontend/src/pages/UrlEmailIntelPage.jsx`: URL & Email intelligence analyzer UI with SSRF alert banner.
- `Frontend/src/pages/PatternGraphPage.jsx`: Interactive SVG pattern intelligence graph with filters and drawer.

### Modified Files
- `Backend/src/app.js`: Mounted `/api/intelligence` routes and configured `10mb` JSON payload limit for screenshot buffers.
- `Frontend/src/App.jsx`: Mounted `/scanner`, `/intelligence/url-email`, and `/intelligence/patterns` lazy routes.
- `Frontend/src/components/layout/Navbar.jsx`: Added `Scanner`, `Threat Map`, `Patterns`, `URL/Email`, and `Emergency` navigation links.
- `Frontend/src/components/layout/Footer.jsx`: Added links to OCR Scanner, Pattern Graph, and URL/Email Intel.

---

## 4. Tests Performed & Verification Evidence

All tests below were executed directly and verified:

| Test Suite | Target / Command | Result | Verification Details |
| :--- | :--- | :--- | :--- |
| **Phase 3 Intelligence Test Suite** | `node tests/intelligence.test.js` | **PASS (27/27 passed)** | Verified SSRF loopback blocking, metadata blocking, URL facts vs AI, email header mismatch, SPF/DKIM flags, message threat analysis, and pattern graph correlation |
| **SSRF Loopback Block Test** | `POST /api/intelligence/analyze-url` (127.0.0.1) | **PASS** | Blocked with `isBlockedBySecurity: true` and private IP alert |
| **SSRF Cloud Metadata Block Test** | `POST /api/intelligence/analyze-url` (169.254.169.254) | **PASS** | Blocked with `reputation: "MALICIOUS"` |
| **URL Facts vs AI Distinction** | `POST /api/intelligence/analyze-url` (sbi-kyc-update.xyz) | **PASS** | TLD `.xyz` flagged, brand keywords detected, risk score 95/100 |
| **Email Header Mismatch Test** | `POST /api/intelligence/analyze-email` | **PASS** | Detected `hasReplyToMismatch: true`, `spfStatus: "FAIL"`, `dkimStatus: "FAIL"` |
| **Evidence Threat Scanner Test** | `POST /api/intelligence/analyze-evidence` | **PASS** | Returned risk score 95, specific indicators, and safe next steps |
| **Pattern Graph Correlation Test** | `GET /api/intelligence/patterns?limit=25` | **PASS** | Returned nodes, edges with `POSSIBLE` relationship labels, and ethical disclaimer |
| **Phase 2 Blockchain Regression Test** | `node tests/blockchain-verify.test.js` | **PASS** | Validated `VERIFIED` state (`6a914e66...`), missing report 404, and SHA-256 byte match |
| **Frontend Production Build** | `npm run build` | **PASS** | Vite built clean production bundle in 1.79s; all chunks valid |
| **Frontend Linter Check** | `npm run lint` | **PASS** | 0 errors across 52 files |

---

## 5. How to Run the Project

### 1. Hardhat Blockchain Node (Local Polygon Simulation)
```bash
cd blockchain
npx hardhat node
```

### 2. Backend Server (Express + AI + Intelligence Engine)
```bash
cd Backend
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Client Application (React 19 + Vite)
```bash
cd Frontend
npm run dev
# Application accessible on http://localhost:5173
```

---

## 6. Known Limitations & Future Roadmap
- **OCR Accuracy**: OCR extraction performance on severely blurry or low-resolution images is dependent on image legibility; the user-editable review area mitigates this by allowing manual corrections.
- **Third-Party Reputation Feeds**: External commercial threat feeds (e.g., Google Safe Browsing, VirusTotal) can be configured via optional API keys in `.env`; in their absence, ScamRadar uses deterministic structural heuristics and database corroboration, treating unavailable third-party data as `UNKNOWN`.
