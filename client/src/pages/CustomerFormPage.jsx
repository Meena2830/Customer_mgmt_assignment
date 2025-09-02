import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api.js';

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addrForm, setAddrForm] = useState({ address_details: '', city: '', state: '', pin_code: '' });

  // Load customer + addresses
  useEffect(() => {
    if (!id) return; // New customer
    const load = async () => {
      try {
        setLoading(true);
        const custRes = await api.get(`/customers/${id}`);
        setCustomer(custRes.data.data || { first_name: '', last_name: '', phone_number: '' });

        const addrRes = await api.get(`/customers/${id}/addresses`);
        setAddresses(Array.isArray(addrRes.data.data) ? addrRes.data.data : []);
      } catch (err) {
        console.error(err);
        alert('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Save customer
  const submitCustomer = async (e) => {
    e.preventDefault();
    try {
      if (id) await api.put(`/customers/${id}`, customer);
      else await api.post('/customers', customer);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Save failed: ' + (err?.response?.data?.error || err.message));
    }
  };

  // Add address
  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/customers/${id}/addresses`, addrForm);
      setAddrForm({ address_details: '', city: '', state: '', pin_code: '' });
      const addrRes = await api.get(`/customers/${id}/addresses`);
      setAddresses(Array.isArray(addrRes.data.data) ? addrRes.data.data : []);
    } catch (err) {
      console.error(err);
      alert('Add address failed');
    }
  };

  // Edit / Delete address
  const editAddress = async (addr) => {
    const newDetails = prompt('Edit address details', addr.address_details);
    if (!newDetails) return;
    try {
      await api.put(`/addresses/${addr.id}`, { ...addr, address_details: newDetails });
      setAddresses(addresses.map(a => a.id === addr.id ? { ...a, address_details: newDetails } : a));
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };
  const deleteAddress = async (addrId) => {
    if (!confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${addrId}`);
      setAddresses(addresses.filter(a => a.id !== addrId));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Customer form */}
      <form onSubmit={submitCustomer} className="bg-white p-6 rounded shadow mb-4">
        <div className="mb-3">
          <label className="block mb-1">First name</label>
          <input
            required
            value={customer.first_name}
            onChange={e => setCustomer({ ...customer, first_name: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Last name</label>
          <input
            required
            value={customer.last_name}
            onChange={e => setCustomer({ ...customer, last_name: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Phone number</label>
          <input
            required
            value={customer.phone_number}
            onChange={e => setCustomer({ ...customer, phone_number: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>

      {/* Conditional rendering of addresses */}
      {id && addresses.length > 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Addresses</h3>
          <ul className="space-y-2">
            {addresses.map(a => (
              <li key={a.id} className="p-2 border rounded flex justify-between">
                <div>
                  <div>{a.address_details}</div>
                  <div className="text-sm text-gray-500">{a.city}, {a.state} - {a.pin_code}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => editAddress(a)} className="text-yellow-600">Edit</button>
                  <button onClick={() => deleteAddress(a.id)} className="text-red-600">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Show add address form only if no addresses
        id && (
          <form onSubmit={addAddress} className="bg-white p-4 rounded shadow mt-4">
            <h4 className="font-semibold mb-2">Add Address</h4>
            <div className="mb-2">
              <input
                value={addrForm.address_details}
                onChange={(e) => setAddrForm({ ...addrForm, address_details: e.target.value })}
                placeholder="Address details"
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input
                value={addrForm.city}
                onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                placeholder="City"
                className="border p-2"
                required
              />
              <input
                value={addrForm.state}
                onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                placeholder="State"
                className="border p-2"
                required
              />
              <input
                value={addrForm.pin_code}
                onChange={(e) => setAddrForm({ ...addrForm, pin_code: e.target.value })}
                placeholder="Pin code"
                className="border p-2"
                required
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </form>
        )
      )}
    </div>
  );
}
