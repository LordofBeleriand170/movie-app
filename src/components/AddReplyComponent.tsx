"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useMovieStore } from "@/features/movie/movieStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface AddReplyComponentProps {
  id: string | undefined;
}

const AddReplyComponent: React.FC<AddReplyComponentProps> = ({ id }) => {
  const { addRespond } = useMovieStore((state) => state.addRespond);

  const user = useCollectionStore((state) => state.user);

  const [openComment, setOpenComment] = useState(false);
  const [respond, setRespond] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = `${pathname}?${searchParams.toString()}`;

  const handleRespondSubmit = async (commentId: string | undefined) => {
    if (!user?.email) {
      router.push(`/login?callbackUrl=${encodeURIComponent(fullUrl)}`);
      return;
    }

    if (!respond.trim()) return;

    try {
      // Add the reply
      await addRespond(user, commentId, respond);

      // ✅ Success toast
      toast.success("Reply added successfully!");

      // Clear form
      setRespond("");
      setOpenComment(false);
    } catch (error) {
      console.error(error);

      // ❌ Error toast
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
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/60">
          <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-xl shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
              onClick={() => setOpenComment(false)}
            >
              &times;
            </button>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Add Response</h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRespondSubmit(id);
                }}
              >
                <textarea
                  className="w-full min-h-40 indent-2 py-2 px-3 bg-gray-200 rounded-lg outline-none resize-none"
                  placeholder="Add Review..."
                  value={respond}
                  onChange={(e) => setRespond(e.target.value)}
                />
                <button
                  type="submit"
                  className="self-end px-4 py-2 border-2 border-black rounded-lg cursor-pointer hover:bg-black hover:text-white transition"
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
