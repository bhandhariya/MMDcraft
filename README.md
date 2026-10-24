# MMD Craft

Futuristic catalog for MMD Craft. Static React site for GitHub Pages. Products, categories, materials, and page copy live in JSON. Orders open WhatsApp. There is no cart, login, or payment.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Add a product

1. Put the photo in `public/images/`. Example: `public/images/new-piece.jpg`.
2. Copy a block in `public/data/products.json` and edit it.

```json
{
  "id": "new-piece",
  "name": "New piece",
  "category": "key-holders",
  "materials": ["sublimation", "mdf"],
  "defaultThickness": 6,
  "widthMm": 300,
  "heightMm": 300,
  "hooks": 5,
  "price": 899,
  "salePrice": 749,
  "onSale": false,
  "status": "available",
  "badge": "",
  "preview": true,
  "images": ["images/new-piece.jpg"],
  "summary": "One line about the piece.",
  "specs": ["5 metal hooks", "Suggested size 300 × 300 mm"]
}
```

- `category` must match an id in `public/data/categories.json`. Add a new category there if you need one.
- `materials` use `mdf`, `acrylic`, or `sublimation`. Thickness choices for each material are in `public/data/specs.json`.
- `onSale: true` lists the piece under Sale On. `status: "working"` lists it under Working On.
- `price` and `salePrice` are rupees. Leave them `null` to show “Ask for the rate”.
- Set `preview` to `false` if a piece should not get the 3D sheet.

Refresh the dev server after a JSON edit. For GitHub Pages, run `npm run build` again.

Original photos are still in `assets/images/`. The site serves the copies in `public/images/`.

## WhatsApp number

In `public/data/site.json`, set `whatsapp` to your number. A 10-digit mobile number is fine. You can also store it with the `91` country code. The same file holds hours, city, email, and the hero and about copy.

Until that number is set, order buttons copy the message so you can paste it.

## GitHub Pages

`vite.config.js` uses `base: './'`, so the built site works as a project page or a user page.

Push to `main` or `master`. In the repo, open Settings → Pages → Build and deployment → GitHub Actions. The workflow in `.github/workflows/pages.yml` publishes the `dist` folder.

You can also upload the contents of `dist` yourself.
