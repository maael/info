# ℹ️ Info - https://info.mael.tech

## Features

- Display Spotify information
  - Album art, artist, track name, paused, progress bar
- Filtered list of available cocktails
  - Limited by in stock ingredients
  - Easy to follow instructions
- Guestbook
  - Draw via mouse/touch
  - Saved to AWS S3, so publically shareable
- Train departures list from nearby station to common destinations
  - Includes number of stops, realtime departure time, journey length
  - From [Realtime Trains API](https://api.rtt.io/)
- Shows if friends are playing interested games on Steam
  - Currently only Deep Rock Galactic
- Setup as a PWA
  - Allows fullscreen and adding to homescreen
  - When combined with app to keep screen on, creates a "home terminal" suitable for parties

## Data

- [Drinks](./data/drinks.md)
- [Ingredients Stock](./data/stock.md)

## Dev

```sh
git clone git@github.com:maael/info.git
cd info
yarn
npx vercel link
npx vercel env pull
yarn dev
```

Hosted on [Vercel](https://vercel.com).

### Gotchas

- Due to the target device for usage, can't use modern css such as `gap` and `aspect-ratio`.

## Todo

- Highlight cancelled/delayed trains better
- ~Link to current Spotify playlist if any via QR code~
  - ~Goal is to allow people to easily add songs to playlists~
- ~Allow pausing Spotify directly if installed as a PWA~
- Party game helper
  - Generate interesting questions etc
- ~Shuffle drinks to get a random drink suggestion from list~
- ~Shuffle ingredients to generate a completely random drink~
