// utils/formatTicker.ts
export function formatTicker(ticker: string): string {
    // Replace dots with hyphens or remove them based on the service's requirements
    return ticker.replace('.', '-');
  }
  