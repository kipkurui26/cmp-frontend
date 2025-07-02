import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import AxiosInstance from '../../../utils/AxiosInstance';
import { useToast } from "../../../context/ToastContext";

const WarehouseEdit = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    county: '',
    sub_county: '',
    licence_number: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchWarehouse();
    // eslint-disable-next-line
  }, [warehouseId]);

  const fetchWarehouse = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AxiosInstance.get(`warehouse/warehouses/${warehouseId}/`);
      setFormData({
        name: response.data.name || '',
        county: response.data.county || '',
        sub_county: response.data.sub_county || '',
        licence_number: response.data.licence_number || '',
        is_active: response.data.is_active,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch warehouse details.');
      showToast(err.response?.data?.detail || 'Failed to fetch warehouse details.', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await AxiosInstance.patch(`warehouse/warehouses/${warehouseId}/`, formData);
      setSuccessMessage('Warehouse updated successfully!');
      showToast('Warehouse updated successfully!', "success");
      setTimeout(() => navigate(`/admin/warehouses/${warehouseId}`), 1200);
    } catch (err) {
      const errorMsg =
        (err.response?.data && typeof err.response.data === 'object'
          ? Object.values(err.response.data).flat().join(' ')
          : err.response?.data?.detail) ||
        'Failed to update warehouse.';
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/admin/warehouses/${warehouseId}`)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Warehouse</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">County</label>
            <input
              type="text"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
              placeholder="County"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub County</label>
            <input
              type="text"
              name="sub_county"
              value={formData.sub_county}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
              placeholder="Sub County"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Licence Number</label>
            <input
              type="text"
              name="licence_number"
              value={formData.licence_number}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
              placeholder="Licence Number"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-amber-300 rounded focus:ring-amber-600"
            />
            <label className="ml-2 block text-sm text-gray-900">Active</label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseEdit;