"use client";

import React from "react";
import { Cast, Crew } from "./InfoComponent";
import Link from "next/link";
import Image from "next/image";

const CastComponent = ({ cast, crew }) => {
  return (
    <main className="flex justify-between gap-5 px-30 py-4">
      <div>
        <h2>Cast</h2>
        {cast && (
          <div className="flex flex-col gap-5">
            {cast.map((person, index) => (
              <Link
                href={`/person/${person?.id}-${person.name?.toLowerCase().replace(" ", "-")}`}
                className="flex gap-5"
                key={index}
              >
                <Image
                  src={
                    !person.profile_path?.includes("jpg") ||
                    (person.profile_path?.includes("null") &&
                      person.gender == 2)
                      ? "/male-not-found.jpg"
                      : !person.profile_path?.includes("jpg") ||
                          (person.profile_path?.includes("null") &&
                            person.gender == 1)
                        ? "/female-not-found.jpg"
                        : `https://image.tmdb.org/t/p/w342/${person.profile_path}`
                  }
                  alt="profile picture"
                  width={160}
                  height={200}
                  className="rounded"
                />
                <span>{person.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2>Crew</h2>
        {crew && (
          <div className="flex flex-col gap-5">
            {crew.map((person, index) => (
              <Link
                href={`/person/${person?.id}-${person.name?.toLowerCase().replace(" ", "-")}`}
                key={index}
                className="flex gap-5"
              >
                <Image
                  src={
                    !person.profile_path?.includes("jpg") ||
                    (person.profile_path?.includes("null") &&
                      person.gender == 2)
                      ? "/male-not-found.jpg"
                      : !person.profile_path?.includes("jpg") ||
                          (person.profile_path?.includes("null") &&
                            person.gender == 1)
                        ? "/female-not-found.jpg"
                        : `https://image.tmdb.org/t/p/w342/${person.profile_path}`
                  }
                  alt="profile picture"
                  width={160}
                  height={200}
                  className="rounded"
                />
                <span>{person.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CastComponent;
