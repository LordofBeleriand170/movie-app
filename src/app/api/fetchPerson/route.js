import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { id } = body;
  const url = `https://api.themoviedb.org/3/person/${id}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };
  const person = await fetch(url, options).then((res) => res.json());

  const personMoviesURL = `https://api.themoviedb.org/3/person/${person.id}/combined_credits`;
  let personMovies = await fetch(personMoviesURL, options).then((res) =>
    res.json(),
  );

  const voteWorth = (vote) => {
    if (vote < 7) {
      return vote / 2;
    } else if (vote < 7.6 && vote >= 7) {
      return vote;
    } else if (vote < 8 && vote >= 7.6) {
      return vote * 2;
    } else if (vote >= 8) {
      return vote * 7;
    }
  };

  let personContent = [];

  if (person.known_for_department === "Acting") {
    personMovies = personMovies.cast.filter((content) => {
      return content?.department === undefined;
    });
  } else {
    personMovies = personMovies.crew.filter((content) => {
      return content?.department === "Directing";
    });
  }

  personContent.push(...personMovies);

  personContent = personContent.map((item) => ({
    ...item,
    weight: voteWorth(item.vote_average) * item.vote_count,
  }));

  personContent.sort((a, b) => b.weight - a.weight);

  const response = {
    person: person,
    personContent: personContent,
  };

  return NextResponse.json(response);
}
