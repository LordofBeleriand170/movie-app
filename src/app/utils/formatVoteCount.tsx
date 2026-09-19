export const formatVoteCount = (count: any) => {
  if (count < 1000) return count;
  else if (count >= 1000 && count < 1000000)
    return `${(count / 1000).toFixed(1)}K`;
  else return `${(count / 1000000).toFixed(1)}M`;
};
