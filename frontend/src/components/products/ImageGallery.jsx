import { useState } from 'react'

function ImageGallery({ images = [] }) {
  const [activeImage, setActiveImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 aspect-square rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gray-100 aspect-square rounded-lg mb-4 overflow-hidden">
        <img
          src={images[activeImage]}
          alt={`Product view ${activeImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`bg-gray-200 aspect-square rounded-lg overflow-hidden cursor-pointer transition ${
                activeImage === idx ? 'ring-2 ring-black' : 'hover:opacity-80'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
