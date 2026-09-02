'use client';

import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { BsThreeDotsVertical } from 'react-icons/bs';
import OrderInfoModal from '@/components/Shop/OrderInfoModal';
import axios from 'axios';

interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string | null;
}

interface OrderItem {
  productId: string;
  name: string;
  size: string | null;
  quantity: number;
  price: number | string;
  image: string;
}

interface Order {
  _id: string;
  id: number;
  customer: OrderCustomer;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending';
  deliveryMethod: string;
  totalPayment: number;
  status: string;
  orderedAt: string;
}

export default function OrdersPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleToggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleClickOutside = () => setOpenMenuId(null);

  const handleViewOrder = (orderId: string) => {
    setIsModalOpen(true);
    setSelectedOrderId(orderId);
  };

  useEffect(() => {
    axios.get('/api/orders')
      .then(response => {
        const ordersWithId = response.data.map((order: Order, idx: number) => ({
          ...order,
          id: order.id ?? idx + 1, // Use existing id or fallback to index+1
        }));
        setOrders(ordersWithId);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  // Filtering logic
  const filteredOrders = orders?.filter(order => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search) ||
      order.orderedAt.includes(search);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper to format date as "Jul, 10"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
    });
  };

  const columns: TableColumn<Order>[] = [
    { name: 'Order ID', selector: row => row.id.toString(), sortable: true },
    { name: 'Customer', selector: row => row.customer.name, sortable: true },
    { name: 'Email', selector: row => row.customer.email, sortable: true },
    { name: 'Date', selector: row => formatDate(row.orderedAt), sortable: true },
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
    { name: 'Total (€)', selector: row => `€${row.totalPrice},00`, sortable: true },
    {
      name: 'Actions',
      cell: (row, rowIndex) => {
        const lastThreeIndexes = [orders.length - 1, orders.length - 2, orders.length - 3];
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
                className={`absolute z-20 right-5 w-32 bg-white border border-gray-200 rounded shadow
                  ${isLastRow ? 'bottom-7 mb-0' : 'mt-1'}`}
                style={isLastRow ? { top: 'auto' } : {}}
              >
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer" onClick={() => handleViewOrder(row._id)}>
                  <i className="fa fa-eye text-gray-500" aria-hidden="true"></i>
                  View
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
          <p className="mt-2 text-2xl font-bold text-gray-800">{orders?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Revenue</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{orders?.filter(order => order.status === 'Pending').length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-500">Delivered Orders</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{orders?.filter(order => order.status === 'Delivered').length || 0}</p>
        </div>
      </div>

    <div className="max-w-6xl mx-auto px-4 py-6 border-2 rounded-lg bg-white relative overflow-visible" onClick={handleClickOutside}>

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
      <OrderInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} orderId={selectedOrderId} />
    </div>
  );
}
