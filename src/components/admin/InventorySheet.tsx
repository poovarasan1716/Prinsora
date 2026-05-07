'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
  Package,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { formatPrice } from '@/data/products';
import AppImage from '@/components/ui/AppImage';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: any;
  rating: number;
  reviews: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface InventorySheetProps {
  products: any[];
  onDelete?: (id: string) => void;
}

export default function InventorySheet({ products, onDelete }: InventorySheetProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
  );

  const getStatus = (stock: number) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Low Stock':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Out of Stock':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-accent' },
          {
            label: 'Total Stock Value',
            value: formatPrice(products.reduce((acc, p) => acc + p.price * (p.stock || 0), 0)),
            icon: TrendingUp,
            color: 'text-green-400',
          },
          {
            label: 'Low Stock Alerts',
            value: products.filter((p) => (p.stock || 0) < 10).length,
            icon: AlertCircle,
            color: 'text-red-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">
                  {stat.label}
                </p>
                <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, category or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:shadow-lg hover:shadow-accent/20 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Stock
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Rating
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 relative">
                        <AppImage
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-300 px-2 py-1 rounded bg-zinc-800 border border-white/5">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">{formatPrice(product.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-zinc-300">{product.stock || 0} units</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded-full border ${getStatusColor(getStatus(product.stock))}`}
                    >
                      {getStatus(product.stock)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-white">
                        {product.rating?.toFixed(1) || '4.5'}
                      </span>
                      <span className="text-[10px] text-zinc-500">({product.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(product.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 font-serif italic text-lg">
              No matching products in inventory
            </p>
          </div>
        )}

        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold disabled:opacity-50"
              disabled
            >
              PREV
            </button>
            <button className="px-3 py-1 rounded bg-zinc-800 text-accent text-[10px] font-bold">
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
