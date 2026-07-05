# CleanAir & Clear Streets

This repository is a Vite + React frontend for a civic air-quality monitoring dashboard.

## Local development

Install dependencies and run dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Vercel deployment

When importing this repo into Vercel, use the following settings:

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave blank (Vercel will use the generated `dist` folder)

### Environment variables

Add these environment variables in the Vercel project settings (Production):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

(Values are present locally in `.env` and should **not** be committed to the public repo.)

### Notes & recommendations

- The build currently produces a large JS chunk (~700-800 KB). To reduce bundle size, consider code-splitting large routes or using dynamic imports for heavy components (e.g., `MapView`, charts, or large libraries like `leaflet` and `framer-motion`).
- Add any server-side APIs (classifying images) as serverless functions or external services — currently classification is mocked in `src/lib/analyze-image.functions.ts`.

If you want, I can create a basic Vercel configuration file, add environment variables, and trigger a redeploy for you.