# PA Portfolio

A responsive, dependency-free single-page portfolio built for GitHub Pages.

## Customize

Edit `index.html` to replace the placeholder project descriptions, email address, and social links. Visual styles live in `styles.css`; interactions live in `script.js`.

## Preview locally

Open `index.html` directly in a browser, or run a static server:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy

1. Create a GitHub repository and push this folder to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The included workflow deploys the site on every push to `main`.
