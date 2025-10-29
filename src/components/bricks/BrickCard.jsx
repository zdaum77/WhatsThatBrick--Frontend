import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function BrickCard({ brick }) {
  return (
    <Link
      to={`/bricks/${brick._id}`}
      className="card hover:shadow-lg transition-shadow"
    >
      {/* image */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {brick.image_urls && brick.image_urls[0] ? (
          <img
            src={brick.image_urls[0]}
            alt={brick.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">🧱</span>
          </div>
        )}
      </div>

      {/* part Code */}
      {brick.part_code && (
        <div className="inline-block bg-lego-cream text-lego-textred text-xs font-semibold px-2 py-1 rounded border border-lego-red mb-2">
          {brick.part_code}
        </div>
      )}

      {/* name */}
      <h3 className="font-bold text-lg mb-2 line-clamp-2">{brick.name}</h3>

      {/* category */}
      {brick.category && (
        <p className="text-sm text-gray-600 capitalize mb-2">
          {brick.category}
        </p>
      )}

      {/* colors */}
      {brick.color_variants && brick.color_variants.length > 0 && (
        <div className="flex items-center space-x-1 mb-4">
          {brick.color_variants.slice(0, 5).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: color.code || "#ccc" }}
              title={color.name}
            />
          ))}
          {brick.color_variants.length > 5 && (
            <span className="text-xs text-gray-500">
              +{brick.color_variants.length - 5}
            </span>
          )}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="flex items-center space-x-1 hover:text-primary-600"
        >
          <Heart size={16} />
        </button>

        {brick.status === "pending" && (
          <span className="text-orange-600 font-medium">Pending</span>
        )}
      </div>
    </Link>
  );
}
