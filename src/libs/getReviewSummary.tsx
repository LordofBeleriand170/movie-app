// libs/getReviewSummary.ts
export const getReviewSummary = (comments: any[]) => {
  if (!comments || comments.length === 0) {
    return { positive: 0, mixed: 0, negative: 0, topKeywords: [] };
  }

  const stats = {
    positive: comments.filter((c) => c.rating >= 4).length,
    mixed: comments.filter((c) => c.rating === 3).length,
    negative: comments.filter((c) => c.rating <= 2).length,
    topKeywords: [] as string[],
  };

  // Simple keyword detection
  const themes = [
    "acting",
    "masterpiece",
    "slow",
    "pacing",
    "cinematography",
    "classic",
  ];
  stats.topKeywords = themes.filter((word) =>
    comments.some((c) => c.text?.toLowerCase().includes(word)),
  );

  return stats;
};
