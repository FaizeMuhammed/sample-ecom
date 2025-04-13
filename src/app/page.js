'use client'
import { useState } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  Home as HomeIcon, 
  BarChart2 
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Ongoing');

  // Sample order data - matching exactly what's in the screenshot
  const orders = [
    {
      id: 10,
      status: 'Processing',
      date: '15 july 2023, 12:00 PM',
      distance: '5.5 Km',
      time: '35 min',
      pickup: 'Bizz The Hotel',
      delivery: 'John Doe'
    },
    {
      id: 8,
      status: 'Processing',
      date: '14 july 2023, 08:15 AM',
      distance: '4 Km',
      time: '30 min',
      pickup: 'Tasty Treats',
      delivery: 'Dom Smith'
    },
    {
      id: 4,
      status: 'Processing',
      date: '13 july 2023, 04:45 PM',
      distance: '4.5 Km',
      time: '25 min',
      pickup: 'Golden Restaurant',
      delivery: 'Sarah Johnson'
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
        <Menu size={24} />
        <h1 className="text-xl font-semibold">Home</h1>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-blue-500 shadow-md"></div>
      </header>

      {/* Tab Navigation */}
      <div className="flex justify-between px-4 py-3 bg-white">
        <button 
          className={`text-sm font-medium ${activeTab === 'New Order' ? 'text-black' : 'text-gray-600'}`}
          onClick={() => setActiveTab('New Order')}
        >
          New Order
        </button>
        <button 
          className={`text-sm px-4 py-1 rounded-full ${
            activeTab === 'Ongoing' ? 'border border-orange-400 text-orange-500 font-medium' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('Ongoing')}
        >
          Ongoing
        </button>
        <button 
          className={`text-sm font-medium ${activeTab === 'Completed' ? 'text-black' : 'text-gray-600'}`}
          onClick={() => setActiveTab('Completed')}
        >
          Completed
        </button>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md">
            {/* Order Header */}
            <div className="flex justify-between items-center px-4 pt-4 pb-2">
              <div className="text-orange-500 font-medium">Pick Food</div>
              <div className="text-orange-500 font-medium">{order.status}</div>
            </div>
            
            {/* Order ID and Date */}
            <div className="flex justify-between items-center px-4 pb-2">
              <div className="font-bold text-sm text-black">OrderID: {order.id}</div>
              <div className="text-gray-700 text-xs">{order.date}</div>
            </div>
            
            {/* Distance and Time */}
            <div className="flex justify-between items-center px-4 pb-3">
              <div>
                <div className="text-gray-700 text-xs font-medium">Distance</div>
                <div className="text-sm font-bold text-black">{order.distance}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-700 text-xs font-medium">Time</div>
                <div className="text-sm font-bold text-black">{order.time}</div>
              </div>
            </div>
            
            {/* Pickup and Delivery */}
            <div className="flex items-center px-4 pb-4">
              <div className="bg-gray-100 p-2 rounded-lg flex-1 h-16 flex flex-col justify-center">
                <div className="font-bold text-sm text-black">{order.pickup}</div>
                <div className="text-gray-700 text-xs font-medium">Pickup Point</div>
              </div>
              
              <div className="mx-2 relative flex items-center justify-center w-10">
                <div className="h-px w-10 bg-gray-500 absolute"></div>
                <div className="bg-blue-100 rounded-full p-1 z-10">
                  <div className="text-xs">🛵</div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-2 rounded-lg flex-1 h-16 flex flex-col justify-center">
                <div className="font-bold text-sm text-black">{order.delivery}</div>
                <div className="text-gray-700 text-xs font-medium">Delivery Point</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white flex justify-around py-3 border-t">
        <button className="flex flex-col items-center text-orange-500">
          <div className="w-6 h-6 flex items-center justify-center">
            <HomeIcon size={20} />
          </div>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <div className="w-6 h-6 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <span className="text-xs mt-1">Earnings</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <div className="w-6 h-6 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <span className="text-xs mt-1">Notification</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <div className="w-6 h-6 flex items-center justify-center">
            <User size={20} />
          </div>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}//+-