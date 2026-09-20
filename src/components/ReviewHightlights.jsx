"use client";

import { useEffect } from "react";
import { AlertCircle, PlusCircle, MinusCircle, Sparkles } from "lucide-react";
import { useContentStore } from "@/features/content/contentStore";

export const ReviewHighlights = ({ movieId, type, contentTitle }) => {
  const { aiSummary, aiLoading, aiError, comments } = useContentStore();

  useEffect(() => {
    if (comments && comments.length >= 3 && movieId) {
      useContentStore.getState().fetchAiSummary(movieId, type, contentTitle);
    }
  }, [movieId, type, comments.length]);

  if (aiLoading) {
    return (
      <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 my-6 animate-pulse max-w-4xl">
        <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold text-sm">
          <Sparkles size={16} /> GENERATING SUMMARY...
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-zinc-800 rounded w-full"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 bg-zinc-900 rounded-full w-28 border border-zinc-800"></div>
          <div className="h-8 bg-zinc-900 rounded-full w-36 border border-zinc-800"></div>
        </div>
      </div>
    );
  }

  if (aiError) {
    return (
      <div className="bg-red-950/20 p-6 rounded-2xl border border-red-900/40 my-6 text-center text-red-300">
        <AlertCircle className="mx-auto mb-2" size={30} />
        <p>Could not generate AI summary.</p>
        <p className="text-xs text-red-500">{aiError}</p>
      </div>
    );
  }

  if (!aiSummary || comments.length < 3) return null;

  const summaryText =
    aiSummary.text ||
    aiSummary.summaryText ||
    aiSummary.summaryParagraph ||
    aiSummary.summary ||
    "";

  const pros = aiSummary.pros || aiSummary.tags || [];
  const cons = aiSummary.cons || [];

  return (
    <div className="rounded-2xl text-zinc-100 w-full">
      <div className="flex items-baseline gap-2.5">
        <span className="h-6 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <h3 className="text-2xl font-bold mb-3 tracking-tight">Summary</h3>
      </div>
      {summaryText && (
        <p className="text-zinc-300 text-base leading-relaxed mb-3 font-normal">
          {summaryText}
        </p>
      )}

      <p className="text-xs text-zinc-500 mb-6 font-medium">
        AI-generated from the text of user reviews
      </p>

      <div className="flex flex-wrap gap-2.5">
        {pros.map((tag, index) => (
          <span
            key={`pro-${index}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-zinc-900 text-zinc-200 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
          >
            <PlusCircle className="text-green-500 w-4 h-4 shrink-0" />
            {tag}
          </span>
        ))}

        {cons.map((tag, index) => (
          <span
            key={`con-${index}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-zinc-900 text-zinc-200 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
          >
            <MinusCircle className="text-red-500 w-4 h-4 shrink-0" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
