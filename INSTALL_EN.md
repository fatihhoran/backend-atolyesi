# Backend Atölyesi — independent installation

This is a self-contained Turkish/English static PWA. No ChatGPT/OpenAI account or AI subscription is required. The LLM lab is a local educational simulation.

1. Create a public GitHub repository called **backend-atolyesi**.
2. Extract this ZIP. Upload the CONTENTS of the backend-atolyesi folder into the repository root, including index.html, sw.js, manifest.json, .nojekyll and all asset folders. Commit the files; uploading the ZIP alone does not deploy the app.
3. Open Settings → Pages → Source: **Deploy from a branch**. Select **main** and **/(root)**, then Save.
4. Wait for deployment and copy the actual **Visit site** address from GitHub Pages. A project address normally looks like `https://USERNAME.github.io/backend-atolyesi/`; this is a pattern, not an already deployed URL. Append `?lang=en` to share the English view.

A custom domain is optional and is configured in Settings → Pages → Custom domain and with your DNS provider. Domain registration is not included.

## Add to a phone

Android: open the published HTTPS link in Chrome → ⋮ → Install app / Add to Home screen. iPhone: open it in Safari → Share → Add to Home Screen → Add. Open links outside LinkedIn's embedded browser when installing. Wait for the offline package to show **Ready**. The initial download needs internet; external links always need internet. This is a PWA, not an APK or App Store package.

## Move your progress

Export a backup from Settings on the old address, then import it on the new address. Storage belongs to a browser/origin and does not move automatically. Do not publish personal backups to GitHub. Changing language on the same address preserves your learning records.

## Product and attribution

The public product name is Backend Atölyesi. An independent address does not contain the ChatGPT domain. The editable frontend uses HTML/CSS/JavaScript and PWA features; the SQL lab uses SQLite/WebAssembly. C#, ASP.NET Core and EF Core are curriculum subjects; the downloadable Task API is a separate .NET sample. Keep MIT license notices beside the upstream files.

Official publishing guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
