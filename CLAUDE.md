# Sirat (সীরাত - মারকাযুল ঈমান) Guidelines for Claude Code

## Project Overview
- Name: **Sirat**
- Organization: মারকাযুল ঈমান (Markazul Iman)
- Framework: React 19 + Vite 8 + Tailwind CSS v4
- Content: 32 Seerah dars (Word → JSON via `npm run convert`); menu: Dars, Quiz, Exam, Durood, Book. See README.md.

## Subpath Deployment Rules
- Production URL: `https://www.markazuliman.com/sirat`
- Reverse proxy destination: `https://sirat-theta.vercel.app`
- DO NOT use `sirat.markazuliman.com` (another website is running there).
- Vite `base`: `'/sirat/'`

## Image & Asset Rules (CRITICAL)
- Whenever rendering an image or referencing static assets in React/JS, ALWAYS use `getAssetUrl` from `src/utils/assetHelper`:
  ```javascript
  import { getAssetUrl } from '../utils/assetHelper';
  <img src={getAssetUrl('/logos/novel_concept_1_ayn.jpg')} />
  ```
- NEVER write `<img src="/logos/..." />` or hardcode root `/` asset paths, as it will break when running under the reverse-proxied `/sirat` subpath.

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Deploy: `npx vercel deploy --prod`

## Arabic Language Standards
- Every Arabic word/sentence must have 100% accurate Tashkeel/Harakat (no unvowelled text).
