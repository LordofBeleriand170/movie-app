import React from "react";
import ImageFormat from "../ImageFormat";

const SeasonPoster = ({ season, setCurrentSeason }) => {
  const imageUrl = season.poster_path
    ? `https://image.tmdb.org/t/p/original${season.poster_path}`
    : "/no-poster.webp";

  const name = season?.name;

  return (
    <div onClick={() => setCurrentSeason(season.season_number)}>
      <ImageFormat imageUrl={imageUrl} name={name} width="w-50" />
    </div>
  );
};

export default SeasonPoster;
