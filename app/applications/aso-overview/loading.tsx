export default function ASOOverviewLoading() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="h-96 bg-white rounded-lg animate-pulse" />
      <div className="h-96 bg-white rounded-lg animate-pulse" />
    </div>
  )
}
