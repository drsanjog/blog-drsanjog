# blog.drsanjog.com

Medical content blog for Dr. Sanjog Sharma — Plastic & Reconstructive Surgeon, Aesthetica Veda Clinic, Bengaluru.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and MDX. Deploys to Railway via Nixpacks.

---

## How to add a new post

1. Create a new file in `content/posts/` with a keyword-based slug as the filename:

   ```
   content/posts/your-slug-here.mdx
   ```

2. Add the required frontmatter at the top of the file:

   ```yaml
   ---
   title: "Your Post Title"
   description: "One or two sentence summary used in meta tags and cards."
   date: "2026-07-01"
   targetKeyword: "primary seo keyword for this post"
   author: "Dr. Sanjog Sharma"
   tags: ["tag1", "tag2"]
   faqs:
     - question: "A common patient question?"
       answer: "A factual, concise answer."
   ---
   ```

   - `faqs` is optional. If present, a FAQPage JSON-LD block and an accordion section are rendered automatically.
   - `tags` drives the related-posts algorithm — use consistent values across posts.
   - `date` must be in `YYYY-MM-DD` format.

3. Write the post body in standard Markdown/MDX below the frontmatter.

4. `git add content/posts/your-slug-here.mdx && git push` — Railway auto-deploys on push.

**Compliance checklist before publishing:**
- [ ] No patient testimonials or reviews
- [ ] No before/after patient imagery
- [ ] No superlative claims ("best", "No. 1", "leading")
- [ ] No guaranteed-outcome language
- [ ] Content is factual and educational
- [ ] Medical disclaimer is rendered automatically — no action needed

---

## Local development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Railway

### First deploy

1. Push this repository to GitHub.
2. Log in to [railway.app](https://railway.app) and create a new project → **Deploy from GitHub repo** → select this repo.
3. Railway detects Next.js automatically via Nixpacks — no Dockerfile needed.
4. Set the environment variable `NODE_ENV=production` in the Railway service settings (usually set automatically).
5. Railway will build and deploy. Note the `.railway.app` URL it gives you.

### Connect blog.drsanjog.com

After the first successful Railway deploy:

1. In the Railway dashboard → your service → **Settings** → **Networking** → **Custom Domain** → add `blog.drsanjog.com`.
2. Railway shows you a CNAME target (e.g., `xyz.proxy.rlwy.net`).
3. In GoDaddy DNS for `drsanjog.com`:
   - Add a **CNAME** record:
     - **Name:** `blog`
     - **Value:** the Railway CNAME target
     - **TTL:** 600 (or default)
4. Wait for DNS propagation (minutes to a few hours). Railway handles TLS automatically.

---

## Architecture notes

| Concern | Implementation |
|---|---|
| Content | MDX files in `content/posts/` — filename = URL slug |
| Rendering | `next-mdx-remote/rsc` (React Server Components) |
| Styling | Tailwind CSS + `@tailwindcss/typography` for prose |
| SEO | `generateMetadata` per page, `MedicalWebPage` + `Physician` JSON-LD |
| FAQ schema | `FAQPage` JSON-LD generated when `faqs[]` present in frontmatter |
| OG images | Dynamic per post via `next/og` (`app/blog/[slug]/opengraph-image.tsx`) |
| Sitemap | `app/sitemap.ts` — auto-includes all posts |
| robots.txt | `app/robots.ts` — allows all crawlers including GPTBot, ClaudeBot, PerplexityBot, Google-Extended |
| llms.txt | `GET /llms.txt` — plain-text index for AI crawlers |
| Deployment | Railway + Nixpacks, `output: 'standalone'` in `next.config.mjs` |
