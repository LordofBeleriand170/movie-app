"use client";

import LoadingPage from "@/app/LoadingPage";
import Navbar from "@/components/Navbar";
import UserPageComponent from "@/components/UserPageComponent";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const User = () => {
  const pathname = useParams();

  const { loading } = useCollectionStore();

  const fetchUserCollections = useCollectionStore(
    (state) => state.fetchUserCollections,
  );

  useEffect(() => {
    const handleUserFetch = async () => {
      try {
        const userIdParam = pathname?.userId;
        const rawEmail = Array.isArray(userIdParam)
          ? userIdParam[0]
          : userIdParam;

        if (!rawEmail) return;

        const email = decodeURIComponent(rawEmail);

        await fetchUserCollections(email);
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };
    handleUserFetch();
  }, [pathname]);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Navbar />
          <UserPageComponent />
        </>
      )}
    </>
  );
};

export default User;
