"use client";

import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContentStore } from "@/features/content/contentStore";
import SearchPageComponent from "@/components/search/SearchPageComponent";

const SearchResults = () => {
  const params = useParams();
  const name = params?.name ? decodeURIComponent(params.name) : "";

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { search, total_pages } = useContentStore();

  const loadMoreRef = useRef(null);

  const stateRef = useRef({ loading, page, total_pages });
  useEffect(() => {
    stateRef.current = { loading, page, total_pages };
  }, [loading, page, total_pages]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    const {
      loading: isCurrentLoading,
      page: currentPage,
      total_pages: maxPages,
    } = stateRef.current;

    if (target.isIntersecting && !isCurrentLoading && currentPage < maxPages) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const current = loadMoreRef.current;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleObserver]);

  useEffect(() => {
    setSearchResult([]);
    setPage(1);
  }, [name]);

  useEffect(() => {
    if (!name) return;

    let isMounted = true;

    const fetchSearch = async () => {
      try {
        setLoading(true);

        const response = await search(name, page);

        if (!isMounted) return;

        const safeData = Array.isArray(response) ? response : [];

        if (safeData.length === 0) {
          setLoading(false);
          return;
        }

        setSearchResult((prev) => {
          const safePrev = page === 1 ? [] : prev || [];

          const existing = new Set(
            safePrev.map((item) => `${item.id}-${item.media_type}`),
          );

          const filtered = safeData.filter(
            (item) => !existing.has(`${item.id}-${item.media_type}`),
          );

          return [...safePrev, ...filtered];
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();

    return () => {
      isMounted = false;
    };
  }, [name, page]);

  return (
    <>
      <Navbar />

      <SearchPageComponent
        query={name}
        loading={loading && page === 1}
        searchResult={searchResult}
      />

      <div
        ref={loadMoreRef}
        className="h-20 bg-black flex items-center justify-center"
      >
        {loading && <span className="text-gray-400">Loading more...</span>}
      </div>
    </>
  );
};

export default SearchResults;
