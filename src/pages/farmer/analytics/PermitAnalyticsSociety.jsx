import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../../utils/AxiosInstance';
import PermitAnalyticsCharts from '../../admin/analytics/PermitAnalyticsCharts';
import dayjs from 'dayjs';
import { getPeriodArray, formatPeriodLabel } from '../../../utils/periodUtils';
import DownloadReportModal from '../../../components/exports/DownloadReportModal';

const PermitAnalyticsFarmer = ({ societyId }) => {
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState('');
  const [lineData, setLineData] = useState([]);
  const [topGrades, setTopGrades] = useState([]);
  const [topFactories, setTopFactories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Set default date range: last 7 days, ending today
  const today = dayjs().format('YYYY-MM-DD');
  const sevenDaysAgo = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
  const [dateRange, setDateRange] = useState({ start: sevenDaysAgo, end: today, granularity: 'daily' });

  // Fetch factories for this society
  useEffect(() => {
    if (!societyId) return;
    axiosInstance.get('societies/factories/', { params: { society: societyId } })
      .then(res => setFactories(res.data))
      .catch(() => setFactories([]));
  }, [societyId]);

  // Fetch main coffee movement data
  useEffect(() => {
    if (!societyId) return;
    setLoading(true);
    const params = {
      society: societyId,
      factory: selectedFactory || undefined,
      start_date: dateRange.start,
      end_date: dateRange.end,
      granularity: dateRange.granularity,
    };
    Object.keys(params).forEach(key => { if (!params[key]) delete params[key]; });
    axiosInstance.get('permits/permits/coffee-analytics/', { params })
      .then(res => {
        // Handle paginated response
        const data = res.data.results ? res.data.results : res.data;
        setLineData(data);
      })
      .finally(() => setLoading(false));
  }, [societyId, selectedFactory, dateRange]);

  // Fetch top grades and top factories
  useEffect(() => {
    if (!societyId) return;
    const params = {
      society: societyId,
      factory: selectedFactory || undefined,
      start_date: dateRange.start,
      end_date: dateRange.end,
    };
    Object.keys(params).forEach(key => { if (!params[key]) delete params[key]; });

    axiosInstance.get('permits/permits/top-grades/', { params })
      .then(res => {
        // Handle paginated response
        const data = res.data.results ? res.data.results : res.data;
        setTopGrades(data.slice(0, 3));
      })
      .catch(() => setTopGrades([]));

    axiosInstance.get('permits/permits/top-factories/', { params })
      .then(res => {
        // Handle paginated response
        const data = res.data.results ? res.data.results : res.data;
        setTopFactories(data.slice(0, 3));
      })
      .catch(() => setTopFactories([]));
  }, [societyId, selectedFactory, dateRange]);

  // ... (UI code for filters, charts, etc. similar to admin, but with societyId fixed)

  return (
    <div className="space-y-6 bg-amber-50 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">Society Coffee Analytics</h1>
      {/* Factory Filter */}
      <div>
        <label>Factory</label>
        <select value={selectedFactory} onChange={e => setSelectedFactory(e.target.value)}>
          <option value="">All Factories</option>
          {factories.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>
      {/* Date Range Filter */}
      <div>
        <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} />
        <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} />
      </div>
      {/* Download Report Button */}
      <button
        className="px-4 py-2 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700"
        onClick={() => setIsDownloadModalOpen(true)}
      >
        Download Report
      </button>
      <DownloadReportModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        dataSections={{
          main: lineData,
          topFactories: topFactories,
          topGrades: topGrades,
          start_date: dateRange.start,
          end_date: dateRange.end,
          granularity: dateRange.granularity,
          society_id: societyId,
        }}
        defaultFileName="Society-Analytics-Report"
      />
      {/* Main Chart */}
      <div>
        {/* Reuse your BarChart code here, using lineData */}
      </div>
      {/* Top Grades */}
      <div>
        <h3>Top 3 Coffee Grades</h3>
        {/* BarChart for topGrades */}
      </div>
      {/* Top Factories */}
      <div>
        <h3>Top 3 Factories</h3>
        {/* BarChart for topFactories */}
      </div>
      {/* Cumulative Approved/Rejected Permits */}
      <PermitAnalyticsCharts
        selectedSociety={societyId}
        selectedFactory={selectedFactory}
        dateRange={dateRange}
      />
      {/* Clear Filters button */}
      <button
        onClick={() => {
          setSelectedFactory('');
          setDateRange({ start: sevenDaysAgo, end: today, granularity: 'daily' });
          setExcludedGrades([]);
        }}
        className="px-4 py-2 rounded bg-amber-200 text-amber-800 font-semibold hover:bg-amber-300 cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default PermitAnalyticsFarmer;
