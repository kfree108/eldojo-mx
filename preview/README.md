# El Dojo — redesign preview

Draft redesign of eldojo.mx built to the new layout direction. **Not published.**
The live site (`../index.html`, `../styles.css`, `../script.js`) is untouched.

Preview locally at `http://localhost:4195/preview/`.

## Photos

Every image is a real El Dojo photo already on the site — no AI/stock imagery:

| Slot | File |
| --- | --- |
| Hero | `assets/dojo-group-hero.webp` |
| "Encuentra tu clase" band | `assets/dojo-interior-tatami.webp` |
| "Más que un dojo, una familia" | `assets/dojo-exterior-night.webp` |
| Contact band | `assets/dojo-group-hero.webp` (tighter crop) |
| 5 teacher portraits | `assets/{gabriel,tal,ken,arturo,felix}-*.webp/jpg` |

The four discipline cards (Jiu Jitsu / Judo / Aikido / Lucha) have **no photo** —
we have no real class-action shots. They use a colour-block + kanji plate instead.
If real photos of each discipline turn up, drop them into `.art-plate` and the card
layout takes them as-is.

## Before publishing — checklist

1. Move the three files up a level (`preview/index.html` → `index.html`, etc.).
2. Change every `../assets/` reference back to `assets/` in `index.html` and `styles.css`.
3. Re-add the GA4 snippet from the current live `index.html` `<head>`
   (deliberately left out so the local preview does not pollute the real property).
4. Change `<meta name="robots" content="noindex, nofollow">` back to
   `content="index, follow, max-image-preview:large"`.
5. Check the sub-pages (`/brazilian-jiu-jitsu/`, `/entrena-de-visita/`, `/guias/*`) —
   they still use the old stylesheet and will look like the previous design.

## What carried over from the live site

- Full ES/EN toggle (new copy added to both dictionaries in `script.js`)
- Schema.org `SportsActivityLocation` block, OG/Twitter tags
- Real class schedule, prices, teachers, WhatsApp CTA + floating button
- "Conocer arte" modal with the long-form discipline write-ups

## What is new

- Bold condensed display type (Oswald), navy / rust / teal on warm paper
- Art-deco geometric bands and diamond rules
- "Encuentra tu clase" — tapping Niños / Jóvenes / Adultos highlights that group's
  classes in the weekly schedule below
- Schedule redrawn as a compact colour-coded grid on navy
- Pricing as three colour cards + "Becas disponibles" banner
