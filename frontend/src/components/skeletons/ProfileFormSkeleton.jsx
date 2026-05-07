import SkeletonLoader from './SkeletonLoader';

const ProfileFormSkeleton = ({ fields = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          {/* Label skeleton */}
          <SkeletonLoader width="w-1/4" height="h-3" borderRadius="rounded-md" />
          
          {/* Input skeleton */}
          <SkeletonLoader width="w-full" height="h-10" borderRadius="rounded-md" />
        </div>
      ))}

      {/* Button skeleton */}
      <div className="pt-4">
        <SkeletonLoader width="w-32" height="h-10" borderRadius="rounded-md" />
      </div>
    </div>
  );
};

export default ProfileFormSkeleton;
