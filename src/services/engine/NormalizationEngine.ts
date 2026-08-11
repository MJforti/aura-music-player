/**
 * NormalizationEngine
 * Normalizes track titles, artist names, album titles, and string tokens
 * for accurate multi-source matching and deduplication.
 */
export class NormalizationEngine {
  public normalizeTitle(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/\(official\s+video\)/gi, '')
      .replace(/\(official\s+audio\)/gi, '')
      .replace(/\(lyric\s+video\)/gi, '')
      .replace(/\(single\)/gi, '')
      .replace(/\(remastered\)/gi, '')
      .replace(/\s+-\s+single/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  public normalizeArtistName(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/vevo/gi, '')
      .replace(/official/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  public generateMatchingKey(title: string, artistName: string): string {
    const normTitle = this.normalizeTitle(title);
    const normArtist = this.normalizeArtistName(artistName);
    return `${normArtist}_${normTitle}`;
  }
}

export const normalizationEngine = new NormalizationEngine();
