export const toWinrate = (wins: number, losses: number): string =>
  !wins && !losses ? "0" : ((wins / (wins + losses)) * 100).toFixed(0);

const Ranks: { [key: number]: string } = {
  0: "E",
  1: "D",
  2: "C",
  3: "B",
  4: "A",
};

const Leagues: {
  [key: number]: { Name: string; rank: typeof Ranks | null };
} = {
  0: {Name: "Bronze", rank: Ranks},
  1: {Name: "Silver", rank: Ranks},
  2: {Name: "Gold", rank: Ranks},
  3: {Name: "Diamond", rank: Ranks},
  4: {Name: "Masters", rank: null},
};

export const toRank = (league: number, rank: number) => {
  const currentLeague = Leagues[league];
  if (currentLeague) {
    return `${currentLeague.Name} ${currentLeague.rank?.[rank] ?? rank}`;
  }
  return "";
};
