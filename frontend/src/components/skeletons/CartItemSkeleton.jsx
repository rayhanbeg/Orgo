import SkeletonLoader from './SkeletonLoader';

const CartItemSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg mb-3"
        >
          {/* Product image skeleton */}
          <SkeletonLoader width="w-20" height="h-20" borderRadius="rounded-md" className="flex-shrink-0" />

          <div className="flex-1">
            {/* Product name skeleton */}
            <SkeletonLoader width="w-2/3" height="h-4" borderRadius="rounded-md" className="mb-2" />

            {/* Product price skeleton */}
            <SkeletonLoader width="w-1/4" height="h-3" borderRadius="rounded-md" className="mb-3" />

            {/* Quantity and remove section */}
            <div className="flex justify-between items-center">
              <SkeletonLoader width="w-20" height="h-8" borderRadius="rounded-md" />
              <SkeletonLoader width="w-1/5" height="h-4" borderRadius="rounded-md" />
            </div>
          </div>

          {/* Total price skeleton */}
          <div className="flex flex-col justify-center items-end">
            <SkeletonLoader width="w-24" height="h-5" borderRadius="rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
};

export default CartItemSkeleton;
