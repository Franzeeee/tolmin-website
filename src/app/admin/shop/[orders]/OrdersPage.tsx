'use client';

import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { BsThreeDotsVertical } from 'react-icons/bs';
import OrderInfoModal from '@/components/Shop/OrderInfoModal';

type Order = {
  id: number;
  customer: string;
  email: string;
  date: string;
  status: string;
  total: number;
};

const mockOrders: Order[] = [
  { id: 1, customer: "Alice", email: "alice@example.com", date: "2024-06-01", status: "Pending", total: 120 },
  { id: 2, customer: "Bob", email: "bob@example.com", date: "2024-06-02", status: "Shipped", total: 80 },
  { id: 3, customer: "Charlie", email: "charlie@example.com", date: "2024-06-03", status: "Delivered", total: 200 },
  { id: 4, customer: "Diana", email: "diana@example.com", date: "2024-06-04", status: "Cancelled", total: 50 },
  { id: 5, customer: "Eve", email: "eve@example.com", date: "2024-06-05", status: "Pending", total: 150 },
  { id: 6, customer: "Frank", email: "frank@example.com", date: "2024-06-06", status: "Shipped", total: 90 },
  { id: 7, customer: "Grace", email: "grace@example.com", date: "2024-06-07", status: "Delivered", total: 300 },
  { id: 8, customer: "Henry", email: "henry@example.com", date: "2024-06-08", status: "Pending", total: 110 },
  { id: 9, customer: "Ivy", email: "ivy@example.com", date: "2024-06-09", status: "Shipped", total: 70 },
  { id: 10, customer: "Jack", email: "jack@example.com", date: "2024-06-10", status: "Delivered", total: 220 },
];

export default function OrdersPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleClickOutside = () => setOpenMenuId(null);

  const handleViewOrder = (orderId: number) => {
    setIsModalOpen(true);
  };

  // Filtering logic
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search) ||
      order.date.includes(search);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: TableColumn<Order>[] = [
    { name: 'Order ID', selector: row => row.id.toString(), sortable: true },
    { name: 'Customer', selector: row => row.customer, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Date', selector: row => row.date, sortable: true },
    {
      name: 'Status',
      cell: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          row.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
          row.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      ),
      sortable: true
    },
    { name: 'Total ($)', selector: row => `$${row.total}`, sortable: true },
    {
      name: 'Actions',
      cell: (row, rowIndex) => {
        const lastThreeIndexes = [mockOrders.length - 1, mockOrders.length - 2, mockOrders.length - 3];
        const isLastRow = lastThreeIndexes.includes(rowIndex);
        return (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="p-2 rounded hover:bg-gray-100 flex items-center justify-center mx-auto"
              onClick={() => handleToggleMenu(row.id)}
            >
              <BsThreeDotsVertical />
            </button>
            {openMenuId === row.id && (
              <div
                className={`absolute z-20 right-0 w-32 bg-white border border-gray-200 rounded shadow
                  ${isLastRow ? 'bottom-10 mb-0' : 'mt-1'}`}
                style={isLastRow ? { top: 'auto' } : {}}
              >
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer" onClick={() => handleViewOrder(row.id)}>
                  <i className="fa fa-eye text-gray-500" aria-hidden="true"></i>
                  View
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                  <i className="fa fa-truck text-blue-500" aria-hidden="true"></i>
                  Shipped
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black flex items-center gap-2 cursor-pointer">
                  <i className="fa fa-check text-green-400" aria-hidden="true"></i>
                  Delivered
                </button>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    
<div className="space-y-6 max-w-6xl m-auto">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Orders Page! 👋</h1>
        <p className="text-gray-600 mt-1">
          Here you can manage all orders, view details, and update statuses.
        </p>
      </div>

      {/* Top 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Total Orders</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Revenue</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">24</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Delivered Orders</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">8</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 border-2 rounded-lg bg-white" onClick={handleClickOutside}>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>
        <div className="flex flex-col justify-between md:flex-row gap-4 mb-4">
          <div className="relative w-full md:w-1/3">
            <input
          type="text"
          placeholder="Search by customer, email, ID or date..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 transition"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <i className="fa fa-search" aria-hidden="true"></i>
            </span>
          </div>
          <div className="relative w-full md:w-1/5">
            <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none transition"
            >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <i className="fa fa-chevron-down" aria-hidden="true"></i>
            </span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredOrders}
          pagination
          highlightOnHover
          responsive
          striped
        />
      </div>
      <OrderInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
