"use client";

import Navbar from "@/components/Navbar";
import { useMovieStore } from "@/features/movie/movieStore";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchPageComponent from "@/components/SearchPageComponent";

const SearchResults = () => {
  const params = useParams();
  const name = decodeURIComponent(params.name);

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { search, total_pages } = useMovieStore();

  const loadMoreRef = useRef(null);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];

      if (target.isIntersecting && !loading && page < total_pages) {
        setPage((prev) => prev + 1);
      }
    },
    [loading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    const current = loadMoreRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleObserver]);

  // Reset when query changes
  useEffect(() => {
    setSearchResult([]);
    setPage(1);
  }, [name]);

  // Fetch search results
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        setLoading(true);

        const response = await search(name ?? "", page);

        if (response.length === 0) {
          setLoading(false);
        } else {
          setSearchResult((prev) => {
            const safePrev = page === 1 ? [] : prev || [];
            const safeData = Array.isArray(response) ? response : [];

            const existing = new Set(
              safePrev.map((item) => `${item.id}-${item.media_type}`),
            );

            const filtered = safeData.filter(
              (item) => !existing.has(`${item.id}-${item.media_type}`),
            );

            return [...safePrev, ...filtered];
          });
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (name) fetchSearch();
  }, [name, page, search]);

  useEffect(() => {
    console.log(total_pages);
  }, [total_pages]);

  return (
    <>
      <Navbar />

      <SearchPageComponent
        query={name}
        loading={loading}
        searchResult={searchResult}
      />

      {/* Infinite scroll trigger */}
      <div
        ref={loadMoreRef}
        className="h-20 bg-black flex items-center justify-center"
      >
        {loading && page < total_pages && (
          <span className="text-gray-400">Loading more...</span>
        )}
      </div>
    </>
  );
};

export default SearchResults;
