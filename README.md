# ZIP Diff Checker

A professional, open-source web app to visually compare the contents of two ZIP files. Built with Next.js, React, and Tailwind CSS. No database or file storage—everything is processed in-memory for privacy and speed.

## Features

- 🗂️ Drag & drop upload for two ZIP files
- 📂 Visual file tree comparison (added, removed, modified)
- 📝 GitHub-style inline text diffs for changed files
- 🟢🟡🔴 Summary bar for added/removed/modified files
- ⚡ All processing in-memory (no uploads stored)
- 🌗 Light/Dark mode toggle
- 💅 Clean, minimal, GitHub-inspired UI (Tailwind CSS)
- 🚀 Ready to deploy on Vercel

## Getting Started (Local Development)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/zip-diff-checker.git
   cd zip-diff-checker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repo.
3. Click "Deploy". No extra config needed.

## Project Structure

- `src/app` — Next.js app directory (pages, API routes)
- `src/components` — Reusable React components
- `src/services` — ZIP extraction and diff logic
- `src/styles` — Custom styles (if needed)

## License

MIT License. See [LICENSE](./LICENSE).

---

> Built with ❤️ using Next.js, React, and Tailwind CSS.
