"use client";

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/app/LoadingPage";
import PaginatedItems from "@/components/PaginatedItems";
import FilterComponent from "@/components/FilterComponent";
import ErrorPage from "@/libs/ErrorPage";
import { useAuthStore } from "@/features/auth/authStore";

const TypePage = ({ option }) => {
  const params = useParams();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingResult, setTrendingResult] = useState(null);
  const user = useAuthStore((state) => state.user);

  const [categories, setCategories] = useState([]);
  const [trendings, setTrendings] = useState(false);

  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState("movie");
  const [year, setYear] = useState(null);
  const [decade, setDecade] = useState(null);
  const [countries, setCountries] = useState(null);
  const [rating, setRating] = useState(null);
  const [errorComponent, setErrorComponent] = useState(false);

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

  if ((loading || status === "loading") && user) return <LoadingPage />;

  if (errorComponent) {
    return <ErrorPage />;
  }

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

export default TypePage;
