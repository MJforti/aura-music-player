# AURA — Premium Minimalist Liquid Glass Music Player

A Progressive Web App (PWA) inspired by Apple's Liquid Glass design language. AURA offers a fast, uncluttered music player with a glass-based UI, persistent mini-player, dynamic artwork-derived backdrop lighting, synchronized karaoke lyrics, and a pluggable music provider engine.

🌐 **Live Vercel App**: [https://spotify-who.vercel.app](https://spotify-who.vercel.app)  
📦 **GitHub Repository**: [https://github.com/MJforti/aura-music-player](https://github.com/MJforti/aura-music-player)

---

## ✨ Features

- **Apple Liquid Glass Aesthetic**: Translucent glass surfaces (`backdrop-filter: blur()`), frosted glass borders, glowing highlights, and Apple system font hierarchy (`SF Pro Display`, `Geist Sans`, `Inter`).
- **Dynamic Artwork Backdrop**: Dynamic background color extraction and blur derived from active track artwork.
- **Persistent Playback Engine**: Web MediaSession API integration (lockscreen controls), HTML5 audio streaming, queue management, volume scrubber, shuffle, and repeat modes.
- **Persistent Mini-Player**: Floating bar above bottom navigation, expandable into full-screen **Now Playing** sheet with spring animations.
- **Live Online & Offline Streaming**: Integrated `HybridMusicProvider` fetching 1,000,000+ live streamable songs from Audius Open Network + curated offline tracks.
- **Spotify Web API Architecture**: Pluggable `SpotifyMusicProvider` ready for Spotify OAuth credentials.
- **Library & Search**: Custom playlist manager (Create, Rename, Delete, Add/Remove tracks), Liked Songs manager, listening history, search with genre bento cards.
- **Installable PWA**: Manifest and Service Worker support.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 (Liquid Glass utilities)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Audio Engine**: HTML5 Audio + Web MediaSession API

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```
