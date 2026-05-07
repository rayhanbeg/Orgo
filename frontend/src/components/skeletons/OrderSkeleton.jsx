import SkeletonLoader from './SkeletonLoader';

const OrderSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          {/* Order header */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <SkeletonLoader width="w-1/3" height="h-4" borderRadius="rounded-md" className="mb-2" />
              <SkeletonLoader width="w-1/4" height="h-3" borderRadius="rounded-md" />
            </div>
            <SkeletonLoader width="w-20" height="h-8" borderRadius="rounded-md" />
          </div>

          {/* Order items */}
          <div className="space-y-3 mb-4">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex gap-4">
                <SkeletonLoader width="w-16" height="h-16" borderRadius="rounded-md" />
                <div className="flex-1">
                  <SkeletonLoader width="w-2/3" height="h-4" borderRadius="rounded-md" className="mb-2" />
                  <SkeletonLoader width="w-1/3" height="h-3" borderRadius="rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Order footer */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <SkeletonLoader width="w-1/4" height="h-4" borderRadius="rounded-md" />
            <SkeletonLoader width="w-1/5" height="h-4" borderRadius="rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderSkeleton;
