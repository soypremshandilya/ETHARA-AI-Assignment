import React, { useContext } from 'react';
import { LogOut, Bell, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="h-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center bg-slate-900 rounded-full px-4 py-2 border border-slate-700 w-96 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all">
        <Search size={18} className="text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search projects, tasks..." 
          className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder-slate-500"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors bg-slate-800 hover:bg-red-500/10 px-4 py-2 rounded-full border border-slate-700 hover:border-red-500/30"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
