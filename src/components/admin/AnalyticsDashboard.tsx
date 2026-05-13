'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
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
  const salesData = orders
    .map((o) => ({
      date: new Date(o.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      amount: o.total,
    }))
    .reverse();

  // Prepare Category Data for Pie Chart
  const categoryCount: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      // Find category from products list
      const product = products.find((p) => p.name === item.name);
      const cat = product?.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + item.price * item.quantity;
    });
  });

  const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Net Revenue',
            value: formatPrice(totalRevenue),
            icon: DollarSign,
            trend: '+12.5%',
            color: 'accent',
          },
          { 
            label: 'Total Orders', 
            value: totalOrders, 
            icon: ShoppingBag, 
            trend: '+5.2%',
            color: 'blue-400' 
          },
          { 
            label: 'Customer Base', 
            value: totalUsers, 
            icon: Users, 
            trend: '+18%',
            color: 'emerald-400' 
          },
          {
            label: 'AOV',
            value: formatPrice(avgOrderValue),
            icon: TrendingUp,
            trend: '-2.1%',
            color: 'purple-400',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all duration-500"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color === 'accent' ? 'accent' : stat.color.split('-')[0]}-500/5 blur-[40px] -mr-8 -mt-8 group-hover:bg-accent/10 transition-colors`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-${stat.color === 'accent' ? 'accent' : stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'}`}>
                {stat.trend}
              </span>
            </div>
            
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{stat.label}</p>
            <p className="text-3xl font-serif font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart */}
        <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Revenue Trajectory</h3>
              <p className="text-xs text-zinc-500 mt-1">Growth analysis over the last 30 days</p>
            </div>
            <div className="flex gap-2">
               <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Live Feed</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A843" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  cursor={{ stroke: '#D4A843', strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #27272a',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#D4A843', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#D4A843"
                  fillOpacity={1}
                  fill="url(#colorAmt)"
                  strokeWidth={3}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Pie Chart */}
        <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
           <div className="mb-10">
              <h3 className="text-xl font-serif font-bold text-white">Portfolio Distribution</h3>
              <p className="text-xs text-zinc-500 mt-1">Revenue contribution by product category</p>
            </div>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer shadow-2xl"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid #27272a',
                    borderRadius: '16px',
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '30px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total</p>
               <p className="text-xl font-serif font-bold text-white">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* External Links Section */}
      <div className="bg-gradient-to-r from-zinc-900/40 to-zinc-800/20 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 flex-shrink-0">
             <ExternalLink className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Advanced Intelligence</h3>
            <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
              Unlock deep behavioral insights, conversion funnels, and real-time audience tracking by synchronizing with Google's advanced data engine.
            </p>
          </div>
        </div>
        <button
          onClick={() => window.open('https://analytics.google.com/', '_blank')}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-accent hover:text-primary transition-all duration-500 shadow-2xl shadow-white/5"
        >
          Cloud Console <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  );
}
