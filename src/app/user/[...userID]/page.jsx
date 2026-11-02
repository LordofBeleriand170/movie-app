"use client";

import LoadingPage from "@/components/loadingComponents/LoadingPage";
import Navbar from "@/components/Navbar";
import UserPageComponent from "@/components/userPage/UserPageComponent";
import { useCollectionStore } from "@/features/collection/collectionStore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const User = () => {
  const params = useParams();
  const { loading, fetchUserCollections } = useCollectionStore();

  const email = decodeURIComponent(params?.userId[0]);

  useEffect(() => {
    const handleUserCollection = async () => {
      try {
        await fetchUserCollections(email);
      } catch (err) {
        console.log("ERR: ", err);
      }
    };

    handleUserCollection();
  }, [email]);
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
