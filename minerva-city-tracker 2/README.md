# Minerva City Rotation Tracker 🌍

A static web app for Minerva University students to track city rotations, plan goals, log experiences, and manage deadlines — no backend required.

---

## Features

- **Map View** — Browse all 6 city rotations with highlights, key deadlines, resources & student tips
- **My Planner** — Write goals, log experiences, and record reflections for each city (saved in your browser)
- **Deadlines** — View system deadlines + add your own personal reminders with urgency indicators

---

## How to Deploy on GitHub Pages (Step-by-Step)

### Step 1 — Create a GitHub account
If you don't have one, go to [github.com](https://github.com) and sign up for free.

### Step 2 — Create a new repository
1. Click the **+** button in the top-right corner → **New repository**
2. Name it: `minerva-city-tracker` (or anything you like)
3. Set it to **Public**
4. ✅ Check **"Add a README file"**
5. Click **Create repository**

### Step 3 — Upload the files
1. In your new repo, click **Add file → Upload files**
2. Drag and drop the entire folder contents:
   ```
   index.html
   css/
     style.css
   js/
     data.js
     app.js
   README.md
   ```
3. Scroll down, write a commit message like `Initial upload`, click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. In the left sidebar, click **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: **main**, folder: **/ (root)**
5. Click **Save**

### Step 5 — Visit your live site
After ~60 seconds, GitHub will show you a URL like:
```
https://YOUR-USERNAME.github.io/minerva-city-tracker/
```
That's your live site! Share it with anyone — no login needed.

---

## File Structure

```
minerva-city-tracker/
├── index.html       ← Main HTML shell
├── css/
│   └── style.css    ← All styling (Minerva brand colours)
├── js/
│   ├── data.js      ← City data, dates, deadlines
│   └── app.js       ← All interactivity
└── README.md        ← This file
```

---

## Customising the Data

Open `js/data.js` to edit:
- City names, dates, semesters
- Highlights and student tips
- Pre-loaded deadlines
- Resource links (replace `"#"` with real URLs)

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript — zero dependencies, zero build step
- Google Fonts (DM Serif Display, DM Sans, DM Mono)
- LocalStorage for planner & deadline persistence
