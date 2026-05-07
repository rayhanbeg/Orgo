import SkeletonLoader from './SkeletonLoader';

const ProductCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image skeleton */}
          <SkeletonLoader width="w-full" height="h-48" borderRadius="rounded-none" className="mb-0" />
          
          <div className="p-4">
            {/* Title skeleton */}
            <SkeletonLoader width="w-3/4" height="h-4" borderRadius="rounded-md" className="mb-3" />
            
            {/* Description skeletons */}
            <SkeletonLoader width="w-full" height="h-3" borderRadius="rounded-md" className="mb-2" />
            <SkeletonLoader width="w-5/6" height="h-3" borderRadius="rounded-md" className="mb-4" />
            
            {/* Rating and price skeleton */}
            <div className="flex justify-between items-center">
              <SkeletonLoader width="w-1/3" height="h-4" borderRadius="rounded-md" />
              <SkeletonLoader width="w-1/4" height="h-5" borderRadius="rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardSkeleton;
