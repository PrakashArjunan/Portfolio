# PA Portfolio

A responsive, dependency-free single-page portfolio built for GitHub Pages. It balances strategic design storytelling with contributions and career details grounded in the supplied 2026 resume.

## Customize

Edit `index.html` to update project contributions, career details, and contact links. Visual styles live in `styles.css`; interactions live in `script.js`.

The selected-work diagrams are illustrative, not product screenshots. GenUI is presented as a product for scaling products with Generative UI. Other summaries distinguish concept exploration from research and design contributions; they do not claim unverified shipping status or outcome metrics. Add approved product artifacts and verified results when available.

The page pairs AI work (Generative UI and Copilot) with discovery and research work (Windows Spotlight, Trivia, and Bing Travel). Design leadership is framed as collaboration and influence, not an assertion of people-management responsibility. Earlier career details are available in a native, keyboard-accessible disclosure.

The resume download uses `Prakash Arjunan Resume 2026.docx` in the site root. Include this file when deploying, or update both download links if replacing it with a public PDF. Review the resume's contact details before publishing the document.

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
