import { useContentStore } from "@/features/content/contentStore";
import Image from "next/image";
import React from "react";

const AwardsComponent = () => {
  const content = useContentStore((state) => state.content);
  const awards = content?.awards;

  if (!awards || awards === "N/A") return null;

  // --- MATCHERS ---
  const oscarWin = awards.match(/Won\s+(\d+)\s+Oscars?/i);
  const oscarNom =
    !oscarWin && awards.match(/Nominated\s+for\s+(\d+)\s+Oscars?/i);
  const emmyWin = awards.match(/Won\s+(\d+)\s+Primetime\s+Emmys?/i);
  const emmyNom =
    !emmyWin && awards.match(/Nominated\s+for\s+(\d+)\s+Primetime\s+Emmys?/i);
  const baftaNom = awards.match(/Nominated\s+for\s+(\d+)\s+BAFTA\s+Awards?/i);

  // --- PRIMARY HIGHLIGHT ---
  const primaryAwardMatch =
    oscarWin || oscarNom || emmyWin || emmyNom || baftaNom;
  const primaryText = primaryAwardMatch ? primaryAwardMatch[0] : null;

  // --- SECONDARY TEXT CLEANUP ---
  let secondaryText = awards;
  if (primaryText) {
    secondaryText = secondaryText
      .replace(primaryText, "")
      // Clean leading/trailing punctuation (. , or spaces)
      .replace(/^[\s.,;]+|[\s.,;]+$/g, "")
      .trim();
  }

  if (!primaryText && !secondaryText) return null;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-lg shadow-black/40 text-sm">
      {(oscarWin || emmyWin) && (
        <div className="relative flex items-center justify-center h-15 aspect-[1/2] rounded-lg shrink-0 overflow-hidden">
          <Image
            src="/oscar-statue.png"
            alt="Oscar Statue"
            fill
            sizes="40px"
            className="object-contain p-1"
          />
        </div>
      )}

      {/* Text Container */}
      <div className="flex items-center gap-2 flex-wrap">
        {primaryText && (
          <span className="font-semibold text-slate-100 tracking-wide">
            {primaryText}
          </span>
        )}
        {secondaryText && (
          <span className="text-slate-400 font-normal">{secondaryText}</span>
        )}
      </div>
    </div>
  );
};

export default AwardsComponent;
