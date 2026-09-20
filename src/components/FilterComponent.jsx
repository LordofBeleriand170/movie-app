"use client";

import { useMovieStore } from "@/features/movie/movieStore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const FilterComponent = ({
  category,
  setCategory,
  setPage,
  mediaType,
  setMediaType,
  categories,
  setCategories,
  setTrendingResult,
  year,
  setYear,
  decade,
  setDecade,
  rating,
  isUser,
}) => {
  const getCategory = useMovieStore((state) => state.getCategory);
  const router = useRouter();
  const params = useParams();

  // Reset pagination and results when filters change
  const resetFeed = () => {
    setPage(1);
    setTrendingResult(null);
  };

  useEffect(() => {
    if (params?.type === "movies") {
      setMediaType("movie");
    } else if (params?.type === "tvshows") {
      setMediaType("tv");
    }

    const handleCategories = async () => {
      try {
        const response = await getCategory(mediaType);
        setCategories(response.genres);
      } catch (err) {
        console.error(err);
      }
    };
    handleCategories();
  }, [params?.type, mediaType, getCategory, setCategories, setMediaType]);

  const decades = Array.from({ length: 15 }, (_, i) => `${2020 - i * 10}s`);
  const startYear = decade ? parseInt(decade, 10) : null;
  const yearsOfDecade = Array.from({ length: 10 }, (_, i) =>
    startYear ? startYear + i : null,
  ).filter(Boolean);

  useEffect(() => {
    const url = `${isUser ? `/user/${params?.type}/${params?.userId}` : `/media/${params?.type}`}/popular${
      year ? `/year/${year}` : decade ? `/decade/${decade}` : ""
    }${category ? `/category/${category}` : ""}${
      rating === "highest"
        ? `/by/rating`
        : rating === "lowest"
          ? `/by/rating-lowest`
          : ""
    }`;

    router.push(url);
  }, [decade, category, year, rating, params?.type, router]);

  const selectStyles =
    "px-3 py-2 text-sm text-neutral-200 bg-neutral-900/90 border border-white/10 rounded-lg hover:border-white/30 focus:border-red-500/50 focus:outline-none transition w-full cursor-pointer";

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-neutral-950/60 backdrop-blur-md border border-white/10 rounded-xl">
        {/* DECADE */}
        <select
          value={decade || "decade"}
          className={selectStyles}
          onChange={(e) => {
            resetFeed();
            const val = e.target.value;
            setDecade(val === "decade" ? null : val);
            setYear(null);
          }}
        >
          <option value="decade">Decade</option>
          {decades.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* YEAR (conditional on decade) */}
        <select
          disabled={!decade}
          value={year || "year"}
          onChange={(e) => {
            resetFeed();
            setYear(e.target.value === "year" ? null : Number(e.target.value));
          }}
          className={`${selectStyles} ${!decade ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <option value="year">Year</option>
          {yearsOfDecade.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* CATEGORY */}
        <select
          value={category || "category"}
          className={selectStyles}
          onChange={(e) => {
            resetFeed();
            setCategory(e.target.value === "category" ? null : e.target.value);
          }}
        >
          <option value="category">Category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.name.toLowerCase()}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* COUNTRY */}
        <select className={selectStyles} defaultValue="country">
          <option value="country">Country</option>
        </select>
      </div>
    </div>
  );
};

export default FilterComponent;
