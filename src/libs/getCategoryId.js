const getCategoryId = async (mediaType, input) => {
  try {
    const url = `https://api.themoviedb.org/3/genre/${mediaType === "movie" ? "movie" : "tv"}/list?language=en`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    };
    const categories = await fetch(url, options).then((res) => res.json());

    const response = categories?.genres?.find((category) => {
      return category.name === input;
    });
    return response?.id;
  } catch (err) {
    console.error("Error:", err);
  }
};

export default getCategoryId;
