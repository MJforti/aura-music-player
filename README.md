# AURA MIX — Discover what's hot. Hear it mixed.

A mobile-first music discovery application centered around continuously generated short-form music mixes and mashups based on the latest trending songs.

🌐 **Live Vercel Production App**: [https://spotify-who.vercel.app](https://spotify-who.vercel.app)  
📦 **GitHub Repository**: [https://github.com/MJforti/aura-music-player](https://github.com/MJforti/aura-music-player)

---

## 🔥 Product Features & Architecture

- **Primary Unit = MIX**: Replaced traditional song-centric playback with short-form continuous **Mixes** (`🔥 Global Heat`, `🇮🇳 India Heat`, `📱 Viral Right Now`, `🆕 New & Hot`, `💃 Party`, `🌙 Midnight`, `❤️ Love`, `🎤 Hip-Hop`, `🎸 Indie`).
- **Continuous Mix Progression**: `MixPlaybackContext` automatically advances to the next track segment in the active mix when a preview finishes, creating a seamless listening session.
- **Discover Screen**: Hero Card for **🔥 GLOBAL HEAT** (25 tracks, ~4:38 duration, primary "PLAY MIX" CTA) with live timestamps ("Updated 4 min ago").
- **1-Tap Mixes Catalog**: Explore all 10 mix categories with 1-tap instant streaming.
- **Clip Search & My Mix**: Search any song/artist, play discovery clips, and tap `+ Add to Mix` to construct custom personal mixes.
- **Immersive Mix Player**: Full-screen Apple Liquid Glass modal showing current track, mix progress (`0:43 / 4:38`), and **Up Next** snippet preview.
- **Persistent Mini-Player**: Floating bar above bottom dock displaying active Mix title, track, progress, and play/pause controls.
- **Installable PWA**: Service Worker shell caching and Web Manifest.

---

## 🛠️ Local Development & Deployment

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```
