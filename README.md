# AURA — Bollywood × Global. One perfect mix.

**Discover the mashups you didn't know you needed.**

A dedicated discovery platform centered around **Bollywood, Hindi, English, and crossover mashups** (*Husn × Let Her Go*, *Chaleya × Until I Found You*, *Heeriye × Perfect*, *Sajni × I Like Me Better*, *O Maahi × Someone You Loved*, *Aankh Marey × Shape of You*).

🌐 **Live Vercel Production App**: [https://spotify-who.vercel.app](https://spotify-who.vercel.app)  
📦 **GitHub Repository**: [https://github.com/MJforti/aura-music-player](https://github.com/MJforti/aura-music-player)

---

## 🌟 Core Product Features

- **Primary Unit = MASHUP**: Platform centered around authentic Bollywood × English, Hindi × English, Punjabi × English, and Desi crossover mashups.
- **Ambient Video Background Streaming**: Integrates `desktop_format.mp4` and `mobile_format.mp4` video backdrops into the Hero Featured Mashup (*Husn × Let Her Go*) and full-screen Liquid Glass Mix Player.
- **5 Core Views**:
  - `Discover`: Hero Featured Mashup with ambient video backdrop + horizontal category carousels.
  - `Mashups`: Browse 12 Mashup Categories with source track tags (*Song A × Song B*) and 1-tap play.
  - `Mixes`: Continuous mashup sessions (`BOLLYWOOD × ENGLISH 1h 12m`, `TRENDING MASHUPS 58m`, `DESI PARTY 1h 05m`, `MIDNIGHT MIX 48m`).
  - `Search`: Combination search support (`Arijit + The Weeknd`, `Anuv + Passenger`, `Bollywood + English`).
  - `Me`: Personal Mix Builder ("My Night Drive"), Liked Mashups, Saved Mixes, and History.
- **Mashup Source Breakdown (`MashupDetailModal`)**: Displays exact source tracks used (*Husn by Anuv Jain × Let Her Go by Passenger*), Creator/DJ info, and `Listen on source ↗` external link.
- **Continuous Auto-Advance**: Automatically progresses to the next mashup in the active mix or playlist when a track segment finishes.

---

## 🛠️ Local Development & Build

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```
