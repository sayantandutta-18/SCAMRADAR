# ScamRadar — Phase 1 Implementation Context

## 1. Project Overview & Current Architecture
- **Application**: ScamRadar — Real-Time AI Scam Intelligence & Blockchain Proof Platform
- **Frontend**: React 19 (`^19.2.8`), Vite (`^8.2.2`), Tailwind CSS (`^4.3.3`), Three.js (`^0.183.2`), `@react-three/fiber` (`^9.5.0`), `@react-three/drei` (`^10.7.7`), React Router DOM (`^7.18.2`), Axios (`^1.20.0`), Leaflet (`^1.9.4`), React-Leaflet (`^5.0.0`), Recharts (`^3.10.1`), Framer Motion (`^13.1.1`), Lucide React.
- **Backend**: Express 5 REST API, MongoDB Mongoose ODM, Google Gemini 3.1 Flash Lite via `@google/genai`, Ethers.js 6.
- **Blockchain**: Hardhat, Solidity 0.8.24, OpenZeppelin contracts (`ScamReportRegistry.sol` on Polygon / EVM).

---

## 2. Checkpoints Completed (Checkpoints 0 – 4)

### Checkpoint 0 — Backup & Freeze the Working Core
- **Git Baseline**: Initialized root Git repository, committed clean baseline, tagged `v0.1.0-baseline`, and created feature branch `feature/phase1-threat-globe`.
- **Environment & Secrets Audit**: Confirmed `.env`, credentials, private keys, and AI keys are strictly excluded via root and frontend `.gitignore` rules. Added `.env.example` templates for Backend and Frontend.
- **Regression Suite Run**: Executed Hardhat smart contract test suite (11 passing tests: 3 Solidity, 8 Mocha). Tested Backend Node process loading.

### Checkpoint 1 — Frontend API Integration Audit
- **API Base URL**: Configured `VITE_API_URL` with proxy fallback to `/api` (port 5000).
- **Core Bug Fixes**:
  - Fixed `useApi` hook signature: supported both pre-bound API functions `useApi(fn)` and ad-hoc calls `execute(fn, ...args)`. Previously, calling `execute()` without arguments passed `undefined` to `apiCall`, breaking API calls across every page.
  - Fixed `axios.js` error interceptor: exposed `existingReport`, `data`, and HTTP status codes cleanly.
  - Fixed `HomePage.jsx` & `DashboardPage.jsx` response parsing: `recentReports` previously attempted to access `response.data.reports` on an array (`response.data` is an Array), which always returned `undefined` and showed empty states. Fixed to parse `Array.isArray(response.data) ? response.data : ...`.
  - Fixed `ScamChecker.jsx`: search response `{ data: [reports] }` was not recognized as an array. Fixed response parsing.
  - Fixed `ReportForm.jsx`: response was wrapping the report inside `response.data.report` instead of `response.data`. Fixed `aiExplanation` naming (previously checked nonexistent `aiAnalysis`).
  - Fixed 409 Conflict handling for duplicate reports: properly extracts `existingReport` and displays existing report preview and link.

### Checkpoint 2 — UI/UX Polish & Responsive Foundation
- **Navbar**: Redesigned cybersecurity dark theme with cyan/teal neon accents, glowing shield brand badge, animated 3D badge for Threat Map, and accessible mobile drawer with keyboard navigation.
- **Layout & Spacing**: Decoupled `Layout.jsx` from forcing fixed constrained padding around all routes, allowing full-width map canvases and proper responsive margins for standard pages.
- **Privacy & PII Protection**: Created `maskIdentifier` helper in `formatters.js` to mask phone numbers, email addresses, and UPI IDs in public views. Added user-controlled reveal/mask toggle on `ReportCard`, `RiskResult`, `ThreatIntelPanel`, and `ReportDetailPage`.
- **Ethical Threat Language**: Updated labels to neutral, objective security language: "reported as suspicious", "risk indicators detected", and "AI heuristic analysis" instead of definitive judicial accusations.
- **Report Cards & Skeletons**: Enhanced `ReportCard` with active status indicators, on-chain proof badges, and clean `Link` navigation (replaced full-page `<a>` reloads).

### Checkpoint 3 — 3D Frontend Base
- **Dependencies Installed**: `three`, `@react-three/fiber`, `@react-three/drei`.
- **Cyber Globe Base Component** (`CyberThreatGlobe.jsx` & `CyberGlobeCanvas.jsx`):
  - Built dark cybersecurity globe with deep space navy sphere, cyan/teal wireframe latitude/longitude rings, and subtle additive atmosphere glow.
  - OrbitControls with restrained pan/zoom/rotation bounds (`minDistance={3.2}`, `maxDistance={7.5}`).
  - Accessible controls toolbar: Pause/Resume rotation, Zoom In, Zoom Out, and Reset Camera.
  - Device Pixel Ratio capped at `[1, 1.5]` for smooth mobile performance.
  - Automatic `prefers-reduced-motion` detection: disables auto-rotation when user prefers reduced motion.
  - WebGL capability detection with clean 2D fallback when unsupported.
  - Code-split into its own dynamic chunk via `lazy()` with sleek Cyber Radar loading skeleton (`GlobeLoadingSkeleton`).

### Checkpoint 4 — Real Data on the 3D Globe
- **Real Map Endpoint**: Integrated `GET /api/reports/map`.
- **Coordinate Validation**: Validates `latitude` and `longitude` numeric ranges (-90 to +90, -180 to +180). Excludes records with missing coordinates without inventing fake data.
- **Mathematical Conversion**: Standard spherical coordinates conversion $(lat, lng) \to (x, y, z)$ on radius $R$.
- **Risk Indicator Markers**:
  - Color-coded pins: High Risk (`#ef4444`), Medium Risk (`#f59e0b`), Low Risk (`#10b981`), Cyan (`#06b6d4`).
  - Subtle quadratic bezier arcs between correlated threat nodes.
  - Interactive click and hover detection with floating HUD label.
- **Threat Intelligence Center (`/map`)**:
  - View switcher: `3D Cyber Globe`, `2D Leaflet Map`, and `Incident Feed`.
  - Live side panel (`ThreatIntelPanel`): displays active threat vector details when a marker is clicked, or aggregate node metrics and incident list when idle.
  - Search and filter bar: filter by risk severity, scam type, or city.
- **Hero Preview**: Integrated compact 3D globe preview on `HomePage` hero section with direct deep-link to full Threat Map.

---

## 3. Files Modified & Created

### Created Files
- `Frontend/src/components/globe/CyberGlobeCanvas.jsx`: Three.js R3F canvas, spherical math, markers, and arcs.
- `Frontend/src/components/globe/CyberThreatGlobe.jsx`: Lazy-loaded wrapper with WebGL detection and radar skeleton.
- `Frontend/src/components/globe/ThreatIntelPanel.jsx`: Live telemetry side panel and selected threat dossier.
- `Frontend/src/utils/globeUtils.js`: 3D Cartesian spherical coordinate conversion and risk color mapper.
- `.gitignore`: Root Git ignore protecting credentials, build artifacts, and node_modules.
- `Backend/.env.example`: Backend environment variable template.
- `Frontend/.env.example`: Frontend environment variable template.

### Modified Files
- `Frontend/package.json` & `Frontend/package-lock.json`: Added `three`, `@react-three/fiber`, `@react-three/drei`.
- `Frontend/src/api/axios.js`: Attached response data and enhanced error normalization.
- `Frontend/src/hooks/useApi.js`: Supported pre-bound and ad-hoc API functions, resilient error normalization.
- `Frontend/src/utils/formatters.js`: Added `maskIdentifier` utility for privacy and neutral formatting.
- `Frontend/src/components/layout/Layout.jsx`: Fixed page container layout constraints.
- `Frontend/src/components/layout/Navbar.jsx`: Cyber UI refresh, 3D badge, mobile responsive drawer.
- `Frontend/src/components/reports/ReportCard.jsx`: Added privacy mask toggle, `Link` routing, on-chain badge.
- `Frontend/src/components/reports/ReportForm.jsx`: Clean payload formatting, duplicate 409 handling, GPS auto-detect.
- `Frontend/src/components/scam-checker/ScamChecker.jsx`: Fixed API search array parsing and loading/error states.
- `Frontend/src/components/scam-checker/RiskResult.jsx`: Mask toggle, aiExplanation fallback, Link navigation, uncertainty note.
- `Frontend/src/pages/HomePage.jsx`: Upgraded hero with 3D Cyber Threat Globe preview and real statistics feed.
- `Frontend/src/pages/MapPage.jsx`: Rebuilt as Threat Intelligence Center with 3D Globe, 2D Leaflet, and ThreatIntelPanel.
- `Frontend/src/pages/DashboardPage.jsx`: Fixed recent reports parsing, robust charts, and responsive telemetry cards.
- `Frontend/src/pages/ReportDetailPage.jsx`: Fixed broken Tailwind dynamic classes, added reveal toggle and lifecycle audit.
- `Frontend/src/pages/ReportsListPage.jsx`: Clean layout, memoized filters, pagination controls.
- `Frontend/src/pages/CheckPage.jsx`: Clean container layout, guidance notes.
- `Frontend/src/pages/ReportPage.jsx`: Removed redundant nested card border, polished submission instructions.
- `Frontend/src/pages/SafetyPage.jsx`: Modern cyber cards, emergency helpline (1930) quick dial.

---

## 4. Tests Performed & Verification

| Test | Target | Result | Evidence |
| :--- | :--- | :--- | :--- |
| **Smart Contract Tests** | `blockchain/test` | **PASS (11/11 passing)** | 3 Solidity tests + 8 Mocha tests in `ScamReportRegistry.js` |
| **Backend App Initialization** | `Backend/src/app.js` | **PASS** | Successfully loaded without missing dependencies |
| **Backend Health Check** | `GET /api/health` | **PASS** | `{"success": true, "message": "ScamRadar API is running"}` |
| **Statistics Endpoint** | `GET /api/reports/stats` | **PASS** | Returns real MongoDB aggregate stats |
| **Map Coordinates Endpoint** | `GET /api/reports/map` | **PASS** | Returns real validated coordinates (`22.5726, 88.3639`) |
| **Reports List Endpoint** | `GET /api/reports` | **PASS** | Returns real reports array and pagination metadata |
| **Report Search Endpoint** | `GET /api/reports/search` | **PASS** | Returns verified search results for query identifier |
| **Duplicate 409 Prevention** | `POST /api/reports` | **PASS** | HTTP 409 Conflict returned with existing report payload |
| **AI Chat Assistant** | `POST /api/chat` | **PASS** | Gemini 3.1 Flash Lite returns cybersecurity advice |
| **Frontend Production Build** | `npm run build` | **PASS** | Vite built clean production bundle in 2.7s |
| **Frontend Linter Check** | `npm run lint` | **PASS** | 0 errors across 45 files |

---

## 5. Environment Variables & Setup

### Backend (`Backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://... (or mongodb://127.0.0.1:27017/scamradar)
GEMINI_API_KEY=your_gemini_api_key
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_CONTRACT_ADDRESS=0x...
BLOCKCHAIN_PRIVATE_KEY=0x...
```

### Frontend (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 6. Known Considerations
- If connecting to remote MongoDB Atlas from new IP addresses, ensure the IP is added to the MongoDB Atlas Network Access whitelist. Local MongoDB instance (`127.0.0.1:27017`) is also supported.
- Hardhat local node can be spun up via `npx hardhat node` in `blockchain/` if local on-chain registration is required during offline development.

---

## 7. Exact Next Checkpoint
**Checkpoint 5 — Public Blockchain Proof Explorer**
- Dedicated blockchain verification UI/API to verify any report ID against on-chain smart contract data.
- Fetch report data and on-chain record (`getReport(reportId)`).
- Recreate exact canonical JSON payload used during registration:
  `{ reportId, identifier, identifierType, message, scamType, riskScore, riskLevel, createdAt }`
- Hash using SHA-256 (`0x` + hex) and compare calculated hash with on-chain hash.
- Display verified/mismatch/unregistered states distinctly without misleading claims.
