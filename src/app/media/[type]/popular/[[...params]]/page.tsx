"use client";

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingPage from "@/app/LoadingPage";
import PaginatedItems from "@/components/PaginatedItems";
import FilterComponent from "@/components/FilterComponent";
import { MovieState } from "@/features/movie/movieStore";
import ErrorPage from "@/libs/ErrorPage";

interface PopularContentPageProps {
  option: string | undefined;
}

export interface Categories {
  id: string;
  name: string;
}

const PopularContentPage: React.FC<PopularContentPageProps> = ({ option }) => {
  const params = useParams();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [trendingLoading, setTrendingLoading] = useState<boolean | null>(true);
  const [trendingResult, setTrendingResult] = useState<MovieState[] | null>(
    null,
  );

  const [categories, setCategories] = useState<Categories[] | null>([]);
  const [trendings, setTrendings] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState("movie");
  const [year, setYear] = useState<number | null>(null);
  const [decade, setDecade] = useState<string | null>(null);
  const [countries, setCountries] = useState<[] | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [errorComponent, setErrorComponent] = useState<boolean>(false);

  useEffect(() => {
    const indexDecade = params?.params?.indexOf("decade") ?? -1;
    if (indexDecade >= 0) {
      setDecade(params?.params?.[indexDecade + 1] ?? null);
    }
    const indexCategory = params?.params?.indexOf("category") ?? -1;
    if (indexCategory >= 0) {
      setCategory(params?.params?.[indexCategory + 1] ?? null);
    }
    const indexYear = params?.params?.indexOf("year") ?? -1;
    const rawYear = params?.params?.[indexYear + 1];
    const parsedYear = rawYear ? parseInt(rawYear, 10) : NaN;
    if (indexYear >= 0) {
      setYear(isNaN(parsedYear) ? null : parsedYear);
    }
    if (indexDecade < 0 && indexYear >= 0) {
      const currentYear = params?.params?.[indexYear + 1];
      const decade =
        currentYear
          ?.toString()
          .substring(0, currentYear?.toString()?.length - 1) + `0s`;
      setDecade(decade);
    }
    const indexRating = params?.params?.indexOf("by") ?? -1;
    if (indexRating >= 0) {
      console.log();
      if (params?.params?.[indexRating + 1] === "rating") {
        setRating("highest");
      } else {
        setRating("lowest");
      }
    }
    setMediaType(params?.type === "movies" ? "movie" : "tv");
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  if (loading || status === "loading") return <LoadingPage />;

  if (errorComponent) {
    return <ErrorPage error={{ message: "Error occured" }} />;
  }

  let isUser = true;

  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full gap-10 pt-5 px-8 bg-black">
        <div className="flex flex-col gap-5 m-auto w-[90%]">
          <FilterComponent
            category={category}
            setCategory={setCategory}
            setTrendingResult={setTrendingResult}
            setTrendingLoading={setTrendingLoading}
            option={option}
            page={page}
            setPage={setPage}
            mediaType={mediaType}
            setMediaType={setMediaType}
            categories={categories}
            setCategories={setCategories}
            setTrendings={setTrendings}
            year={year}
            setYear={setYear}
            decade={decade}
            setDecade={setDecade}
            countries={countries}
            setCountries={setCountries}
            rating={rating}
            setRating={setRating}
            isUser={isUser}
          />
          <PaginatedItems
            category={category}
            trendingLoading={trendingLoading}
            setTrendingLoading={setTrendingLoading}
            trendingResult={trendingResult}
            setTrendingResult={setTrendingResult}
            option={option}
            page={page}
            setPage={setPage}
            mediaType={mediaType}
            categories={categories}
            trendings={trendings}
            year={year}
            decade={decade}
            rating={rating}
            setErrorComponent={setErrorComponent}
          />
        </div>
      </main>
    </>
  );
};

export default PopularContentPage;
