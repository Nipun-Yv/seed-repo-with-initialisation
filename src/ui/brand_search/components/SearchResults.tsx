import * as React from 'react';
import { SimilarImage } from '../types';
import { getImageUrl } from '../api/VisualSearch';

interface SearchResultsProps {
  results: SimilarImage[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e2e8f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-family="sans-serif" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        Search Results ({results.length})
      </h3>
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
        {results.map((image, index) => {
          const imageUrl = getImageUrl(image.filename);
          console.log(`Loading image ${index + 1}: ${image.filename} from ${imageUrl}`);
          const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
            src: imageUrl,
            alt: image.filename,
            className: "w-full h-full object-cover",
            onError: (e) => {
              console.error(`Failed to load image: ${imageUrl}`);
              handleImageError(e);
            },
            onLoad: () => {
              console.log(`Successfully loaded image: ${imageUrl}`);
            }
          };
          return (
            <div
              key={index}
              className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative bg-slate-100">
                <img {...imgProps} />
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-600 truncate" title={image.filename}>
                  {image.filename}
                </p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  {(image.similarity * 100).toFixed(1)}% match
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
