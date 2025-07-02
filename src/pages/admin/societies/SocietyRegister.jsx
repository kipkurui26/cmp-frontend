import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../utils/AxiosInstance";
import { useToast } from "../../../context/ToastContext";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const initialForm = {
  email: "",
  phone_no: "",
  first_name: "",
  last_name: "",
  society_name: "",
  county: "",
  sub_county: "",
};

const steps = ["Primary Details", "Society Details", "Review & Submit"];

const SocietyRegister = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await AxiosInstance.post("/societies/admin/societies/register/", form);
      showToast("Society and manager registered! Credentials sent to email.", "success");
      setForm(initialForm);
      setStep(0);
    } catch (err) {
      showToast(err.response?.data?.error || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8 space-y-6">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-amber-700 hover:text-amber-900 flex items-center"
        >
          <ArrowLeftIcon className="h-6 w-6 mr-1" />
          Back
        </button>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex space-x-2">
        {steps.map((label, idx) => (
          <div
            key={label}
            className={`flex-1 text-center py-2 rounded ${
              step === idx ? "bg-amber-200 font-bold" : "bg-gray-100"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      {step === 0 && (
        <div className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Manager Email"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <input
            name="phone_no"
            type="text"
            value={form.phone_no}
            onChange={handleChange}
            placeholder="Manager Phone"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <button
            className="mt-4 bg-amber-700 text-white px-4 py-2 rounded"
            onClick={nextStep}
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Manager First Name"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Manager Last Name"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <input
            name="society_name"
            value={form.society_name}
            onChange={handleChange}
            placeholder="Society Name"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <input
            name="county"
            value={form.county}
            onChange={handleChange}
            placeholder="County"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <input
            name="sub_county"
            value={form.sub_county}
            onChange={handleChange}
            placeholder="Sub-County"
            className="w-full border border-amber-300 rounded px-3 py-2 focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
            required
          />
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              className="bg-amber-700 text-white px-4 py-2 rounded"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Review Details</h2>
          <ul className="mb-4">
            {Object.entries(form).map(([k, v]) => (
              <li key={k}>
                <span className="font-medium capitalize">
                  {k.replace("_", " ")}:
                </span>{" "}
                {v}
              </li>
            ))}
          </ul>
          <div className="text-sm text-gray-600 mb-4">
            <strong>Password:</strong> Will be auto-generated and sent to the manager's email.
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              className="bg-amber-700 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Registering..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyRegister;
