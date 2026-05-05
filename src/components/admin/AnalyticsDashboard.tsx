'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface AnalyticsProps {
  orders: any[];
  users: any[];
  products: any[];
}

const COLORS = ['#D4A843', '#8B5E1A', '#C8881E', '#F5D47A', '#000000'];

export default function AnalyticsDashboard({ orders, users, products }: AnalyticsProps) {
  
  // Calculate Totals
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Prepare Sales Data for Line Chart (Revenue over time)
  const salesData = orders.map(o => ({
    date: new Date(o.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    amount: o.total
  })).reverse();

  // Prepare Category Data for Pie Chart
  const categoryCount: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      // Find category from products list
      const product = products.find(p => p.name === item.name);
      const cat = product?.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + (item.price * item.quantity);
    });
  });

  const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-accent' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-400' },
          { label: 'Total Customers', value: totalUsers, icon: Users, color: 'text-green-400' },
          { label: 'Avg Order Value', value: formatPrice(avgOrderValue), icon: TrendingUp, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="text-lg font-serif font-bold text-white mb-6">Revenue Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4A843" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4A843' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#D4A843" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="text-lg font-serif font-bold text-white mb-6">Sales by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4A843' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Google Analytics Section */}
      <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-2">Live Traffic Analytics</h3>
          <p className="text-zinc-400 text-sm max-w-xl">
            For deep insights into user behavior, acquisition channels, and real-time active users, view your full dashboard in Google Analytics 4.
          </p>
        </div>
        <button 
          onClick={() => window.open('https://analytics.google.com/', '_blank')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/10"
        >
          Open GA Dashboard <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
