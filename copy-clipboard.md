# Copy clipboard

Snippets removed from the site, saved here in case we want to put them back.

## Hero paragraph (removed 2026-10-01)

Was inside `.seed-hero__copy` on the hero:

> Garden-girl approved varieties, chosen for beauty and charm — packed with love in California and shipped straight to your garden.

To restore: add back inside `<section class="seed-hero">`, after the `<h1>`:

```html
<div class="seed-hero__copy">
  <p>Garden-girl approved varieties, chosen for beauty and charm — packed with love in California and shipped straight to your garden.</p>
</div>
```

(The `.seed-hero__copy` styles are still in `flower-seed-store.css`.)
