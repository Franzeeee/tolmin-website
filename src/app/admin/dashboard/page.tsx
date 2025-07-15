export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin! 👋</h1>
        <p className="text-gray-600 mt-1">
          Manage your football club site: update matches, news, shop items, and more.
        </p>
      </div>

      {/* Top 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Upcoming Matches</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">News Articles</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Merch Products</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">24</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Sponsors</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">8</p>
        </div>
      </div>

      {/* Big card below */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Club Overview</h2>
        <p className="text-gray-600">
          Here you can see recent activity, manage content, and keep your club&#39;s website up to date to engage your fans.
        </p>
      </div>
    </div>
  )
}
