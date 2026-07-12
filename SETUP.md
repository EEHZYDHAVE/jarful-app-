# Getting Jarful onto GitHub

You'll end up with two repos: one public (just the app, safe to be public since it's only code) and one private (your actual financial data). Here's the full walkthrough.

## Part 1: Host the app itself (public repo)

1. Go to github.com and click **New repository**.
2. Name it something like `jarful-app`. Leave it **Public** (GitHub Pages on a free account requires a public repo, but this repo will only ever contain the app's code, never your data).
3. Click **Create repository**.
4. On the new repo's page, click **Add file > Upload files**, then upload **all five files** from this download together: `index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`, and `icon-512.png`. Uploading them all at once, in the same step, matters, they all need to land at the root of the repo, not in a subfolder.
5. Commit the upload (the default commit message is fine).
6. Go to **Settings > Pages** (left sidebar).
7. Under "Build and deployment", set **Source** to "Deploy from a branch", **Branch** to `main` and folder to `/ (root)`. Click **Save**.
8. Wait a minute or two, then refresh that Pages settings page. It'll show you a live URL, something like `https://yourusername.github.io/jarful-app/`. That's your app, live, on any device.

With these extra files in place, opening that URL on a phone (or in Chrome on desktop) should now offer to install the app properly, with its own icon, instead of just being a bookmark.

## Part 2: Store your data safely (private repo)

1. Back on github.com, click **New repository** again.
2. Name it something like `jarful-data`. This time, set it to **Private**.
3. Click **Create repository**. You don't need to upload anything here, the app will create the data file itself the first time you push.

## Part 3: Create a token so the app can talk to your private repo

1. Go to **Settings** (your account, top-right profile picture) **> Developer settings > Personal access tokens > Fine-grained tokens**.
2. Click **Generate new token**.
3. Give it a name like "Jarful sync".
4. Set an expiration (90 days is a reasonable default; you can always generate a new one later).
5. Under **Repository access**, choose **Only select repositories**, then select `jarful-data` (the private one, not the app repo).
6. Under **Permissions > Repository permissions**, find **Contents** and set it to **Read and write**.
7. Click **Generate token**, then copy it immediately. GitHub only shows it once.

## Part 4: Connect the app

1. Open your app (the GitHub Pages URL from Part 1) on this device.
2. Go to **Manage > GitHub Sync**.
3. Fill in:
   - **GitHub username**: your GitHub username
   - **Private data repo name**: `jarful-data` (or whatever you named it)
   - **File path in repo**: leave as `jarful-data.json`, or pick your own name
   - **Personal access token**: paste the token from Part 3
4. Click **Push to GitHub**. This uploads what's currently on this device.
5. On another device, open the same Pages URL, fill in the same Sync fields (same username, repo, path, and a token with access to that repo), then click **Pull from GitHub** to bring that data down.

## Notes on how this works

- Sync is manual, not automatic. Push when you want to save your latest changes up, Pull when you want to bring another device's changes down. There's no real-time syncing or conflict merging, whichever side you push last wins.
- Your token lives only in this browser's local storage, on this device. It is never included in the data file that gets pushed.
- Since this app runs entirely in your browser with no server of its own, this level of security is appropriate for personal use, but it isn't bank-grade. Anyone who got hold of your token could read or overwrite that one private repo (nothing else). Treat it like a password: don't share it, and regenerate it if you ever suspect it leaked.
- If you ever want to stop syncing, just clear the four Sync fields, your data stays right where it is, both on GitHub and on this device.
