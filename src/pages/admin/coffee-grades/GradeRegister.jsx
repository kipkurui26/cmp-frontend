import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import AxiosInstance from '../../../utils/AxiosInstance';
import { useToast } from "../../../context/ToastContext";

const GradeRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    grade: '',
    weight_per_bag: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await AxiosInstance.post('/permits/coffee-grades/', formData);
      showToast("Grade created successfully!", "success");
      setTimeout(() => {
        navigate('/admin/coffee-grades');
      }, 1200);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create grade. Please try again later.', "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/coffee-grades')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Register New Grade</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grade
          </label>
          <input
            type="text"
            name="grade"
            id="grade"
            value={formData.grade}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            placeholder="Grade"
            required
          />
        </div>

        <div>
          <label htmlFor="weight_per_bag" className="block text-sm font-medium text-gray-700">
            Weight per Bag (kg)
          </label>
          <input
            type="number"
            step="0.01"
            name="weight_per_bag"
            id="weight_per_bag"
            value={formData.weight_per_bag}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            placeholder="Weight per Bag (kg)"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full min-h-24 rounded-md border border-amber-300 px-3 py-2 placeholder-gray-800 text-black focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm resize-none"
            placeholder="Description"
            rows={3}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Grade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GradeRegister;