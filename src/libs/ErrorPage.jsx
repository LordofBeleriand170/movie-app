import Link from "next/link";
import React from "react";

const ErrorPage = (error) => {
  console.log(error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black text-white px-4">
      {/* Status code */}
      <h1 className="text-6xl font-bold mb-4">Error occured</h1>

      {/* Message */}
      <p className="text-xl text-gray-300 mb-6 text-center max-w-xl"></p>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
        >
          Go Home
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
