
import React from 'react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onSelect }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">Your creations will appear here</p>
        <p className="text-sm">Start by entering a prompt above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <div 
          key={img.id}
          onClick={() => onSelect(img)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl glass transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <img 
            src={img.url} 
            alt={img.prompt} 
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p className="text-sm font-medium text-white line-clamp-2 mb-1">{img.prompt}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider text-white backdrop-blur-md font-bold">
                CREAO 1
              </span>
              <span className="text-[10px] text-gray-300">
                {new Date(img.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
