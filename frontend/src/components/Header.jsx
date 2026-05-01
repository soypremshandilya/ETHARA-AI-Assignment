import React, { useContext, useState, useEffect, useRef } from 'react';
import { LogOut, Bell, Search, Check, CheckCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Header = () => {
  const { logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-slate-800 animate-in zoom-in duration-300">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/30">
                <h3 className="font-semibold text-slate-200">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {notifications.map(notification => (
                      <div 
                        key={notification._id} 
                        className={`p-4 flex gap-3 hover:bg-slate-700/30 transition-colors ${!notification.isRead ? 'bg-blue-500/5' : ''}`}
                      >
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.isRead ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button 
                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                            className="text-blue-500 hover:text-blue-400 p-1 h-fit bg-blue-500/10 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
