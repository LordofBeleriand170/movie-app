"use client";

import React, { useState } from "react";

const SummarizeComments = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeComments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyse_reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Inception",
          reviews: [
            "Odličan film, priča je neverovatna i drži pažnju od početka do kraja!",
            "Gluma je sjajna, ali je kraj malo zbunjujuć.",
            "Previše komplikovana radnja, nije mi se dopao.",
          ],
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Greška pri analizi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "500px",
      }}
    >
      <h2>Analiza utisaka za film "Inception"</h2>

      <button
        onClick={analyzeComments}
        disabled={loading}
        style={{ padding: "10px 15px", cursor: "pointer" }}
      >
        {loading ? "Analiziram..." : "Analiziraj komentare"}
      </button>

      {analysis && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Opšti sentiment:</strong> {analysis.sentiment}
          </p>
          <p>
            <strong>Pozitivne ocene:</strong> {analysis.positivePercentage}%
          </p>
          <p>
            <strong>Sažetak:</strong> {analysis.summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default SummarizeComments;
