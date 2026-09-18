# 30-Day Sexual Health Coach — V1

A premium, mobile-first, local-first sexual wellbeing and lifestyle coaching web app for adults.

## What is included

- 30-day progressive training program
- Dashboard with day, completion, streak and check-in metrics
- Workout, nutrition, sleep and stress coaching
- Private sexual-wellbeing check-ins
- Supplement education with conservative safety language
- Progress charts and strength notes
- Rule-based local "Ask Coach" for V1
- On-device `localStorage` persistence
- JSON export/import
- Clear-data control
- Privacy & medical-safety pages
- GitHub Pages deployment workflow
- No paid services required for the basic V1
- No API key in the frontend

## Run locally

No build step is required.

### Option A — Python

From this folder:

```bash
python -m http.server 8080
```

Then open:

http://localhost:8080

### Option B — VS Code

Install the "Live Server" extension and open `index.html` with Live Server.

Opening `index.html` directly also works in most browsers, but a local HTTP server is recommended.

## GitHub Pages

1. Create a new GitHub repository, for example `30-day-sexual-coach`.
2. Upload the contents of this folder to the repository root.
3. Commit and push to the default branch.
4. The included `.github/workflows/deploy.yml` deploys the static site to GitHub Pages.
5. In GitHub, open **Settings → Pages** and confirm the source is **GitHub Actions** if GitHub asks.
6. Wait for the Actions workflow to finish.
7. Open the Pages URL shown by GitHub.

If the repository is public, the static site can be hosted at no cost under GitHub Pages.

## AI Coach — safe V2 connection

V1 intentionally uses a local rule-based coach. Do **not** put an OpenAI or other provider secret in `app.js`.

For V2, add a server-side endpoint such as:

`POST /api/coach`

The browser should send only the minimum information required for the user's request. The server stores the provider secret in an environment variable (for example `OPENAI_API_KEY`) and calls the model provider from the server. The server returns the generated response to the browser.

A suitable production architecture is:

Browser → `/api/coach` → server/edge function → AI provider

The browser must never contain the secret key.

## Privacy

V1 stores app data in the browser's `localStorage`. Clearing browser/site storage can remove it. Use Export data for a backup.

No private sexual-health data is intentionally transmitted by this static V1.

## Medical safety

This is general wellness education, not diagnosis or treatment. Persistent or sudden sexual-function changes, genital pain, blood in urine/semen, significant hormonal symptoms, medication-related sexual side effects, or other concerning symptoms should be evaluated by an appropriate healthcare professional.

## Project structure

```text
30-day-sexual-coach/
├── index.html
├── styles.css
├── app.js
├── README.md
├── .gitignore
└── .github/
    └── workflows/
        └── deploy.yml
```

## V2 ideas

- Secure server-side AI coach
- Optional authentication and encrypted cloud sync
- PWA/offline install support
- More granular workout progression
- Exercise video library
- Better trend charts and date filtering
- Nutrition preference/portion engine
- Clinician-reviewed educational content
- Accessibility audit and localization
- Optional anonymous analytics with explicit consent
