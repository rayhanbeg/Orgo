import MetricCard from './MetricCard'
import SimpleChart from './SimpleChart'
import RecentOrdersCard from './RecentOrdersCard'
import AdminTable from './AdminTable'
import {
  ChartIcon,
  MoneyIcon,
  OrdersIcon,
  ProductsIcon,
} from '../common/Icons'

function OverviewTab({
  totalStats,
  monthlyData,
  recentOrders,
  onViewOrders,
}) {
  const chartData = monthlyData.map((m) => m.totalAmount || 0).slice(-12)
  const chartLabels = monthlyData.map((m) => m._id?.slice(5) || '').slice(-12)

  return (
    <div className="space-y-8 bg-[#faf9f7] p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="TOTAL REVENUE"
          value={`৳${Number(totalStats.totalRevenue || 0).toFixed(2)}`}
          trend="Total earnings"
          trendDirection="up"
          trendPercent={12}
          icon={<MoneyIcon className="h-10 w-10" />}
        />
        <MetricCard
          title="ORDERS TODAY"
          value={totalStats.totalOrders || 0}
          trend="Orders placed today"
          trendDirection="up"
          trendPercent={8}
          icon={<OrdersIcon className="h-10 w-10" />}
        />
        <MetricCard
          title="AVERAGE ORDER"
          value={`৳${Number(
            (totalStats.totalRevenue || 0) / (totalStats.totalOrders || 1)
          ).toFixed(2)}`}
          trend="Average order value"
          trendDirection="up"
          trendPercent={2}
          icon={<ChartIcon className="h-10 w-10" />}
        />
        <MetricCard
          title="ACTIVE MENU ITEMS"
          value={totalStats.totalProducts || 0}
          trend="Active food items"
          trendDirection="up"
          trendPercent={0}
          icon={<ProductsIcon className="h-10 w-10" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SimpleChart data={chartData} labels={chartLabels} title="REVENUE BY MONTH" />
        </div>
        <RecentOrdersCard
          orders={recentOrders}
          onViewAll={onViewOrders}
        />
      </div>

      <div className="rounded-lg border border-[#e5ddd2] bg-white p-4 sm:p-6">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-wide text-gray-900">
          RECENT ORDERS
        </h2>
        <AdminTable
          columns={[
            { key: '_id', label: 'ORDER ID', render: (val) => `#${val?.slice(-5).toUpperCase() || 'N/A'}` },
            {
              key: 'shippingAddress',
              label: 'CUSTOMER',
              render: (val) => `${val?.firstName || 'Guest'} ${val?.lastName || ''}`.trim() || 'Guest',
            },
            { key: 'totalAmount', label: 'AMOUNT', render: (val) => `৳${Number(val || 0).toFixed(2)}` },
            { key: 'orderStatus', label: 'STATUS', render: (val) => val || 'Pending' },
            { key: 'createdAt', label: 'DATE', render: (val) => new Date(val).toLocaleDateString() },
          ]}
          data={recentOrders}
        />
      </div>
    </div>
  )
}

export default OverviewTab
