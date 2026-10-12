# ScamRadar — Implementation Context & Progress

## 1. Project Overview & Architecture
- **Application**: ScamRadar — Real-Time AI Scam Intelligence, Blockchain Proof Explorer & Threat Defense System
- **Frontend**: React 19 (`^19.2.8`), Vite (`^8.2.2`), Tailwind CSS (`^4.3.3`), Three.js (`^0.183.2`), `@react-three/fiber` (`^9.5.0`), `@react-three/drei` (`^10.7.7`), React Router DOM (`^7.18.2`), Axios (`^1.20.0`), Leaflet (`^1.9.4`), React-Leaflet (`^5.0.0`), Recharts (`^3.10.1`), Framer Motion (`^13.1.1`), Lucide React.
- **Backend**: Express 5 REST API, MongoDB Mongoose ODM, Google Gemini 3.1 Flash Lite via `@google/genai`, Ethers.js 6, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), In-Memory Sliding-Window Rate Limiting.
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

### Phase 3: Advanced Intelligence & Pattern Forensics (Checkpoints 8 – 10)
- **Checkpoint 8**: Multimodal Screenshot OCR & Suspicious Message Threat Scanner (`ScannerPage.jsx`, `/api/intelligence/scan-ocr`, `/api/intelligence/analyze-evidence`), editable review textarea, ephemeral in-memory processing (zero file retention), actionable defensive safe next steps checklist.
- **Checkpoint 9**: URL & Email Intelligence Engine (`UrlEmailIntelPage.jsx`, `/api/intelligence/analyze-url`, `/api/intelligence/analyze-email`), RFC 5322 header anomaly detector, SPF/DKIM flags, deterministic fact vs AI separation, SSRF Protection Subsystem blocking loopback, cloud metadata (169.254.169.254), and private CIDR ranges.
- **Checkpoint 10**: Scam Pattern Graph Correlation Engine (`PatternGraphPage.jsx`, `/api/intelligence/patterns`), interactive SVG topological graph, anonymized PII nodes, explicit `POSSIBLE` relationship labeling, ethical non-accusatory disclaimer.

### Phase 4 & 5: Advanced Features & Final Production Release (Checkpoints 11 – 14)

### Checkpoint 11 — Scam Alert System
- **Configurable Threat Alert Rules (`AlertsPage.jsx` & `/api/alerts`)**:
  - Filter by scam categories (`UPI_FRAUD`, `KYC_SCAM`, `PHISHING`, `JOB_SCAM`, etc.).
  - Minimum risk severity threshold (`LOW`, `MEDIUM`, `HIGH`).
  - Geographic city monitoring (e.g. Mumbai, Delhi, Bengaluru, Kolkata).
  - In-app notification center and browser notification permission toggles.
- **Real Threat Data Only**:
  - Alerts are generated exclusively from genuine database `ScamReport` records.
  - Zero fabricated alerts or synthetic notification spam.
- **Deduplication Engine**:
  - Compound MongoDB unique index on `{ user: 1, relatedReportId: 1 }` prevents duplicate alerts for the same underlying threat.
- **Notification Lifecycle**:
  - Read/unread states with timestamp tracking (`isRead`, `readAt`).
  - Unread badge counter in desktop navbar and mobile drawer with live polling.
  - Single-click mark as read and bulk mark all as read (`PUT /api/alerts/read-all`).

### Checkpoint 12 — Private Evidence Vault
- **Strict User Partition & Authorization (`VaultPage.jsx` & `/api/vault`)**:
  - Client-isolated evidence dossiers referencing authenticated `user: ObjectId`.
  - Database queries strictly enforce `{ user: req.user._id }`.
  - Zero public leakage: Public APIs never return vault case dossiers or private attachments.
- **Dossier Management**:
  - Auto-generated case numbers (`SR-CASE-YYYY-XXXXXX`).
  - Lifecycle states (`OPEN`, `UNDER_REVIEW`, `SUBMITTED_TO_AUTHORITIES`, `RESOLVED`, `CLOSED`).
  - Financial impact tracker (claimed loss vs recovered amounts).
  - Suspect identifier registry (phone, UPI, URL, email, bank account).
- **Secure Evidence Storage**:
  - File validation enforcing permitted MIME types (PNG, JPG, WEBP, PDF, TXT) and strict 5 MB file size limit.
  - Encrypted base64 data payloads with thumbnail previews and download handlers.
- **Investigation Tools**:
  - Interactive chronological incident timeline milestones (e.g., "Reported to Bank", "Filed FIR at Cyber Cell").
  - Private encrypted scratchpad for investigation notes.
  - Financial transaction logger recording UPI UTRs and gateway references.

### Checkpoint 13 — Community Trust & Report Moderation
- **Algorithmic Credibility Scoring (`moderation.service.js`)**:
  - Baseline score = 40.
  - Evidence completeness bonus: valid suspect identifier (+15), detailed description (+10), location (+5).
  - Multi-source corroboration bonus: cross-matches from `Identifier` collection award up to +20.
  - Moderator verdicts: `VERIFIED_ACCURATE` (+20), `FLAGGED_INACCURATE` (-35), `DISPUTED` (-15).
  - Trust level tiers: `UNVERIFIED` (<50), `MODERATE` (50-74), `HIGH` (75+), `CORROBORATED` (80+ with 2+ sources).
- **Formal Dispute Filing Process (`ReportDetailPage.jsx` & `/api/reports/:id/dispute`)**:
  - Public or authenticated entities can file disputes with name, email, relationship, reason, detailed refutation, and supporting documentation link.
  - Automatically flags target report as `DISPUTED` and recalculates credibility score.
- **Role-Protected Moderation Console (`ModerationPage.jsx` & `/api/moderation`)**:
  - Accessible only to `MODERATOR` and `ADMIN` roles (`requireRole` middleware).
  - Review queue: Inspect reports, apply verdicts (`VERIFIED_ACCURATE`, `FLAGGED_INACCURATE`, `DISPUTED`), record audit notes.
  - Dispute resolution desk: Inspect filed claims, uphold disputes (flagging report inaccurate), or dismiss disputes (verifying report).
  - Strict presumption of innocence and neutral terminology enforcement.

### Checkpoint 14 — Advanced Threat Intelligence
- **Real Time-Series Trend Aggregations (`DashboardPage.jsx` & `/api/reports/trends`)**:
  - MongoDB `$dateTrunc` / `$dateToString` aggregation grouped by day, week, or month across configurable time windows (7d, 30d, 90d, 365d).
  - Tracks incident velocity, high-risk counts, and average risk score progression.
- **Category Deep-Dive Analytics (`/api/reports/category-analytics`)**:
  - Real percentage distribution, average risk scores, and high-risk proportion per scam category.
- **Geographic Hotspots (`/api/reports/hotspots`)**:
  - Clusters incident volume by `location.city`, calculating average risk score and coordinates.
- **Multi-Parameter Filtered Queries (`getReports`)**:
  - Real-time filtering by category, risk level (`HIGH`, `MEDIUM`, `LOW`), minimum risk score, city, state, date range (`startDate`, `endDate`), and moderation status with pagination.

---

## 3. Complete Security Audit & Hardening Matrix

| Security Domain | Mitigation / Architecture | Verification Status |
| :--- | :--- | :--- |
| **Authentication & RBAC** | Signed JWT Bearer tokens with 7-day expiration, bcrypt password hashing (10 salt rounds), role-based middleware (`requireRole(["MODERATOR", "ADMIN"])`). | **VERIFIED** |
| **Private Vault Isolation** | Database queries strictly enforce `user: req.user._id`. User B blocked with 403/Unauthorized when attempting to access User A's case dossier. | **VERIFIED** |
| **Rate Limiting** | Sliding-window in-memory limiter (`MemoryRateLimiter`) with garbage-collected buckets. Dedicated limits for auth (20 req / 15 min), scanner (15 req / min), and general API (120 req / min). | **VERIFIED** |
| **SSRF Defense** | Validates hostnames & resolved DNS IPs against private, loopback, and cloud metadata CIDR ranges (169.254.169.254, 127.0.0.1, etc.). | **VERIFIED** |
| **File Upload Validation** | Strict MIME type whitelist (PNG, JPG, WEBP, PDF, TXT) and 5 MB file size limit on evidence uploads. | **VERIFIED** |
| **Zero Private Key Exposure** | Blockchain private keys remain exclusively in server environment; explorer endpoints use public JSON-RPC reads only. | **VERIFIED** |
| **CORS & Input Sanitization** | Restrictive CORS headers, Joi schema validation on report creation, projection out of sensitive fields (`password`, heavy base64 payloads in list queries). | **VERIFIED** |
| **Upstream AI Fallback** | Defensive heuristic security classifiers automatically engage if Google Gemini API experiences high demand (503) or rate limits. | **VERIFIED** |

---

## 4. Test Matrix & Verification Status

| Test Suite | Command | Result | Verification Details |
| :--- | :--- | :--- | :--- |
| **Phase 4 & 5 Advanced Test Suite** | `node tests/phase4-advanced.test.js` | **PASS (All Tests)** | Verified JWT auth, bcrypt hashing, alert preferences, deduplication, unread states, vault isolation, timeline milestones, file validation, credibility scoring, formal disputes, time-series trends, and category aggregations. |
| **Blockchain Verification Test Suite** | `node tests/blockchain-verify.test.js` | **PASS (All Tests)** | Verified on-chain SHA-256 byte match (`VERIFIED`), unregistered report status, and non-existent report 404 handling. |
| **Phase 3 Intelligence Test Suite** | `node tests/intelligence.test.js` | **PASS (27/27 passed)** | Verified SSRF loopback blocking, metadata blocking, URL facts vs AI, email header mismatch, SPF/DKIM flags, message threat analysis, and pattern graph correlation. |
| **Live API HTTP Integration** | Node HTTP test suite | **PASS** | Verified `/api/health`, `/api/reports/trends`, `/api/reports/category-analytics`, `/api/reports/hotspots`, `/api/auth/register`, `/api/alerts`, and `/api/vault/cases` against live server on port 5000. |
| **Frontend Production Build** | `npm run build` | **PASS** | Vite built clean production bundle in 1.23s; all chunks valid. |
| **Frontend Linter Check** | `npm run lint` | **PASS** | 0 errors across 61 files. |

---

## 5. End-to-End Repeatable Demo Flow

1. **Cyber Threat Globe & Home HUD (`/`)**:
   - Explore interactive Three.js 3D globe with real coordinates plotted from `/api/reports/map`.
   - Click any threat node to inspect incident details in the floating HUD.
2. **Scam Verification (`/check`)**:
   - Check an identifier (e.g. `9876543210`); observe live risk score gauge and registered community incidents.
3. **Screenshot OCR & Message Scanner (`/scanner`)**:
   - Paste suspicious SMS/WhatsApp text or upload a screenshot; inspect extracted text in editable review area and view AI threat analysis with safe defensive next steps.
4. **URL & Email Intelligence (`/intelligence/url-email`)**:
   - Scan a suspicious link (e.g. `sbi-kyc-update.xyz`); observe verified facts (TLD, brand keywords, SSL) separated from AI interpretation.
   - Test loopback address (`127.0.0.1`) to see SSRF defense trigger and block the probe.
5. **Scam Pattern Intelligence Graph (`/intelligence/patterns`)**:
   - Explore interactive network graph correlating related scam reports with masked PII and explicit `POSSIBLE` relationship labels.
6. **Blockchain Proof Explorer (`/explorer`)**:
   - Audit report `6a914e6632a4ccf1de34b5fc` to verify canonical SHA-256 hash match against the smart contract registry on Hardhat node.
7. **Security Portal & Authentication (`/auth`)**:
   - Click "Demo Citizen" to sign in or create an account; inspect active JWT session.
8. **Private Evidence Vault (`/vault`)**:
   - Create a case dossier (e.g. "Unauthorized Electricity SMS Scam"); add a timeline milestone, log a UPI UTR reference, and attach a screenshot.
9. **Threat Alert Center (`/alerts`)**:
   - Configure alert rules (select categories, minimum risk level, cities); click "Sync Alerts" to evaluate real database threats matching rules without duplication.
10. **Report Credibility & Dispute System (`/reports/:id`)**:
    - Open any incident report; view Community Trust score and click "Dispute This Report" to file a formal claim.
11. **Moderation Console (`/moderation`)**:
    - Sign in as "Demo Moderator"; review credibility queue, apply verdicts (`VERIFIED_ACCURATE` / `FLAGGED_INACCURATE`), and resolve disputes.
12. **Threat Intelligence Analytics (`/dashboard`)**:
    - Inspect real daily/weekly/monthly time-series trend charts (Recharts), category breakdown, and city hotspots.

---

## 6. 3D Cyber Threat Globe & Frontend Layout Stabilization

| Component / Module | Root Cause & Problem | Fix & Architectural Solution | Verification |
| :--- | :--- | :--- | :--- |
| **API Client (`axios.js`)** | Hardcoded fallback port or missing proxy path on dev environment | Set fallback `baseURL` to `/api` (proxied by Vite to port 5000), respecting `VITE_API_URL`. Prevents CORS and network failures. | Tested direct & proxied calls (HTTP 200). |
| **API Hook (`useApi.js`)** | Rejected promises thrown in `onClick={fetchStats}` and `useEffect` produced unhandled rejections | Added `safeExecute`, caught errors in retry handlers and initial mount effects, ensuring clean reactive state transitions without unhandled console errors. | Verified clean mounts and retries. |
| **Error & Empty States (`ErrorState.jsx`, `EmptyState.jsx`)** | Oversized disrupting error banners in statistics; no visual feedback during retry | Added `compact` layout mode, animated retry spinner with disabled state during in-flight refetches, and graceful empty state when feeds have 0 items. | Verified compact layout in telemetry section. |
| **3D Cyber Threat Globe (`CyberThreatGlobe.jsx`)** | Displayed "0 Plotted Coordinates" and generic wireframe ball; inner rotation desynced markers | 1. Implemented procedural cyber Earth texture (`getCyberWorldTexture()`) with equirectangular world continent boundaries (`CONTINENT_POLYGONS`) and neon cyber dot-matrix.<br>2. Synchronized Three.js assembly: removed inner sphere rotation; camera `OrbitControls` rotates the unified scene.<br>3. Upgraded markers with illuminated core spheres, pulsating halo rings, vertical beacon lines, and strict risk color mapping (`#ef4444`, `#f59e0b`, `#10b981`).<br>4. Dispersed multi-report collisions at identical coordinates ($\pm 0.55^\circ$).<br>5. Replaced "0 Plotted Coordinates" with friendly "No geolocated reports yet" and informative radar telemetry notice. | Verified with real Kolkata database reports; 3D globe rendered with glowing continents and interactive markers. |
| **Threat Inspector Overlay (`HomePage.jsx`)** | Clicking markers had no visible inspector UI on HomePage | Integrated glassmorphic "Threat Inspector" overlay on hero globe: displays city, state, modality, risk score, on-chain proof badge, and direct link to report record. | Tested marker click and inspection panel. |
| **Navbar Layout (`Navbar.jsx`)** | 10 wide nav links caused wrapping/clipping on 1024px–1280px laptops; collapsed into hamburger prematurely | Grouped navigation into core links (`Verify`, `Threat Map`, `Scanner`, `Analytics`, `Emergency`) and an "Intel Tools" dropdown (`Patterns`, `Vault`, `Alerts`, `Safety`, `Explorer`) for desktop (`lg:flex`), keeping full categorized list in mobile drawer (`lg:hidden`). | Verified responsive rendering from 1024px to 4K without horizontal overflow. |
