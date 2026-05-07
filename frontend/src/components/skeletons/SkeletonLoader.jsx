const SkeletonLoader = ({ width = 'w-full', height = 'h-4', borderRadius = 'rounded-md', count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${width} ${height} ${borderRadius} bg-gray-300 animate-pulse ${className}`}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
