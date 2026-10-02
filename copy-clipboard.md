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

## "How ordering works" section (removed 2026-10-01)

Was `<section class="seed-section" id="how">`:

> **How ordering works**
> No carts, no checkout maze — just you, me, and the flowers. Here's the whole thing:
> 1. **Pick your seeds** — Browse the collection above and choose the varieties your garden is dreaming of.
> 2. **DM me on X** — Send a message to @igotglitteronme with the varieties you want. I reply personally — usually fast!
> 3. **Pay your way** — I'll send you my payment link in the DM — Cash App, Venmo, Zelle, X or PayPal, whichever you like.
> 4. **Seeds ship to you** — Your pretty packets go in the mail, and before you know it you'll have blooms of your very own.
> [Start your order — DM me →] (button linking https://x.com/igotglitteronme)
