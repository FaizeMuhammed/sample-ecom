'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Users, 
  ListOrdered,
  Menu
} from 'lucide-react';

const NavBar = ({ theme, activePage = 'order-form' }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Navigation functions
  const navigateToOrders = () => {
    router.push('/orders');
  };
  
  const navigateToCreateCustomer = () => {
    router.push('/create-customer');
  };
  
  const navigateToOrderForm = () => {
    router.push('/order-form');
  };
  
  return (
    <nav className={`${theme.secondary} text-white shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-md mr-2">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg"> Shop</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={navigateToOrderForm}
              className={`py-2 px-4 rounded-md flex items-center ${
                activePage === 'order-form' 
                  ? 'text-lime-500 bg-white font-medium' 
                  : 'text-white hover:bg-gray-700 transition-colors duration-200'
              }`}
            >
              <ShoppingBag size={18} className="mr-1.5" />
              Order Form
            </button>
            <button
              onClick={navigateToOrders}
              className={`py-2 px-4 rounded-md flex items-center ${
                activePage === 'orders' 
                  ? 'text-lime-500 bg-white font-medium' 
                  : 'text-white hover:bg-gray-700 transition-colors duration-200'
              }`}
            >
              <ListOrdered size={18} className="mr-1.5" />
              Orders
            </button>
            <button
              onClick={navigateToCreateCustomer}
              className={`py-2 px-4 rounded-md flex items-center ${
                activePage === 'create-customer' 
                  ? 'text-lime-500 bg-white font-medium' 
                  : 'text-white hover:bg-gray-700 transition-colors duration-200'
              }`}
            >
              <Users size={18} className="mr-1.5" />
              Create Customer
            </button>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 space-y-2">
            <button
              onClick={navigateToOrderForm}
              className={`w-full py-2 px-4 rounded-md flex items-center ${
                activePage === 'order-form' 
                  ? 'text-lime-500 bg-white font-medium' 
                  : 'text-white hover:bg-gray-700 transition-colors duration-200'
              }`}
            >
              <ShoppingBag size={18} className="mr-1.5" />
              Order Form
            </button>
            <button
              onClick={navigateToOrders}
              className={`w-full py-2 px-4 rounded-md flex items-center ${
                activePage === 'orders' 
                  ? 'text-lime-500 bg-white font-medium' 
                  : 'text-white hover:bg-gray-700 transition-colors duration-200'
              }`}
            >
              <ListOrdered size={18} className="mr-1.5" />
              Orders
            </button>
            <button
              onClick={navigateToCreateCustomer}
              className={`w-full py-2 px-4 rounded-md flex items-center ${
                activePage === 'create-customer' 
                  ? 'text-lime-500 bg-white font-medium' 
                  : 'text-white hover:bg-gray-700 transition-colors duration-200'
              }`}
            >
              <Users size={18} className="mr-1.5" />
              Create Customer
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;