import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={<TrendingUp size={24} className="text-blue-500" />} 
          bg="bg-blue-500/10" 
          border="border-blue-500/20"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={<Clock size={24} className="text-amber-500" />} 
          bg="bg-amber-500/10" 
          border="border-amber-500/20"
        />
        <StatCard 
          title="Completed" 
          value={stats.done} 
          icon={<CheckCircle2 size={24} className="text-emerald-500" />} 
          bg="bg-emerald-500/10" 
          border="border-emerald-500/20"
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={<AlertCircle size={24} className="text-red-500" />} 
          bg="bg-red-500/10" 
          border="border-red-500/20"
          highlight={stats.overdue > 0}
        />
      </div>

      {/* Recent Tasks List */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Your Recent Tasks</h2>
        </div>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-700 rounded-xl">
            <p>No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => {
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
              return (
                <div key={task._id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'Done' ? 'bg-emerald-500' :
                      task.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-500'
                    }`}></div>
                    <div>
                      <h4 className={`font-medium ${isOverdue ? 'text-red-400' : 'text-slate-200'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        {task.projectId?.name || 'Unknown Project'}
                        {task.dueDate && (
                          <>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span className={isOverdue ? 'text-red-500/80' : ''}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, border, highlight }) => (
  <div className={`p-6 rounded-2xl bg-slate-800/50 backdrop-blur-xl border ${border} relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-lg`}>
    {highlight && <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>}
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className={`text-3xl font-bold tracking-tight ${highlight ? 'text-red-400' : 'text-white'}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
