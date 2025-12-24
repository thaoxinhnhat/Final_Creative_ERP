import { FolderKanban, Loader2 } from "lucide-react"

export default function ASODashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <FolderKanban className="h-6 w-6 text-white" />
            </div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Main content loading */}
      <div className="p-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Loading message with spinner */}
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu Project...</h3>
            <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    </div>
  )
}
