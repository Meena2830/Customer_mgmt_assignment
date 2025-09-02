import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api.js';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addrForm, setAddrForm] = useState({ address_details: '', city: '', state: '', pin_code: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingAddr, setEditingAddr] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null); // Address selected for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = async () => {
    try {
      const custRes = await api.get(`/customers/${id}`);
      setCustomer(custRes.data.data);

      const addrRes = await api.get(`/customers/${id}/addresses`);
      setAddresses(Array.isArray(addrRes.data.data) ? addrRes.data.data : []);
    } catch (err) {
      console.error(err);
      alert('Failed to load customer data');
    }
  };

  useEffect(() => { load(); }, [id]);

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/customers/${id}/addresses`, addrForm);
      setAddrForm({ address_details: '', city: '', state: '', pin_code: '' });
      load();
    } catch (err) {
      console.error(err);
      alert('Add address failed');
    }
  };

  const saveAddress = async (addrId) => {
    try {
      await api.put(`/addresses/${addrId}`, editingAddr);
      setEditingId(null);
      load();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const confirmDelete = (addr) => {
    setDeleteTarget(addr);
    setShowDeleteModal(true);
  };

  const deleteAddress = async () => {
    try {
      await api.delete(`/addresses/${deleteTarget.id}`);
      setAddresses(addresses.filter(a => a.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6 relative">
      {!customer ? <div>Loading...</div> : (
        <>
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold">{customer.first_name} {customer.last_name}</h2>
            <div className="text-gray-600">{customer.phone_number}</div>
          </div>

          {/* Addresses */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Addresses</h3>
            {addresses.length > 0 ? (
              <ul className="space-y-3">
                {addresses.map((a) => (
                  <li key={a.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
                    {editingId === a.id ? (
                      <>
                        <div className="flex-1 space-y-2 w-full">
                          <input
                            value={editingAddr.address_details}
                            onChange={(e) => setEditingAddr({ ...editingAddr, address_details: e.target.value })}
                            className="border p-2 w-full rounded"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              value={editingAddr.city}
                              onChange={(e) => setEditingAddr({ ...editingAddr, city: e.target.value })}
                              className="border p-2 rounded"
                            />
                            <input
                              value={editingAddr.state}
                              onChange={(e) => setEditingAddr({ ...editingAddr, state: e.target.value })}
                              className="border p-2 rounded"
                            />
                            <input
                              value={editingAddr.pin_code}
                              onChange={(e) => setEditingAddr({ ...editingAddr, pin_code: e.target.value })}
                              className="border p-2 rounded"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveAddress(a.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 space-y-1">
                          <div>{a.address_details}</div>
                          <div className="text-sm text-gray-500">{a.city}, {a.state} - {a.pin_code}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingId(a.id); setEditingAddr(a); }}
                            className="text-yellow-600 font-medium px-2 py-1 rounded border border-yellow-600 hover:bg-yellow-50 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(a)}
                            className="text-red-600 font-medium px-2 py-1 rounded border border-red-600 hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <form onSubmit={addAddress} className="space-y-3">
                <h4 className="font-semibold">Add Address</h4>
                <input
                  value={addrForm.address_details}
                  onChange={(e) => setAddrForm({ ...addrForm, address_details: e.target.value })}
                  placeholder="Address details"
                  className="border p-2 w-full rounded"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    placeholder="City"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    placeholder="State"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    value={addrForm.pin_code}
                    onChange={(e) => setAddrForm({ ...addrForm, pin_code: e.target.value })}
                    placeholder="Pin code"
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
              </form>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center space-y-4">
                <h4 className="text-lg font-semibold">Confirm Delete</h4>
                <p>Are you sure you want to delete this address?</p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={deleteAddress}
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
        </>
      )}
    </div>
  );
}
