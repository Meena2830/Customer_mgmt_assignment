import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import { api } from '../api/api.js';
import { FiEye, FiEdit, FiTrash2, FiX, FiUsers } from 'react-icons/fi';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Customer to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCustomers = async (query = '') => {
    try {
      setLoading(true);
      const res = await api.get('/customers', { params: { q: query } });
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => fetchCustomers(q), 500);
    return () => clearTimeout(delay);
  }, [q]);

  useEffect(() => { fetchCustomers(); }, []);

  const confirmDelete = (customer) => {
    setDeleteTarget(customer);
    setShowDeleteModal(true);
  };

  const deleteCustomer = async () => {
    try {
      await api.delete(`/customers/${deleteTarget.id}`);
      setCustomers(customers.filter(c => c.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or phone"
          className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-300"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded transition duration-300"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Customer count */}
      {!loading && customers.length > 0 && (
        <div className="mb-4 text-gray-900 font-extrabold text-xl flex items-center gap-2">
  <FiUsers className="text-black-900 w-5 h-5" /> {customers.length} customer(s) found
</div>

      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow h-32"></div>
          ))}
        </div>
      )}

      {/* Customers Grid */}
      {!loading && customers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transform transition duration-300 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="text-xl font-semibold text-gray-800">{c.first_name} {c.last_name}</div>
                <div className="text-sm text-gray-500">{c.phone_number}</div>
              </div>
              <div className="flex justify-between mt-auto gap-2">
                <Link
                  to={`/customers/${c.id}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                  title="View customer"
                >
                  <FiEye /> View
                </Link>
                <Link
                  to={`/edit/${c.id}`}
                  className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 font-medium transition"
                  title="Edit customer"
                >
                  <FiEdit /> Edit
                </Link>
                <button
                  onClick={() => confirmDelete(c)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
                  title="Delete customer"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-10 gap-3">
          <FiUsers size={50} />
          <div className="text-lg font-medium">No customers found</div>
          <Link
            to="/create"
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Add First Customer
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center space-y-4">
            <h4 className="text-lg font-semibold">Confirm Delete</h4>
            <p>Are you sure you want to delete {deleteTarget.first_name} {deleteTarget.last_name}?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={deleteCustomer}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
