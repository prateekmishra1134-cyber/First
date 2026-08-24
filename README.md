# Darling Romantic Prank Website

A polished, mobile-first static romantic/prank microsite made specifically for **Sandali Khare (Darling)** by **Prateek**. It uses only HTML, CSS, and vanilla JavaScript, with no backend, database, login, paid APIs, API keys, or paid assets.

## Files

- `index.html` — website markup and stage container
- `style.css` — responsive styling, animations, glassmorphism, and CSS penguin
- `script.js` — stage navigation, prank button movement, penguin reactions, and particles
- `README.md` — setup and publishing instructions

## Run locally

1. Download or clone this project.
2. Open the project folder.
3. Double-click `index.html`, or right-click it and choose your browser.

That is all. Because it is a static website, it also works from a simple local file path.

## Create a GitHub repository

1. Go to [GitHub](https://github.com/) and sign in.
2. Click **New repository**.
3. Choose a repository name, for example `darling-website`.
4. Keep it public if you want to use free GitHub Pages easily.
5. Click **Create repository**.

## Upload the files

### Option A: Upload in the browser

1. Open your new repository on GitHub.
2. Click **Add file** → **Upload files**.
3. Upload these files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
4. Click **Commit changes**.

### Option B: Upload with Git

```bash
git init
git add index.html style.css script.js README.md
git commit -m "Add Darling romantic prank website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

## Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings**.
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose the `main` branch and `/root` folder.
6. Click **Save**.

## Get the public URL

After GitHub Pages finishes deploying, GitHub will show a public link on the Pages settings screen. It usually looks like:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

Open that link on a phone for the intended mobile-first experience.

## Hosting note

This project requires no paid hosting and no backend server. GitHub Pages can host it for free, and the site can also be shared by sending the four files directly.
