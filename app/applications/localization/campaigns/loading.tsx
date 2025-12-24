export default function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-96 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
