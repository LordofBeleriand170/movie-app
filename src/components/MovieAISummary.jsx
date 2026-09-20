"use client";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const MovieAISummary = ({ comments }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (comments.length < 3) return;

      setLoading(true);
      try {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comments }),
        });
        const data = await res.json();
        setSummary(data.summary.criticalReception);
      } catch (error) {
        console.error("AI Summary error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [comments.length]);

  return (
    <div className="p-4 rounded-lg bg-indigo-900/10 border border-indigo-500/30 my-4">
      <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-sm">
        <Sparkles size={16} />
        AI CONSENSUS
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-zinc-800 rounded w-full"></div>
          <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
        </div>
      ) : (
        <p className="text-zinc-200 text-sm italic leading-relaxed">
          {summary || "Analyzing reviews..."}
        </p>
      )}
    </div>
  );
};

export default MovieAISummary;
