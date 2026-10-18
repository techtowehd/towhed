# Tech Towhed (Static) — Deploy Guide / ডেপ্লয় গাইড

A complete static, editable portfolio website. **No build step** — plain HTML, CSS, and JavaScript only.
It works on **Netlify** and **Vercel**. All text, logo, photos, services, projects, and testimonials
are edited from the **`/admin`** visual panel (Decap CMS) or by editing the JSON files in `content/`.

> সম্পূর্ণ static website — কোনো build step লাগবে না। Netlify আর Vercel দুটোতেই চলবে।
> সব text, logo, ছবি, services, projects `/admin` প্যানেল থেকে বদলাতে পারবেন।

---

## Option 1 — Netlify Drag & Drop (সবচেয়ে সহজ, ২ মিনিট)

Fastest way to see the site live. (Note: `/admin` visual editing needs Option 2's GitHub + Identity setup — see below.)

1. `techtowhed-static.zip` extract করুন (অথবা ফোল্ডারটা যেমন আছে তেমন রাখুন)।
2. [app.netlify.com/drop](https://app.netlify.com/drop) এ যান (Netlify account লাগবে — free)।
3. **`techtowhed-static` ফোল্ডারটা** browser window-এ drag করে drop করুন।
4. Done! Netlify আপনাকে একটা live link দেবে, যেমন `https://techtowhed-static.netlify.app`।

> Contact form Netlify-তে **zero config**-এ কাজ করবে (Netlify Forms auto-detect করে)।
> Form submissions দেখতে: Netlify dashboard → আপনার site → **Forms** tab।

---

## Option 2 — Netlify via GitHub (recommended — `/admin` editing চালু করতে)

`/admin` visual editor চালাতে হলে site-টা GitHub repo-র সাথে connected থাকতে হবে।

### A. GitHub-এ push করুন
1. GitHub-এ নতুন repository বানান (যেমন `techtowhed-static`)।
2. ফোল্ডারের সব file upload/commit করুন (GitHub Desktop বা web upload — যেটা সহজ লাগে)।

### B. Netlify-তে connect করুন
1. Netlify dashboard → **Add new site → Import an existing project** → GitHub select করুন।
2. আপনার repository select করুন।
3. Build settings: **Build command খালি রাখুন**, Publish directory `.` (ডিফল্টই ঠিক থাকে — `netlify.toml` আগেই দেওয়া আছে)।
4. **Deploy site** চাপুন।

### C. `/admin` login চালু করুন (Netlify Identity + Git Gateway)
1. Netlify dashboard → আপনার site → **Site configuration → Identity** → **Enable Identity**।
2. একই পেজে নিচে **Services → Git Gateway** → **Enable Git Gateway**।
3. **Identity** tab → **Invite users** → নিজের email দিন → invitation email accept করুন, password set করুন।
4. এবার `https://আপনার-site.netlify.app/admin` খুলুন → **Login with Netlify Identity** → email/password দিন।
5. ভেতরে গিয়ে **Site Settings** (logo, text, photo, social links), **Services**, **Projects**, **Testimonials** — সব visually edit করতে পারবেন। প্রতিটা save সরাসরি GitHub repo-তে commit হবে, আর Netlify auto-redeploy করবে।

> **নতুন Project add করলে একটা extra step:** `/admin` → **Projects** → New Project বানানোর পর
> **Project List** collection-এ গিয়ে নতুন file-এর নামটা (যেমন `projects/my-work.json`) list-এ add করুন —
> নাহলে project-টা site-এ দেখাবে না।

---

## Option 3 — Vercel via GitHub

1. GitHub-এ repo push করুন (Option 2-A এর মতো)।
2. [vercel.com](https://vercel.com) → **Add New → Project** → repository import করুন।
3. Framework preset: **Other**। Build command খালি, Output directory `./` (ডিফল্ট)।
4. **Deploy** চাপুন — live link পেয়ে যাবেন।

> Contact form Vercel-এ: Netlify Forms শুধু Netlify-তেই কাজ করে। Vercel-এ form চালাতে
> `/admin` → **Site Settings** → **Form endpoint** field-এ [Formspree](https://formspree.io)
> (free) endpoint বসান — যেমন `https://formspree.io/f/xxxxxx`। তাহলে form JSON হিসেবে
> সেখানে POST হবে, আর submission email-এ পাবেন।

### Vercel-এ `/admin` visual editing (honest note / সৎ নোট)

**Netlify-এর মতো out-of-the-box কাজ করবে না**, কারণ Netlify Identity / Git Gateway
শুধু Netlify-তেই আছে। Vercel-এ GitHub login চালাতে ৫টা step:

1. `admin/config.yml` খুলে backend অংশটা বদলে দিন:
   ```yaml
   backend:
     name: github        # git-gateway থেকে github করুন
     repo: your-github-username/your-repo-name
     branch: main
   ```
2. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Homepage URL: `https://your-site.vercel.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
     (হ্যাঁ, Vercel-এও এই callback-ই ব্যবহার হয় — এটাই Decap-এর official flow।)
3. **Client ID** copy করুন + **Client secret** generate করুন।
4. [app.decapcms.org/oauth](https://app.decapcms.org/oauth)-এ গিয়ে Client ID ও Secret বসান
   (Decap-এর free OAuth bridge — server ছাড়া GitHub login-এর standard উপায়)।
5. Config change GitHub-এ push করুন → Vercel redeploy হবে → `/admin` খুলে **Login with GitHub** করুন।

> সহজ রাস্তা চাইলে: `/admin` editing-এর জন্য **Netlify (Option 2)** ব্যবহার করুন —
> ওখানে কোনো OAuth app লাগে না।

---

## Content edit করার ২টা উপায়

**উপায় ১ — `/admin` প্যানেল (সহজ):** live site-এর `/admin` থেকে logo, profile photo,
project image, সব text, services, testimonials বদলান। Save করলেই GitHub-এ commit + auto-redeploy।

**উপায় ২ — JSON file সরাসরি edit:** `content/` ফোল্ডারের file-গুলো:
- `content/settings.json` — logo, brand name, hero text, about, email, WhatsApp, social links
- `content/services.json` — services list
- `content/projects/*.json` — প্রতিটা project আলাদা file (+ `content/projects-index.json`-এ file-এর নাম list করতে হয়)
- `content/testimonials.json` — reviews

---

## File list

```
techtowhed-static/
├── index.html            # single-page site (all sections, content loaded by JS)
├── css/style.css         # dark glassmorphism design (from the full Tech Towhed site)
├── js/main.js            # fetches content/*.json, renders sections, contact form logic
├── content/
│   ├── settings.json
│   ├── services.json
│   ├── testimonials.json
│   ├── projects-index.json   # which project files show on the site
│   └── projects/             # one JSON file per project
├── admin/
│   ├── index.html        # Decap CMS (visual editor)
│   └── config.yml        # collections: settings, services, projects, project list, testimonials
├── images/
│   ├── logo.svg                # "TT" monogram (replace with your own logo)
│   └── placeholder-project.svg # sample project image
├── netlify.toml          # publish=".", no build command
└── DEPLOY-BN.md          # this guide
```

**Honest placeholders:** the 2 sample projects and 2 sample testimonials are clearly labeled
as samples — replace or delete them from `/admin`. No fake client stats, revenue numbers,
or invented reviews anywhere on the site.
