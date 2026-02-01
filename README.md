# ONDYS.DEV Portfolio

A bilingual (Czech/English) personal portfolio website built with Astro and Tailwind CSS.

## 🚀 Features

- **Bilingual**: Full Czech and English support with language switcher
- **Fast**: Static site generation, minimal JavaScript
- **Accessible**: WCAG compliant, respects `prefers-reduced-motion`
- **Modern Design**: Glass morphism, animated blobs, smooth transitions
- **Content Collections**: Easy-to-edit project content in Markdown
- **SEO Ready**: Meta tags, Open Graph, sitemap, robots.txt

## 📦 Tech Stack

- **Framework**: [Astro](https://astro.build/) v4
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3
- **Content**: Astro Content Collections
- **Deployment**: Cloudflare Pages

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:4321`

## 📁 Project Structure

```
├── public/
│   ├── projects/          # Project screenshots
│   ├── favicon.svg
│   ├── og.png             # Open Graph image (replace with 1200x630)
│   └── robots.txt
├── src/
│   ├── components/        # Astro components
│   ├── config/
│   │   └── donate.ts      # Donation links configuration
│   ├── content/
│   │   ├── config.ts      # Content collection schema
│   │   └── projects/      # Project markdown files (cs/en)
│   ├── i18n/
│   │   ├── translations.ts # All UI translations
│   │   └── utils.ts
│   ├── layouts/
│   ├── pages/
│   │   ├── cs/            # Czech pages
│   │   ├── en/            # English pages
│   │   └── index.astro    # Redirect to language
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## ✏️ Adding/Editing Content

### Projects

Add new projects by creating Markdown files in `src/content/projects/`:

1. Create `src/content/projects/cs/my-project.md` (Czech)
2. Create `src/content/projects/en/my-project.md` (English)

Use the same `slug` in both files. See existing projects for the frontmatter schema.

### Translations

Edit `src/i18n/translations.ts` for UI text changes.

### Donate Links

Edit `src/config/donate.ts` to add your payment links:

```typescript
export const donateLinks = {
  buyMeACoffee: {
    url: 'https://buymeacoffee.com/yourname',
    enabled: true,
  },
  // ...
};
```

## 🌐 Deployment to Cloudflare Pages

### Option 1: Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create new project → Connect to Git
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18` (or higher)
5. Deploy

### Option 2: Direct Upload

1. Build locally: `npm run build`
2. Go to Cloudflare Pages → Create project → Direct Upload
3. Upload the `dist` folder

### Custom Domain

1. In Cloudflare Pages, go to your project → Custom domains
2. Add your domain (e.g., `ondys.dev`)
3. Update DNS records as instructed

### Environment Variables (if needed)

Set in Cloudflare Pages dashboard under Settings → Environment variables.

## 🔧 Configuration

### Site URL

Update `site` in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

### OG Image

Replace `public/og.png` with a 1200x630px image for social sharing.

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/cs` | Czech homepage |
| `/en` | English homepage |
| `/cs/projects` | Czech projects list |
| `/en/projects` | English projects list |
| `/cs/projects/[slug]` | Czech project detail |
| `/en/projects/[slug]` | English project detail |
| `/cs/support` | Czech donate page |
| `/en/support` | English donate page |
| `/cs/privacy` | Czech privacy policy |
| `/en/privacy` | English privacy policy |

## 🎨 Customization

### Colors

Edit `tailwind.config.mjs` to change the color palette:

```javascript
colors: {
  brand: {
    // Your brand colors
  },
  surface: {
    // Background/surface colors
  }
}
```

### Fonts

The site uses:
- **Inter** - Body text
- **Space Grotesk** - Headings

Change in `src/styles/global.css` Google Fonts import and `tailwind.config.mjs`.

## 📄 License

MIT License - feel free to use this template for your own portfolio.

---

Built with ❤️ by ONDYS.DEV
