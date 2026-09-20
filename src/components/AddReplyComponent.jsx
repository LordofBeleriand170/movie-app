"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useMovieStore } from "@/features/movie/movieStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddReplyComponent = ({ id }) => {
  const addRespond = useMovieStore((state) => state.addRespond);

  const user = useCollectionStore((state) => state.user);

  const [openComment, setOpenComment] = useState(false);
  const [respond, setRespond] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const handleRespondSubmit = async (commentId) => {
    if (!user?.email) {
      router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
      return;
    }

    if (!respond.trim()) return;

    try {
      await addRespond(user, commentId, respond);

      setRespond("");
      setOpenComment(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to add reply. Please try again.");
    }
  };

  return (
    <>
      <div>
        <button
          className="text-blue-500 font-bold cursor-pointer"
          onClick={() => setOpenComment(true)}
        >
          + Add Response
        </button>
      </div>

      {openComment && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/70">
          <div className="bg-[#0f0f10] text-white rounded-2xl p-6 w-[90%] max-w-xl shadow-2xl relative border border-zinc-800">
            <button
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg"
              onClick={() => setOpenComment(false)}
            >
              &times;
            </button>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white">Add Response</h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRespondSubmit(id);
                }}
              >
                <textarea
                  className="w-full min-h-40 py-3 px-4 bg-[#18181b] text-white placeholder-zinc-500 rounded-xl border border-zinc-800 outline-none resize-none focus:border-zinc-700"
                  placeholder="Add Review..."
                  value={respond}
                  onChange={(e) => setRespond(e.target.value)}
                />
                <button
                  type="submit"
                  className="self-end px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl cursor-pointer hover:bg-red-700 transition"
                >
                  Add Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddReplyComponent;
