import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, AlertCircle, CheckCircle, FileText, TrendingUp, Clock, Zap } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    reports: 0
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/pipelines');
      const pipelines = res.data;
      const total = pipelines.length;
      const success = pipelines.filter(p => p.status === 'SUCCESS').length;
      const failed = pipelines.filter(p => p.status === 'FAILED').length;
      setStats({ total, success, failed, reports: failed });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Success', value: stats.success, color: '#10B981' },
    { name: 'Failed', value: stats.failed, color: '#EF4444' },
    { name: 'Active', value: stats.total - stats.success - stats.failed, color: '#3B82F6' },
  ];

  const barData = [
    { name: 'Total', value: stats.total, color: '#3B82F6' },
    { name: 'Success', value: stats.success, color: '#10B981' },
    { name: 'Failed', value: stats.failed, color: '#EF4444' },
  ];

  const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
              <p className="text-gray-400 text-lg">Monitor your pipeline performance and analytics</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 text-sm">Last updated: Just now</span>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Activity className="w-6 h-6" />} 
            title="Total Pipelines" 
            value={stats.total} 
            color="text-blue-400" 
            bg="bg-blue-500/10"
            borderColor="border-blue-500/30"
            trend="+12%"
          />
          <StatCard 
            icon={<CheckCircle className="w-6 h-6" />} 
            title="Successful" 
            value={stats.success} 
            color="text-green-400" 
            bg="bg-green-500/10"
            borderColor="border-green-500/30"
            trend="+8%"
          />
          <StatCard 
            icon={<AlertCircle className="w-6 h-6" />} 
            title="Failed" 
            value={stats.failed} 
            color="text-red-400" 
            bg="bg-red-500/10"
            borderColor="border-red-500/30"
            trend="-5%"
          />
          <StatCard 
            icon={<FileText className="w-6 h-6" />} 
            title="Reports Generated" 
            value={stats.reports} 
            color="text-purple-400" 
            bg="bg-purple-500/10"
            borderColor="border-purple-500/30"
            trend="+15%"
          />
        </div>

        {/* Success Rate Card */}
        <div className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-white">{successRate}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Performance</p>
              <p className="text-lg font-semibold text-green-400">Excellent</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Pipeline Status Distribution</h2>
              <div className="p-2 bg-gray-800 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '12px', 
                      color: '#fff',
                      padding: '12px'
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Pipeline Overview</h2>
              <div className="p-2 bg-gray-800 rounded-lg">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '12px', 
                      color: '#fff',
                      padding: '12px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={0}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, bg, borderColor, trend }) => (
  <div className={`bg-gray-900/80 backdrop-blur-sm border ${borderColor} rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 cursor-default group`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default Dashboard;
