export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070709] text-white">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        403 - Unauthorized
      </h1>
      <p className="text-neutral-400 mb-6">
        You do not have permission to view this page.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
      >
        Go Back Home
      </a>
    </div>
  );
}
