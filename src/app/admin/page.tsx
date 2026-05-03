'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Package, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Sarees',
    stock: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        alert("Please select an image!");
        setIsSubmitting(false);
        return;
      }

      const bodyData = new FormData();
      bodyData.append('name', formData.name);
      bodyData.append('description', formData.description);
      bodyData.append('price', formData.price);
      bodyData.append('category', formData.category);
      bodyData.append('stock', formData.stock);
      bodyData.append('image', file);

      const response = await fetch('/api/admin/add-product', {
        method: 'POST',
        body: bodyData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Reset form after success
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: '', description: '', price: '', category: 'Sarees', stock: '' });
          setPreviewUrl(null);
        }, 3000);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-zinc-400">Manage your product catalog and inventory seamlessly.</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-full border border-accent/20">
            <Package className="w-6 h-6 text-accent" />
          </div>
        </div>

        {/* Main Content Form */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Column: Product Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-accent rounded-full inline-block" />
                  Product Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="e.g. Royal Golden Saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="Describe the material, origin, and style..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      placeholder="2499"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all appearance-none"
                  >
                    <option>Sarees</option>
                    <option>Kurtis</option>
                    <option>Lehengas</option>
                    <option>Dresses</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>

              {/* Right Column: Image Upload */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-accent rounded-full inline-block" />
                  Product Image
                </h2>

                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    required={!previewUrl}
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
                    previewUrl ? 'border-accent/50 bg-accent/5' : 'border-white/20 bg-zinc-950 hover:border-accent/40 hover:bg-zinc-900'
                  } aspect-[4/5] w-full max-w-sm mx-auto relative`}>
                    
                    {previewUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Change Image
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 pointer-events-none">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-accent transition-colors" />
                        </div>
                        <p className="text-white font-medium mb-1">Click or drag image to upload</p>
                        <p className="text-sm text-zinc-500">High-res PNG, JPG or WEBP (max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                  <div className="min-w-max">
                    <Upload className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-sm text-blue-200/80 leading-relaxed">
                    This image will be automatically uploaded securely to your <strong className="text-blue-300">Google Drive</strong>. The link will be generated and saved to your <strong className="text-blue-300">Google Sheets</strong> inventory.
                  </p>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || success}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
                  success 
                    ? 'bg-green-500 shadow-green-500/20' 
                    : 'bg-accent text-primary shadow-accent/20 hover:shadow-accent/40'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Drive...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Product Added Successfully!
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Add Product to Catalog
                  </>
                )}
              </motion.button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
