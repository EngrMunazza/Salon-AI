# Salon Frontend (React + TypeScript, Vite)

Plain React + TypeScript site (no Next.js) for the salon, built to sit in
front of the `Salon-chatbot` FastAPI backend (`app/api.py` → `POST /chat`,
`DELETE /chat`). Routing is client-side via `react-router-dom`.

## What's here

- **Home, Services, Hours & Location** pages (`src/pages/`) — content comes
  from `src/data/salonInfo.ts` and `src/data/services.ts`, which mirror the
  backend's `app/data/salon_info.json` and `services.json`. Keep these two
  in sync until the backend exposes `GET` endpoints for them (see "Next
  steps" below).
- **Floating chat widget** (`src/components/ChatWidget.tsx`) — calls the
  real backend at `VITE_API_URL`, keeps a session id + message history in
  `localStorage`, and has a "Reset" button that calls `DELETE /chat`.
- **WhatsApp links** — `wa.me` deep links in the nav, footer, and hours page.

## Design

Blush/espresso/rose/gold palette, `Fraunces` (display, loaded via Google
Fonts `<link>` in `index.html`) + `DM Sans` (body), and a repeating "vanity
mirror" arch motif (`src/components/ArchFrame.tsx`) as the one signature
visual element, tying the hero, service cards, and chat header together.

## Run it

```bash
npm install
cp .env.local.example .env.local   # then set VITE_API_URL
npm run dev
```

Point `VITE_API_URL` at wherever `main.py` (uvicorn) is running, e.g.
`http://localhost:8000`. Make sure the backend's CORS config (`main.py`)
allows your frontend's origin — it's currently wide open
(`allow_origins=["*"]`), fine for local dev, should be locked down to your
real domain before going live.

## Build for production

```bash
npm run build   # outputs static files to dist/
npm run preview # preview the production build locally
```

`dist/` is a plain static site — deployable to any static host (Netlify,
Vercel static, GitHub Pages, S3, or served directly by FastAPI/nginx).

## Next steps on the backend to fully match this frontend

1. `GET /services` and `GET /salon-info` — so pricing/hours live in one
   place instead of being duplicated in `src/data/*.ts`.
2. A booking endpoint — right now "booking" is just "chat with the assistant
   or message WhatsApp"; there's no `POST /bookings` yet, so there's no
   booking form on this site. Once that exists I can add a real booking flow.
3. Lock down CORS `allow_origins` to your actual frontend domain(s).
