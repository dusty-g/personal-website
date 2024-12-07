// components/EloRating.ts
export interface StockElo {
    ticker: string;
    rating: number;
  }
  
  const K_FACTOR = 32;
  
  export function calculateElo(winnerRating: number, loserRating: number): { winnerNew: number; loserNew: number } {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const expectedLoser = 1 - expectedWinner;
  
    const winnerNew = winnerRating + K_FACTOR * (1 - expectedWinner);
    const loserNew = loserRating + K_FACTOR * (0 - expectedLoser);
  
    return {
      winnerNew,
      loserNew
    };
  }
  