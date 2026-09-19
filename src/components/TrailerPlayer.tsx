interface TrailerPlayerProps {
  video: {
    key: string;
  };
  setTrailer: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ video, setTrailer }) => {
  const key = video?.key;

  return (
    <div className="inset-0 z-50 w-full flex items-center justify-center ">
      <div className="relative w-full max-w-3xl mx-4">
        <button
          onClick={() => setTrailer(false)}
          className="absolute flex gap-2 items-center top-5 right-2 text-white  cursor-pointer font-bold z-50 hover:text-red-500 transition"
        >
          <span className="text-4xl">&times;</span>
          <span className="text-xl">Close</span>
        </button>

        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${key}?autoplay=1`}
          title="Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        />
      </div>
    </div>
  );
};
export default TrailerPlayer;
