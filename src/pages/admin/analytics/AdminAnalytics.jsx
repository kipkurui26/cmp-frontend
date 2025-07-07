import React from 'react'
import CoffeeAnalysisCharts from './CoffeeAnalyticsCharts'

const Spinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
    <span className="ml-2 text-amber-700">Loading...</span>
  </div>
);

const AdminAnalytics = () => {
  return (
    <div>
      <CoffeeAnalysisCharts/>
    </div>
  )
}

export default AdminAnalytics