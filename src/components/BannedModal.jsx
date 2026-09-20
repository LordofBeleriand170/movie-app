"use client";

import { useCollectionStore } from "@/features/collection/collectionStore";
import { useState } from "react";
import { toast } from "react-toastify";

const BannedModal = ({ comment, setBannedModal }) => {
  const [bannedText, setBannedText] = useState("");
  const [bannedUntil, setBannedUntil] = useState("");

  const user = useCollectionStore((state) => state.user);

  const ban = useCollectionStore((state) => state.ban);

  const receiverId = comment?.comment?.userId;
  const senderId = user.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await ban(receiverId, senderId, bannedText, bannedUntil);

      if (res?.ok) {
        toast.success("Ban request has been sent!");
        setBannedModal(false);
      } else {
        toast.error("Error occurred!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error occurred!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white text-black p-6 rounded-lg  gap-3 w-80">
        <button
          className="flex justify-end cursor-pointer"
          onClick={() => setBannedModal(false)}
        >
          X
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>Reason for ban</label>
          <input
            className="border p-2 rounded"
            placeholder="Reason..."
            value={bannedText}
            onChange={(e) => setBannedText(e.target.value)}
          />

          <label>Banned until</label>
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={bannedUntil}
            onChange={(e) => setBannedUntil(e.target.value)}
          />

          <button
            type="submit"
            className="bg-red-500 cursor-pointer text-white p-2 rounded"
          >
            Send Ban
          </button>
        </form>
      </div>
    </div>
  );
};

export default BannedModal;
