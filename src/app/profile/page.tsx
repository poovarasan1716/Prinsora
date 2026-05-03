'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

const mockOrders = [
{
  id: 'PNS20240312',
  date: '12 Mar 2024',
  status: 'Delivered',
  statusColor: 'green',
  total: 4398,
  items: [
  { name: 'Ananya Silk Kurta Set', size: 'M', qty: 1, price: 2499, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80' },
  { name: 'Zara Floral Maxi Dress', size: 'S', qty: 1, price: 1899, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&q=80' }]

},
{
  id: 'PNS20240228',
  date: '28 Feb 2024',
  status: 'Shipped',
  statusColor: 'blue',
  total: 8999,
  items: [
  { name: 'Priya Embroidered Lehenga', size: 'L', qty: 1, price: 8999, image: "https://images.unsplash.com/photo-1654764746225-e63f5e90facd" }]

},
{
  id: 'PNS20240115',
  date: '15 Jan 2024',
  status: 'Delivered',
  statusColor: 'green',
  total: 4999,
  items: [
  { name: 'Meera Banarasi Saree', size: 'Free Size', qty: 1, price: 4999, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&q=80' }]

}];


const mockAddresses = [
{
  id: '1',
  type: 'Home',
  name: 'Priya Sharma',
  phone: '+91 98765 43210',
  address: '204, Sunshine Apartments, Linking Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400054',
  isDefault: true
},
{
  id: '2',
  type: 'Work',
  name: 'Priya Sharma',
  phone: '+91 98765 43210',
  address: 'Office No. 12, Tech Park, Whitefield',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560066',
  isDefault: false
}];


const statusColors: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700'
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const tabs: {key: Tab;label: string;icon: string;}[] = [
  { key: 'profile', label: 'My Profile', icon: 'UserCircleIcon' },
  { key: 'orders', label: 'My Orders', icon: 'ShoppingBagIcon' },
  { key: 'addresses', label: 'Addresses', icon: 'MapPinIcon' },
  { key: 'settings', label: 'Settings', icon: 'Cog6ToothIcon' }];


  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium">My Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-2xl font-bold font-display">
                  P
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="PencilIcon" size={12} className="text-accent-foreground" />
                </button>
              </div>
              <h2 className="font-display font-semibold text-lg text-primary">Priya Sharma</h2>
              <p className="text-sm text-muted-foreground">priya@example.com</p>
              <div className="mt-4 flex items-center justify-center gap-4 text-center">
                <div>
                  <p className="font-bold text-primary text-lg">{mockOrders.length}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="font-bold text-primary text-lg">3</p>
                  <p className="text-xs text-muted-foreground">Wishlist</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-card rounded-2xl border border-border overflow-hidden">
              {tabs.map((tab) =>
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-b border-border last:border-0 ${
                activeTab === tab.key ?
                'bg-primary/5 text-primary border-l-2 border-l-primary' : 'text-foreground hover:bg-secondary'}`
                }>
                
                  <Icon name={tab.icon as any} size={18} />
                  {tab.label}
                </button>
              )}
              <button className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <Icon name="ArrowRightOnRectangleIcon" size={18} />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' &&
            <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in-up">
                <h2 className="font-display text-xl font-semibold text-primary mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                { label: 'First Name', value: 'Priya', placeholder: 'First Name' },
                { label: 'Last Name', value: 'Sharma', placeholder: 'Last Name' },
                { label: 'Email Address', value: 'priya@example.com', placeholder: 'Email' },
                { label: 'Phone Number', value: '+91 98765 43210', placeholder: 'Phone' },
                { label: 'Date of Birth', value: '15 Aug 1995', placeholder: 'DOB' },
                { label: 'Gender', value: 'Female', placeholder: 'Gender' }].
                map((field) =>
                <div key={field.label}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                      <input
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  
                    </div>
                )}
                </div>
                <button className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
                  Save Changes
                </button>
              </div>
            }

            {/* Orders Tab */}
            {activeTab === 'orders' &&
            <div className="space-y-4 animate-fade-in-up">
                <h2 className="font-display text-xl font-semibold text-primary mb-2">Order History</h2>
                {mockOrders.map((order) =>
              <div key={order.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-border">
                      <div>
                        <p className="font-semibold text-sm">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Placed on {order.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.statusColor]}`}>
                          {order.status}
                        </span>
                        <span className="font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {order.items.map((item, idx) =>
                  <div key={idx} className="flex items-center gap-4">
                          <div className="relative w-14 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                            <AppImage src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Size: {item.size} · Qty: {item.qty}</p>
                          </div>
                          <span className="text-sm font-semibold">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                  )}
                    </div>
                    <div className="px-5 pb-5 flex gap-3">
                      <button className="flex-1 py-2.5 border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors">
                        View Details
                      </button>
                      {order.status === 'Delivered' &&
                  <button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                          Reorder
                        </button>
                  }
                    </div>
                  </div>
              )}
              </div>
            }

            {/* Addresses Tab */}
            {activeTab === 'addresses' &&
            <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-primary">Saved Addresses</h2>
                  <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-all">
                  
                    <Icon name="PlusIcon" size={16} />
                    Add New
                  </button>
                </div>

                {showAddAddress &&
              <div className="bg-card rounded-2xl border border-accent/30 p-6 mb-4 animate-fade-in-up">
                    <h3 className="font-semibold mb-4">New Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Full Name', 'Phone Number', 'Street Address', 'City', 'State', 'Pincode'].map((f) =>
                  <div key={f} className={f === 'Street Address' ? 'sm:col-span-2' : ''}>
                          <label className="block text-sm font-medium mb-1.5">{f}</label>
                          <input
                      placeholder={f}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    
                        </div>
                  )}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                        Save Address
                      </button>
                      <button
                    onClick={() => setShowAddAddress(false)}
                    className="px-6 py-2.5 border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors">
                    
                        Cancel
                      </button>
                    </div>
                  </div>
              }

                <div className="space-y-4">
                  {addresses.map((addr) =>
                <div key={addr.id} className={`bg-card rounded-2xl border p-5 ${addr.isDefault ? 'border-accent' : 'border-border'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${addr.type === 'Home' ? 'bg-accent/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                            {addr.type}
                          </span>
                          {addr.isDefault &&
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Default</span>
                      }
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                            <Icon name="PencilIcon" size={15} />
                          </button>
                          <button
                        onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                        className="p-1.5 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                        
                            <Icon name="TrashIcon" size={15} />
                          </button>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">{addr.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-muted-foreground">{addr.phone}</p>
                      {!addr.isDefault &&
                  <button
                    onClick={() => setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === addr.id })))}
                    className="mt-3 text-xs text-accent font-medium hover:underline">
                    
                          Set as Default
                        </button>
                  }
                    </div>
                )}
                </div>
              </div>
            }

            {/* Settings Tab */}
            {activeTab === 'settings' &&
            <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in-up">
                <h2 className="font-display text-xl font-semibold text-primary mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm mb-4">Notifications</h3>
                    {[
                  { label: 'Order updates via Email', desc: 'Get notified about your order status' },
                  { label: 'Order updates via SMS', desc: 'Receive SMS for order tracking' },
                  { label: 'Promotional offers', desc: 'Exclusive deals and new arrivals' },
                  { label: 'Wishlist reminders', desc: 'Price drops on your saved items' }].
                  map((item, idx) =>
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <button className="w-11 h-6 bg-accent rounded-full relative transition-colors">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                  )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-4">Security</h3>
                    <button className="w-full text-left flex items-center justify-between py-3 border-b border-border hover:text-primary transition-colors">
                      <span className="text-sm">Change Password</span>
                      <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="w-full text-left flex items-center justify-between py-3 text-red-500 hover:text-red-600 transition-colors">
                      <span className="text-sm">Delete Account</span>
                      <Icon name="ChevronRightIcon" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <Footer />
    </main>);

}