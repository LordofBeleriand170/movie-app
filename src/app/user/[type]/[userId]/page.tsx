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
import LeftFilter from "@/components/LeftFilter";

interface TypePageProps {
  option: string | undefined;
}

export interface Categories {
  id: any;
  name: string;
}

const UserWatchedPage: React.FC<TypePageProps> = ({ option }) => {
  const params = useParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [sortDate, setSortDate] = useState<string | null>(null);
  const [titleSort, setTitleSort] = useState<string | null>(null);
  const [trendingLoading, setTrendingLoading] = useState<boolean | null>(true);
  const [trendingResult, setTrendingResult] = useState<MovieState[] | null>(
    null,
  );
  const [runtime, setRuntime] = useState<[number, number]>([0, 360]);

  const [categories, setCategories] = useState<Categories[] | null>([]);
  const [trendings, setTrendings] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState("movie");
  const [year, setYear] = useState<number | null>(null);
  const [decade, setDecade] = useState<string | null>(null);
  const [countries, setCountries] = useState<any | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [errorComponent, setErrorComponent] = useState<boolean>(false);

  useEffect(() => {
    let indexDecade = params?.params?.indexOf("decade");
    if (indexDecade >= 0) {
      setDecade(params?.params?.[indexDecade + 1]);
    }
    let indexCategory = params?.params?.indexOf("category");
    if (indexCategory >= 0) {
      setCategory(params?.params?.[indexCategory + 1]);
    }
    let indexYear = params?.params?.indexOf("year");
    if (indexYear >= 0) {
      setYear(parseInt(params?.params?.[indexYear + 1]));
    }
    if (indexDecade < 0 && indexYear >= 0) {
      let currentYear = params?.params?.[indexYear + 1];
      let decade =
        currentYear
          ?.toString()
          .substring(0, currentYear?.toString()?.length - 1) + `0s`;
      setDecade(decade);
    }
    let indexRating = params?.params?.indexOf("by");
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
    return <ErrorPage />;
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
            titleSort={titleSort}
            sortDate={sortDate}
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

export default UserWatchedPage;
