# Joulia Restaurant — logo

The mark is a serif **J** with an ember nestled in its bowl: the letter is the
restaurant, the flame is the kitchen it's cooked in.

## Files

| File | Use |
|---|---|
| `logo-mark.svg` | Mark on light backgrounds |
| `logo-mark-reversed.svg` | Mark on the char background (`#17150F`) |
| `logo-horizontal.svg` | Full lockup, light backgrounds |
| `logo-horizontal-reversed.svg` | Full lockup, dark backgrounds |
| `logo-badge-char.svg` | App icon / avatar, char background |
| `logo-badge-ember.svg` | App icon / avatar, ember background |
| `favicon.svg`, `logo-32/180/192/512.png` | Browser and device icons |

In the app itself, use the React component instead of an `<img>` so the J picks
up the surrounding text colour:

```jsx
import JouliaMark from './component/Logo/Logo';

<JouliaMark size={30} />
```

## Colours

- Char `#17150F` — the letterform on light backgrounds
- Ember `#D6371F` — always the flame, never the letterform
- White `#FFFFFF` — the letterform on char or ember

On an ember background the flame flips to char so it stays visible.

## Rules

- Keep clear space of at least the width of the J's stem on all four sides.
- Minimum size is 18px for the mark, 120px wide for the horizontal lockup.
- Don't recolour the flame to anything but ember or char, don't add effects,
  and don't set the wordmark in a face other than Fraunces.

## Note on the wordmark

The two lockup SVGs set "Joulia Restaurant" as live `<text>` in Fraunces, pulled
from Google Fonts by an `@import` inside the file. That keeps them editable, but
it means the type falls back to Georgia anywhere the font can't load (some print
workflows, offline email clients). For print or handoff to a third party,
convert the text to outlines first.
