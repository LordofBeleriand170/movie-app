"use client";

import LoadingPage from "@/components/loadingComponents/LoadingPage";
import Navbar from "@/components/Navbar";
import PersonComponent from "@/components/PersonComponent";
import { usePersonStore } from "@/features/person/personStore";
import ErrorPage from "@/libs/ErrorPage";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Person = () => {
  const { slug } = useParams();
  const slugParts = slug?.split("-") || [];
  const id = slugParts[0];
  const fetchPerson = usePersonStore((state) => state.fetchPerson);
  const loading = usePersonStore((state) => state.loading);
  const error = usePersonStore((state) => state.error);

  useEffect(() => {
    const getPerson = async () => {
      try {
        await fetchPerson(id);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    getPerson();
  }, [id, fetchPerson]);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <ErrorPage />
      ) : (
        <>
          <Navbar />
          <PersonComponent />
        </>
      )}
    </>
  );
};

export default Person;
