"use client";

import { Film, Filter, Plus, Search, Star, Trash2, Tv } from "lucide-react";
import React, { useState } from "react";

const AdminContentTab = () => {
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [contentSearch, setContentSearch] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("ALL");

  const [contentData, setContentData] = useState([
    {
      id: 1,
      title: "Inception",
      type: "Movie",
      genre: "Sci-Fi",
      year: 2010,
      rating: 4.8,
      addedBy: "User0",
    },
    {
      id: 2,
      title: "Breaking Bad",
      type: "TV Show",
      genre: "Crime / Drama",
      year: 2008,
      rating: 4.9,
      addedBy: "Marko Petrović",
    },
    {
      id: 3,
      title: "Interstellar",
      type: "Movie",
      genre: "Sci-Fi",
      year: 2014,
      rating: 4.9,
      addedBy: "User0",
    },
    {
      id: 4,
      title: "Stranger Things",
      type: "TV Show",
      genre: "Sci-Fi / Horror",
      year: 2016,
      rating: 4.7,
      addedBy: "Ana Jovanović",
    },
    {
      id: 5,
      title: "Dune: Part Two",
      type: "Movie",
      genre: "Action",
      year: 2024,
      rating: 4.9,
      addedBy: "User0",
    },
  ]);

  const filteredContent = contentData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
      item.genre.toLowerCase().includes(contentSearch.toLowerCase());
    const matchesType =
      contentTypeFilter === "ALL" || item.type === contentTypeFilter;
    return matchesSearch && matchesType;
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            Movies & TV Shows Catalog
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage platform movies, TV series, ratings, and media metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddContentModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium text-white shadow-lg shadow-red-950/50 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Media
          </button>
        </div>
      </div>

      {/* Filter Toolbar for Content */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or genre..."
            value={contentSearch}
            onChange={(e) => setContentSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="Movie">Movies</option>
            <option value="TV Show">TV Shows</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Year</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Added By</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredContent.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="p-3 font-medium text-zinc-200 flex items-center gap-2">
                    {item.type === "Movie" ? (
                      <Film className="w-4 h-4 text-red-500" />
                    ) : (
                      <Tv className="w-4 h-4 text-purple-400" />
                    )}
                    {item.title}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        item.type === "Movie"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400 text-xs">{item.genre}</td>
                  <td className="p-3 text-zinc-400 text-xs">{item.year}</td>
                  <td className="p-3 text-xs text-zinc-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {item.rating}
                  </td>
                  <td className="p-3 text-xs text-zinc-400">{item.addedBy}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      title="Delete Item"
                      className="p-1.5 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContentTab;
