export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2" />
      </div>
      <div className="px-6 py-6">
        <div className="h-64 bg-white rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
