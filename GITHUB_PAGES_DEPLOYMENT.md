# Deploying the ESB DO Scorecard to GitHub Pages

This guide walks you through publishing the dashboard for free on GitHub Pages in under 10 minutes.

---

## Prerequisites

- A free GitHub account at [github.com](https://github.com)
- Git installed on your computer (or use GitHub Desktop)

---

## Step 1 — Download the Project

Download the project as a ZIP file from the Manus interface (Code panel → Download all files).

Unzip it to a folder on your computer, for example: `esb-do-dashboard/`

---

## Step 2 — Create a New GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Set the repository name to: `esb-do-dashboard`
3. Set visibility to **Public** (required for free GitHub Pages)
4. Do **not** initialise with a README
5. Click **Create repository**

---

## Step 3 — Push the Code to GitHub

Open a terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: ESB PR6 DO Scorecard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/esb-do-dashboard.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 4 — Configure GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow file (`.github/workflows/deploy.yml`) is already included in the project

---

## Step 5 — Trigger the First Deployment

The deployment runs automatically on every push to `main`. To trigger it manually:

1. Go to **Actions** tab in your repository
2. Click **Deploy to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

---

## Step 6 — Access Your Dashboard

After the workflow completes (usually 2–3 minutes), your dashboard will be live at:

```
https://YOUR_USERNAME.github.io/esb-do-dashboard/
```

---

## Updating the Data

All 37 Delivery Obligations and 27 Performance Indicators are stored in:

```
client/src/data/doData.ts
```

To update the dashboard:
1. Edit the data in `doData.ts`
2. Commit and push to `main`
3. GitHub Actions automatically rebuilds and redeploys

---

## Important Note on Base Path

If your GitHub Pages URL uses a subdirectory (e.g., `username.github.io/esb-do-dashboard/`), you need to set the `base` in `vite.config.ts`:

```ts
export default defineConfig({
  base: "/esb-do-dashboard/",
  // ... rest of config
});
```

This is already configured in the project. If you rename the repository, update this value to match.
