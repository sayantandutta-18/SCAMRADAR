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

---

## 7. Master Execution — Checkpoint 0: Project Audit & Safe Baseline

### A. Architecture Baseline
- **Frontend Stack**: React 19.2.8, Vite 8.2.2, Tailwind CSS 4.3.3 via `@tailwindcss/vite`, React Router DOM 7.18.2 with lazy loading (`Suspense`), Lucide React 1.35.0, Framer Motion 13.1.1, Three.js 0.186.1, `@react-three/fiber` 9.8.1, `@react-three/drei` 10.7.9, Leaflet 1.9.4, Recharts 3.10.1, Axios 1.20.0, Oxlint 1.79.0.
- **Backend Stack**: Express 5.2.1, Node.js 24, MongoDB Mongoose 9.9.3, Google Gemini 3.1 Flash Lite via `@google/genai`, Ethers.js 6.17.0, JWT, Bcrypt.
- **Blockchain Stack**: Hardhat, Solidity 0.8.24, OpenZeppelin (`ScamReportRegistry.sol` on local node / Polygon EVM).
- **Active Daemons**:
  - Hardhat node: port 8545 (running, verified)
  - Backend server: port 5000 (running, verified)
  - Frontend dev server: port 3000 (running, verified)

### B. Identified Issue Checklist (Targeted for Checkpoints 1 – 10)
1. **Critical Syntax & Runtime Bugs**:
   - `ReportsListPage.jsx`: Missing `useMemo` in React import causes `ReferenceError: useMemo is not defined` when navigating to `/reports`.
   - `NotFoundPage.jsx`: Contains redundant `min-h-screen bg-slate-900` inside `<Layout>`, causing double-wrapper height overflow.
2. **Duplicated Headers & Visual Clutter**:
   - `CheckPage.jsx` + `ScamChecker.jsx`: Stacked duplicate headers ("Check Identifier Safety" immediately followed by "Scam Checker").
   - `ReportPage.jsx` + `ReportForm.jsx`: Stacked duplicate headers ("Report a Scam Incident" immediately followed by "Submit a Scam Report").
3. **Navigation & In-App Navigation Gaps**:
   - No standardized in-app Back button component across subpages (`CheckPage`, `ReportPage`, `ScannerPage`, `UrlEmailIntelPage`, `PatternGraphPage`, `VaultPage`, `AlertsPage`, `ModerationPage`, `SafetyPage`, `EmergencyPage`).
   - `ReportDetailPage.jsx`: Hardcodes `/reports` instead of smart history back navigation with fallback.
4. **Form Controls & Button Accessibility**:
   - Buttons inside `IdentifierInput.jsx` and filter widgets lack explicit `type="button"`, causing unintended form submissions.
   - Form inputs lack high-visibility focus-visible rings for keyboard users.
   - Contrast on muted text (`text-slate-500`) falls below WCAG AA on dark backdrops.
5. **Mobile Layout & Chatbot Clashing**:
   - Floating `AIChatbot` widget at `bottom-6 right-6` risks occluding footer links and mobile action buttons on screens $<640\text{px}$.
   - Touch targets on certain small pills and buttons are under $44\text{px}$.
6. **Design System & Typography Tokenization**:
   - Inconsistent padding across page containers (`py-8 sm:py-12` vs `py-16`).
   - Text sizes like `text-[9px]` and `text-[10px]` are illegible on mobile devices and need scaling to minimum `text-xs` (12px).

### C. Checkpoint 0 Acceptance Criteria Verification
- [x] Written issue checklist generated and documented.
- [x] Project architecture, stacks, and routes audited and confirmed without modifying backend.
- [x] Git working tree clean, baseline commit frozen (`4c70fb6`).
- [x] Baseline build and tests passing:
  - Frontend build: `npm run build` succeeds (1.94s).
  - Blockchain tests: `npx hardhat test` succeeds (11/11 passing).
  - Backend health: `GET /api/health` returns HTTP 200.
- **Status**: Checkpoint 0 COMPLETE.

---

## 8. Master Execution — Checkpoint 1: Design System, Typography & CSS Repair

### A. Implemented Fixes
1. **Critical Syntax Fix**: Fixed missing `useMemo` import in `ReportsListPage.jsx` resolving `ReferenceError: useMemo is not defined`.
2. **Double Scrollbar Elimination**: Removed redundant `min-h-screen bg-slate-900` from `NotFoundPage.jsx`.
3. **Tailwind & CSS Cleanup**: Cleaned boilerplate CSS rules from `App.css`. Standardized `:focus-visible` ring indicators across interactive elements.
4. **Accessible Button Design System**: Added `.btn-cyber-primary` and `.btn-cyber-secondary` utility classes in `index.css` with 44px minimum touch targets and cyan cyber glow focus states.
5. **Legibility Enforcement**: Scaled micro-typography across badge tags and labels up to readable minimum sizes.

### B. Checkpoint 1 Acceptance Criteria Verification
- [x] No overlapping text on viewport sizes (375px, 768px, 1024px, 1440px).
- [x] Heading sizes scale proportionally with screen width without clipping.
- [x] Minimum 16px font size on inputs preventing iOS Safari auto-zoom.
- [x] Body text legible with appropriate line-height (`leading-relaxed`).
- [x] Consistent 8px grid spacing system enforced.
- [x] Button and interactive touch targets minimum 44px × 44px on touch viewports.
- [x] Focus-visible rings present on interactive elements for keyboard accessibility.
- [x] Dark mode color contrast passes WCAG AA minimum 4.5:1 for normal text.
- [x] No double scrollbars on any page.
- [x] Zero CSS console errors or unrecognized utility classes.
- [x] Git commit: `ab6579a` - `fix(checkpoint-1): repair design system, typography, focus indicators, and layout CSS`.
- **Status**: Checkpoint 1 COMPLETE.

---

## 9. Master Execution — Checkpoint 2: Navigation & Button Functionality

### A. Implemented Fixes
1. **Universal Reusable BackButton (`BackButton.jsx`)**:
   - Smart browser history navigation (`window.history.length > 2 ? navigate(-1) : navigate(fallbackPath)`).
   - Graceful fallback for direct deep links / URL bookmarks.
   - Styled with chevron, accessible hover states, and focus-visible indicators.
   - Integrated across 16 subpages: `CheckPage`, `ReportPage`, `ReportDetailPage`, `ExplorerPage`, `EmergencyPage`, `SafetyPage`, `ScannerPage`, `UrlEmailIntelPage`, `PatternGraphPage`, `VaultPage`, `AlertsPage`, `ModerationPage`, `DashboardPage`, `MapPage`, `ReportsListPage`, `AuthPage`.
2. **Form Button Accessibility & Submission Guard**:
   - Added explicit `type="button"` and `aria-label` to all tool buttons, modal close controls, filter tags, example pills, and pagination controls across `IdentifierInput.jsx`, `FilterBar.jsx`, `ScamChecker.jsx`, `ReportForm.jsx`, `AIChatbot.jsx`, `ChatWindow.jsx`, `ReportsListPage.jsx`, `DashboardPage.jsx`, and `Navbar.jsx`.
3. **Elimination of Stacked Duplicate Headings**:
   - Added `hideHeader` prop to `ScamChecker.jsx` and `ReportForm.jsx` when embedded in `CheckPage.jsx` and `ReportPage.jsx`.
4. **Complete Route Coverage in Navbar & Footer**:
   - Added prominent desktop "Report Scam" (`/report`) button.
   - Added "Report Incident" (`/report`), "Incident Database" (`/reports`), and "URL & Email Intel" (`/intelligence/url-email`) to navigation menus.
   - Added "Submit Scam Report" to `Footer.jsx`.

### B. Checkpoint 2 Acceptance Criteria Verification
- [x] Universal `BackButton` present and verified on all subpages.
- [x] Direct navigation via URL has working fallback parent route.
- [x] Every button has explicit `type` attribute (`type="button"` vs `type="submit"`).
- [x] Nav links active states match current URL exactly.
- [x] Desktop and mobile navigation include all primary and secondary routes.
- [x] AIChatbot toggle and internal controls accessible with proper aria-labels and keyboard focus.
- [x] Subpages free from duplicate stacked headings.
- [x] Build passes: `npm run build` succeeds (1.28s).
- [x] Lint passes: 0 errors across 62 files.
- [x] Git commit: `092f168` - `fix(checkpoint-2): add universal BackButton, fix button types, eliminate duplicate titles, and complete nav links`.
- **Status**: Checkpoint 2 COMPLETE.

---

## 10. Master Execution — Checkpoint 3: API Integration & Error Handling

### A. Implemented Fixes & Audited Flows
1. **Centrally Configured API Client (`axios.js`)**:
   - Uses `baseURL: import.meta.env.VITE_API_URL || '/api'`, seamlessly integrating with Vite development proxy and production API hosts.
   - Comprehensive response interceptor extracting `serverError`, `errors`, and handling network connection failure gracefully.
2. **Data Normalization Across All Feeds**:
   - `getReportStats`: normalizes `.data` vs direct shape, computing active categories and monitored cities.
   - `getReports`: normalizes `data.data`, `data.reports`, or direct array.
   - `getMapReports`: extracts coordinate reports from `.data` or array, tolerating zero or multiple items.
   - `searchReports`: correctly handles both existing reports (array) and 0 reports without throwing false errors.
   - `createReport`: handles successful creation and returns `reportObj`, with duplicate identifier (409) handling.
   - `verifyReportOnChain`: normalizes on-chain response whether wrapped or direct, gracefully surfacing `RPC_UNAVAILABLE` without false verification.
   - `getTimeSeriesTrends`: default window adjusted to 90 days to visualize historical records immediately on mount.
3. **Empty States vs Error States**:
   - When 0 reports exist in search or database: displays clean `EmptyState` with guidance to report or consult safety guides.
   - When backend is down: displays compact or full `ErrorState` with animated "Retry Connection" button.
   - Added `ErrorState` and `EmptyState` overlays into `PatternGraphPage.jsx` canvas.
4. **Live Verification**:
   - `GET /api/health` -> HTTP 200 (healthy)
   - `GET /api/reports/stats` -> HTTP 200 (4 total reports, 3 high risk, Kolkata)
   - `GET /api/reports?limit=4` -> HTTP 200 (4 real reports)
   - `GET /api/reports/map` -> HTTP 200 (2 geocoded coordinates)
   - `GET /api/reports/search` -> HTTP 200 (1 found for reported phone, 0 found for clean phone with clean empty state)
   - `GET /api/reports/:id/verify` -> HTTP 200 (`RPC_UNAVAILABLE` handled with calculated hash)

### B. Checkpoint 3 Acceptance Criteria Verification
- [x] Centrally configured API base URL (env var with fallback).
- [x] Every API call has try/catch or promise error handling.
- [x] Loading states display LoadingSkeleton components.
- [x] Error states display ErrorState component with working Retry button.
- [x] Empty states display EmptyState component with helpful guidance.
- [x] When API returns 0 items: clean empty state displayed, not an error.
- [x] Data normalizers ensure frontend tolerates variations in API response shape.
- [x] Build passes: `npm run build` succeeds (2.07s).
- [x] Lint passes: 0 errors across 62 files.
- [x] Git commit: `ab70bb1` - `fix(checkpoint-3): audit API integration, error states, and data normalizers across all feeds`.
- **Status**: Checkpoint 3 COMPLETE.

---

## 11. Master Execution — Checkpoint 4: Complete Page-by-Page UX Polish

### A. Implemented Fixes & Feature Enhancements
1. **Page A (Home Page)**:
   - Added instant Quick Check search bar in Hero column with one-click verification submit redirecting to `/check?q=...`.
   - Wired live counters and data normalizers for Total Reports, High Risk Indicators, Scam Modalities Flagged, and Urban Centers Monitored.
   - Restored Threat Inspector overlay for interactive marker selection directly on the hero 3D globe.
2. **Page B (Scam Checker `/check`)**:
   - Integrated query parameter auto-detection (`useSearchParams`) for `?q=` and `?identifier=`.
   - Automatic identifier format detection (`detectIdentifierType`) auto-populates format dropdown.
   - Automated auto-search execution on mount when pre-filled from hero quick check.
   - High-contrast risk gauge, PII masking/unmasking toggle (`maskIdentifier`), and on-chain badge display.
3. **Page C (Scam Reporting `/report` & `ReportForm.jsx`)**:
   - Added live character counter (`{formData.message.trim().length} chars (min 5)`) with warning color indicators.
   - Inline field error messages for identifier and description fields.
   - Double-submission guard with animated loader and disabled state during in-flight submission.
   - Handled duplicate identifier conflict (409) with detailed existing report summary and link.
   - Success screen rendering calculated risk score, AI explanation, and on-chain integrity badge.
4. **Page D (Threat Intelligence Analytics `/dashboard` & `DashboardPage.jsx`)**:
   - Recharts AreaChart with 90-day time-series window grouped by day, week, or month.
   - Decoupled `CustomTooltip` out of render tree to prevent unnecessary re-instantiations.
   - Multi-parameter filter selectors for Risk Level and Scam Category.
   - Category distribution progress bars with percentage share and city hotspot rankings.
5. **Page E (Incident Database `/reports` & `ReportsListPage.jsx`)**:
   - Verified category, risk level, and location filtering.
   - Pagination controls (Previous / Next) with smoothed top-scroll.
   - Graceful EmptyState when filters return 0 records.
6. **Page F (AI Fraud Assistant `AIChatbot.jsx` & `ChatWindow.jsx`)**:
   - Floating widget with pulse animation placed at `bottom-6 right-6` with safe mobile drawer clearance.
   - Message list auto-scroll (`messagesEndRef`), suggested threat questions, and connection failure fallback.
7. **Page G (Blockchain Proof Explorer `/explorer` & `ExplorerPage.jsx`)**:
   - One-click sample report selector buttons (`SAMPLE_REPORTS`).
   - Four discrete verification states (`VERIFIED`, `NOT_REGISTERED_ON_CHAIN`, `HASH_MISMATCH`, `RPC_UNAVAILABLE`).
   - Side-by-side calculated SHA-256 vs on-chain hash display and formatted canonical JSON payload inspector.
8. **Page H (Safety Center & Emergency Hub `/safety` & `/emergency`)**:
   - 11 scam defense guides with warning signs, what to avoid, and reporting options.
   - Multilingual support for English (`en`), Bengali (`bn`), and Hindi (`hi`).
   - Interactive Cyber Threat Awareness Lab quiz with score tracking and explanations.
   - 5-step Golden Hour protocol with direct `1930` dialer, verified government portal links, and persistent evidence checklist.

### B. Acceptance Criteria Verification
- [x] Home page instant Quick Check input functional and redirects seamlessly to `/check?q=...`.
- [x] ScamChecker auto-populates and triggers search when mounted with query parameters.
- [x] Report form has live character counter, inline error validation, and 409 conflict handling.
- [x] Dashboard time-series trends visualize real historical database records over 90 days.
- [x] Reports database pagination and filters verified with zero runtime exceptions.
- [x] Chatbot message auto-scroll and suggested prompts verified.
- [x] Build passes: `npm run build` succeeds (1.97s).
- [x] Lint passes: 0 errors across 62 files.
- [x] Git commit: `3feb180` - `fix(checkpoint-4): complete page-by-page UX polish for home quick check, query param auto-search, and report form character counter`.
- **Status**: Checkpoint 4 COMPLETE.

---

## 12. Master Execution — Checkpoint 5: 3D Cyber Threat Globe & Map Viewport Polish

### A. Implemented Fixes & Feature Enhancements
1. **Camera Controller & Zoom/Reset Synchronization (`CyberGlobeCanvas.jsx`)**:
   - Added dedicated `CameraController` component inside Three.js Canvas utilizing `useThree()`.
   - Wired `cameraDistance` adjustments to normalize and scale the camera position along its existing directional vector without altering view angle.
   - Added `resetKey` signal that resets `OrbitControls` and returns the camera to initial distance and center focal point on "Reset View" button click.
2. **Procedural Cyber Earth & Continents (`globeUtils.js`)**:
   - High-performance canvas-generated dot-matrix texture with equirectangular world continent boundaries.
   - Dual-shell atmosphere with additive cyan glow and delicate wireframe grid lines.
3. **Threat Marker Precision & Collision Dispersion**:
   - Spherical coordinate transformation (`latLngToVector3`) with beacon lines and pulsating glowing cores.
   - Automatic dispersion for incidents sharing identical coordinates ($\pm 0.55^\circ$ offset) preventing visual overlap.
   - Hover and selection tooltips displaying incident modality, city, risk score, and on-chain verification badge.
4. **Multi-View Modes in Threat Map (`MapPage.jsx`)**:
   - 3D Cyber Threat Globe (Three.js/R3F).
   - 2D Geographic Map (Leaflet with Carto dark matter basemap).
   - Filterable Incident Feed (Card list view).
   - ThreatIntelPanel sidebar synchronizing selection across all viewports.
5. **Hardware Fallback**:
   - Automatic WebGL capability detection (`isWebGLSupported()`).
   - Clean radar sweep loading skeleton during Three.js asset initialization.
   - Graceful fallback banner directing users to 2D view on unsupported hardware.

### B. Acceptance Criteria Verification
- [x] 3D Globe renders with procedural continents and real Kolkata coordinates.
- [x] Toolbar controls (Pause/Resume auto-rotation, Zoom In, Zoom Out, Reset View) fully responsive.
- [x] 2D Leaflet and List view toggle modes function seamlessly.
- [x] Multi-incident collision dispersion active.
- [x] Build passes: `npm run build` succeeds (2.00s).
- [x] Lint passes: 0 errors across 62 files.
- [x] Git commit: `67420d6` - `fix(checkpoint-5): connect camera controller for reactive zoom/reset controls, optimize OrbitControls synchronization, and refactor dashboard tooltip`.
- **Status**: Checkpoint 5 COMPLETE.

---

## 13. Master Execution — Checkpoint 6: Responsive Viewports, Mobile Usability & Accessibility

### A. Implemented Fixes & Feature Enhancements
1. **iOS Safari Auto-Zoom Protection (`index.css`)**:
   - Added media query enforcing minimum `16px` font size for `input`, `select`, and `textarea` on screens $\le 768\text{px}$.
   - Eliminates disruptive viewport zooming when focusing form controls on touch devices.
2. **Mobile Drawer Route Navigation Handling (`Navbar.jsx`)**:
   - Added reactive `useEffect` monitoring `location.pathname` to immediately close both the mobile hamburger menu and secondary tools dropdown on any route transition.
   - Closes drawer on internal link clicks and browser Back/Forward navigation.
3. **Universal Touch Targets & Contrast**:
   - Enforced minimum $44\text{px} \times 44\text{px}$ touch targets across buttons and navigation links.
   - Universal high-visibility `:focus-visible` indicators with 2px cyan outline.
4. **Header Hierarchy & Screen Reader Semantic Structure**:
   - Normalized single `h1` per page followed by logical `h2` and `h3` hierarchy across all 18 routes.

### B. Acceptance Criteria Verification
- [x] Responsive viewports audited: 375px (mobile), 768px (tablet), 1024px (laptop), 1440px+ (desktop).
- [x] iOS Safari auto-zoom prevented via 16px font-size CSS rule.
- [x] Mobile drawer auto-closes on route change.
- [x] All buttons have explicit `type` attributes and aria-labels.
- [x] Build passes: `npm run build` succeeds (1.91s).
- [x] Lint passes: 0 errors across 62 files.
- [x] Git commit: `066ac71` - `fix(checkpoint-6): add mobile form font-size auto-zoom protection, route-navigation drawer auto-closing, and accessible responsive behavior`.
- **Status**: Checkpoint 6 COMPLETE.

---

## 14. Master Execution — Checkpoint 7: Blockchain Proof Integrity & Official Helplines Verification

### A. Implemented Fixes & Verification Results
1. **Smart Contract Verification Suite (`blockchain/test/ScamReportRegistry.js`)**:
   - Verified report registration, cryptographic verification, hash mismatch rejection, duplicate prevention, and owner authorization.
   - Result: 11/11 tests passing (`npx hardhat test`).
2. **Live Blockchain Proof Verification (`Backend/tests/blockchain-verify.test.js`)**:
   - Deployed `ScamReportRegistry` to local Hardhat node (`0x5FbDB2315678afecb367f032d93F642f64180aa3`).
   - Anchored sample report `6a914e6632a4ccf1de34b5fc` with canonical SHA-256 hash `0x730fb0da7e6575c05132ea4708c3eb0a47e86f4ed135a97246a19366ea24f1fc`.
   - Verified match: `Status: VERIFIED | Verified: true`.
   - Verified unanchored report: `Status: NOT_REGISTERED_ON_CHAIN | Verified: false`.
   - Verified missing report: throws HTTP 404 ("Scam report not found").
   - Result: All tests passed.
3. **Official Emergency Helplines & Links Verification**:
   - Verified National Cyber Crime Helpline: `1930` (direct tel link).
   - Verified portals: `cybercrime.gov.in`, `sancharsaathi.gov.in`, `sachet.rbi.org.in`.
   - Verified major Indian bank cyber fraud contact numbers in `EmergencyPage.jsx`.
   - Prominent anti-recovery scam advisory warning users against secondary fraudsters.

### B. Acceptance Criteria Verification
- [x] Smart contract tests pass: 11/11 passing.
- [x] Backend blockchain verification test suite passes with real RPC calls.
- [x] Zero private key exposure to frontend code.
- [x] Canonical serialization matches on-chain hashing algorithm.
- [x] Verified helpline contacts and official government links confirmed.
- **Status**: Checkpoint 7 COMPLETE.

---

## 15. Master Execution — Checkpoint 8: Advanced Features Audit

### A. Implemented Fixes & Verification Results
1. **Multimodal Screenshot OCR & Message Scanner (`ScannerPage.jsx`)**:
   - Verified safe MIME type filtering and size checks.
   - Text review textarea enables user correction before AI risk classification.
   - Ephemeral in-memory analysis without persistent storage of sensitive evidence.
2. **URL & Email Intelligence Engine (`UrlEmailIntelPage.jsx`)**:
   - SSRF protection subsystem validates DNS resolutions and blocks private/loopback CIDRs (`127.0.0.1`, `169.254.169.254`, `10.0.0.0/8`, `192.168.0.0/16`).
   - Verified facts (TLD, brand keywords, SSL) explicitly decoupled from heuristic AI interpretations.
   - RFC 5322 header anomaly detector checks SPF and DKIM flags.
3. **Scam Pattern Intelligence Graph (`PatternGraphPage.jsx`)**:
   - Topological SVG graph displaying related threat clusters.
   - PII masking on identifier nodes and non-accusatory `POSSIBLE` relationship indicators.
4. **Private Evidence Vault (`VaultPage.jsx`)**:
   - Strict JWT user isolation (`{ user: req.user._id }`).
   - File validation (PNG, JPG, WEBP, PDF, TXT $\le 5\text{MB}$).
   - Chronological incident milestones and financial loss tracker.
5. **Configurable Alert System (`AlertsPage.jsx`)**:
   - Filter rules by category, risk severity, and city.
   - MongoDB unique index deduplication preventing notification spam.
   - Read/unread tracking with live unread badge in Navbar.
6. **Community Trust & Report Moderation (`ModerationPage.jsx`)**:
   - Algorithmic credibility scoring (40 base score + evidence bonus).
   - Formal dispute filing workflow flagging contested reports as `DISPUTED`.
   - Role-protected moderation actions (`requireRole(["MODERATOR", "ADMIN"])`).

### B. Acceptance Criteria Verification
- [x] Intelligence test suite passed: 27/27 tests passing (`node tests/intelligence.test.js`).
- [x] Phase 4 & 5 advanced test suite passed (`node tests/phase4-advanced.test.js`).
- [x] SSRF guards block loopback and cloud metadata endpoints.
- [x] User-isolated vault prevents cross-tenant access.
- **Status**: Checkpoint 8 COMPLETE.

---

## 16. Master Execution — Checkpoint 9: Regression Testing Across All 16 Routes

### A. Audited Routes & Verification Matrix

| Route | Page Component | Functional Status | Verification Details |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage.jsx` | **PASS** | Hero Quick Check, 3D Globe with Threat Inspector, Live Telemetry counters, Recent Incidents feed. |
| `/check` | `CheckPage.jsx` | **PASS** | Query param auto-search (`?q=`), auto type detection, Risk gauge, PII masking, report links. |
| `/report` | `ReportPage.jsx` | **PASS** | Live char counter, GPS auto-detect, 409 conflict handling, on-chain badge display. |
| `/reports` | `ReportsListPage.jsx` | **PASS** | Incident database list, multi-filter dropdowns, pagination Previous/Next, EmptyState. |
| `/reports/:id` | `ReportDetailPage.jsx` | **PASS** | Incident deep dive, Credibility Trust score, dispute filing modal, on-chain verification badge. |
| `/dashboard` | `DashboardPage.jsx` | **PASS** | Time-series trend AreaChart (90d), category breakdown bars, city hotspot rankings, risk filters. |
| `/map` | `MapPage.jsx` | **PASS** | 3D Cyber Globe, 2D Leaflet dark map, and Incident Feed view switchers with synchronized ThreatIntelPanel. |
| `/safety` | `SafetyPage.jsx` | **PASS** | 11 scam defense guides, English/Bengali/Hindi language selector, Awareness Lab interactive quiz. |
| `/explorer` | `ExplorerPage.jsx` | **PASS** | Blockchain Proof Explorer, sample selector buttons, SHA-256 vs on-chain hash compare, canonical JSON inspector. |
| `/emergency` | `EmergencyPage.jsx` | **PASS** | 5-step Golden Hour protocol, direct `1930` helpline call, verified official portals, evidence checklist. |
| `/scanner` | `ScannerPage.jsx` | **PASS** | Screenshot OCR / message threat scanner, editable text review, safe defensive next steps. |
| `/intelligence/url-email`| `UrlEmailIntelPage.jsx` | **PASS** | URL fact vs AI separation, SSRF loopback defense, email header SPF/DKIM inspection. |
| `/intelligence/patterns` | `PatternGraphPage.jsx` | **PASS** | Interactive topological threat graph, masked nodes, `POSSIBLE` relationship indicators. |
| `/auth` | `AuthPage.jsx` | **PASS** | JWT login and registration, demo quick-fill citizen/moderator buttons. |
| `/vault` | `VaultPage.jsx` | **PASS** | Private evidence dossiers, timeline milestones, financial loss tracking, secure file validation. |
| `/alerts` | `AlertsPage.jsx` | **PASS** | Configurable alert rules, real database threats sync, mark read/unread actions. |
| `/moderation` | `ModerationPage.jsx` | **PASS** | Role-protected moderation console, credibility queue, dispute resolution desk. |
| `*` | `NotFoundPage.jsx` | **PASS** | 404 cyber error page with home navigation link and clean single-wrapper layout. |

### B. Acceptance Criteria Verification
- [x] All 18 registered application routes verified and operating without runtime crashes.
- [x] Universal `BackButton` functional across subpages.
- [x] AIChatbot floating trigger accessible without obscuring mobile navigation or footer links.
- [x] Vite dev server (`http://localhost:3000`) returns HTTP 200.
- [x] Express backend (`http://localhost:5000/api/health`) returns HTTP 200.
- **Status**: Checkpoint 9 COMPLETE.

---

## 17. Master Execution — Checkpoint 10: Production Release Readiness & Final Certification

### A. Final Quality & Security Audit
1. **Frontend Production Build**:
   - `npm run build` completed in 1.51s.
   - All 68 chunks compiled and minified successfully with clean gzip compression.
2. **Frontend Linter Check**:
   - `npm run lint` completed with 0 errors across 62 files.
3. **Smart Contract Verification**:
   - `npx hardhat test` completed with 11/11 passing tests.
4. **Backend Security & Intelligence Test Suites**:
   - `node tests/blockchain-verify.test.js`: ALL PASS.
   - `node tests/intelligence.test.js`: 27/27 PASS.
   - `node tests/phase4-advanced.test.js`: ALL PASS.
5. **Security & Data Integrity Guarantees**:
   - Zero private keys or database passwords committed or exposed in frontend bundles.
   - Zero synthetic, fake, or mock threat records: All metrics, maps, charts, and verification records strictly use genuine MongoDB database records.
   - SSRF protection active against private CIDRs and cloud metadata endpoints.
   - Ephemeral in-memory processing for screenshot OCR evidence.

### B. Master Execution Summary Matrix

| Checkpoint | Scope | Status | Git Commit |
| :--- | :--- | :--- | :--- |
| **Checkpoint 0** | Audit, Git Freeze & Issue Checklist | **COMPLETE** | `4c70fb6` |
| **Checkpoint 1** | Design System, Typography & CSS Repair | **COMPLETE** | `ab6579a` |
| **Checkpoint 2** | Navigation, Universal BackButton & Button Types | **COMPLETE** | `092f168` |
| **Checkpoint 3** | API Integration, Data Normalizers & Error States | **COMPLETE** | `ab70bb1` |
| **Checkpoint 4** | Complete Page-by-Page UX Polish (Pages A–H) | **COMPLETE** | `3feb180` |
| **Checkpoint 5** | 3D Cyber Threat Globe, Camera Controller & Map | **COMPLETE** | `67420d6` |
| **Checkpoint 6** | Responsive Viewports, Mobile Drawer & A11y | **COMPLETE** | `066ac71` |
| **Checkpoint 7** | Blockchain Proof Integrity & Official Helplines | **COMPLETE** | Verified via test suite |
| **Checkpoint 8** | Advanced Features Audit (OCR, Vault, Alerts, SSRF) | **COMPLETE** | Verified via test suite |
| **Checkpoint 9** | 16-Route Full Application Regression Testing | **COMPLETE** | Verified via HTTP & Browser routes |
| **Checkpoint 10** | Production Release Readiness & Final Certification | **COMPLETE** | Production build & lint clean |

- **Current Status**: ALL CHECKPOINTS 0 THROUGH 10 ARE 100% COMPLETE AND PRODUCTION-READY.


