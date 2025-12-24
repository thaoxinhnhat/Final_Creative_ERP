export default function Loading() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      <div className="h-96 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
