import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  Users, 
  Activity, 
  UserCircle, 
  LogOut, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  Settings,
  Bell,
  Menu,
  ChevronRight,
  Lock,
  RefreshCw,
  Fingerprint
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MOCK_USERS, MOCK_LOCKERS, MOCK_LOGS, ADMIN_PROFILE } from './constants';
import { Locker, UserStatus, LockerStatus, LogType, User, ActivityLog } from './types';

// --- API SERVICE (BACKEND PREPARATION) ---
// Replace the contents of these functions with real fetch/axios calls to your backend.
const ApiService = {
  getDashboardStats: async () => {
    // Example real call: const response = await fetch('/api/stats'); return response.json();
    return new Promise<{users: number, occupied: number, available: number, maintenance: number}>(resolve => {
      setTimeout(() => {
        const occupied = MOCK_LOCKERS.filter(l => l.status === LockerStatus.OCCUPIED).length;
        const available = MOCK_LOCKERS.filter(l => l.status === LockerStatus.AVAILABLE).length;
        resolve({
          users: MOCK_USERS.length,
          occupied,
          available,
          maintenance: MOCK_LOCKERS.length - occupied - available
        });
      }, 800);
    });
  },

  getLockers: async () => {
    return new Promise<Locker[]>(resolve => {
      setTimeout(() => resolve([...MOCK_LOCKERS]), 600);
    });
  },

  getUsers: async () => {
    return new Promise<User[]>(resolve => {
      setTimeout(() => resolve([...MOCK_USERS]), 700);
    });
  },

  getActivityLogs: async () => {
    return new Promise<ActivityLog[]>(resolve => {
      setTimeout(() => resolve([...MOCK_LOGS]), 500);
    });
  },
  
  // Example mutation
  forceOpenLocker: async (lockerId: string) => {
    console.log(`Sending command to open locker ${lockerId}...`);
    return new Promise<boolean>(resolve => setTimeout(() => resolve(true), 1000));
  }
};

// --- COMPONENTS ---

// Loading Skeleton Component
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
);

// 1. Dashboard View
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{users: number, occupied: number, available: number, maintenance: number} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Mock chart data - in real app, fetch this from API too
  const chartData = [
    { name: '08:00', usage: 12 },
    { name: '10:00', usage: 35 },
    { name: '12:00', usage: 80 },
    { name: '14:00', usage: 65 },
    { name: '16:00', usage: 45 },
    { name: '18:00', usage: 20 },
  ];

  const pieData = stats ? [
    { name: 'Occupied', value: stats.occupied },
    { name: 'Available', value: stats.available },
    { name: 'Maintenance', value: stats.maintenance },
  ] : [];
  
  const COLORS = ['#6366f1', '#10b981', '#cbd5e1'];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2" /><Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Total Pengguna", value: stats?.users, icon: Users, color: "bg-indigo-50 text-indigo-600", delay: "delay-0" },
          { title: "Loker Terisi", value: stats?.occupied, icon: Box, color: "bg-orange-50 text-orange-600", delay: "delay-100" },
          { title: "Loker Kosong", value: stats?.available, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", delay: "delay-200" }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow duration-300 animate-fade-in-up ${stat.delay}`}>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 animate-fade-in-up delay-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Tren Penggunaan</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 outline-none">
              <option>Hari Ini</option>
              <option>Minggu Ini</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center animate-fade-in-up delay-200">
           <h3 className="text-lg font-bold text-slate-800 mb-2 w-full text-left">Status Utilitas</h3>
           <div className="w-full h-48 relative">
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                 <span className="text-3xl font-bold text-slate-800">{stats ? Math.round((stats.occupied / (stats.occupied + stats.available + stats.maintenance)) * 100) : 0}%</span>
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Terpakai</p>
              </div>
           </div>
           <div className="w-full space-y-3 mt-4">
              <div className="flex justify-between text-sm p-2 bg-slate-50 rounded-lg">
                 <span className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>Terisi</span>
                 <span className="font-bold text-slate-800">{stats?.occupied}</span>
              </div>
              <div className="flex justify-between text-sm p-2 bg-slate-50 rounded-lg">
                 <span className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Kosong</span>
                 <span className="font-bold text-slate-800">{stats?.available}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Recent Logs Preview (Static for dashboard, could also be fetched) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up delay-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <h3 className="text-lg font-bold text-slate-800">Log Aktivitas Terakhir</h3>
           <span className="text-xs text-slate-400">Real-time update</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Aktivitas</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Loker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_LOGS.slice(0, 3).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{log.timestamp.split(' ')[1]}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      log.type === LogType.STORE ? 'bg-blue-50 text-blue-700' :
                      log.type === LogType.RETRIEVE ? 'bg-green-50 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.type === LogType.STORE ? 'Menyimpan' : log.type === LogType.RETRIEVE ? 'Mengambil' : log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{log.userName}</td>
                  <td className="px-6 py-4 font-mono">#{log.lockerNumber || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. Lockers View
const LockersView: React.FC = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  useEffect(() => {
    const fetchLockers = async () => {
        setLoading(true);
        const data = await ApiService.getLockers();
        setLockers(data);
        setLoading(false);
    };
    fetchLockers();
  }, []);

  const getStatusColor = (status: LockerStatus) => {
    switch (status) {
      case LockerStatus.OCCUPIED: return 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100';
      case LockerStatus.AVAILABLE: return 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-emerald-100';
      case LockerStatus.MAINTENANCE: return 'bg-slate-100 border-slate-200 text-slate-400';
      default: return 'bg-white border-slate-200';
    }
  };

  const handleForceOpen = async () => {
    if(!selectedLocker) return;
    await ApiService.forceOpenLocker(selectedLocker.id);
    alert(`Command sent: Force open Locker #${selectedLocker.number}`);
    setSelectedLocker(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Loker</h2>
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
           <span className="flex items-center text-xs font-medium text-slate-600 gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Available</span>
           <span className="flex items-center text-xs font-medium text-slate-600 gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Occupied</span>
           <span className="flex items-center text-xs font-medium text-slate-600 gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> Maint.</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {Array.from({length: 12}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {lockers.map((locker, index) => (
            <button
              key={locker.id}
              onClick={() => setSelectedLocker(locker)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-fade-in-up ${getStatusColor(locker.status)}`}
            >
              <span className="text-3xl font-black opacity-90">{locker.number}</span>
              <span className="text-[10px] font-bold uppercase mt-2 tracking-wider">{locker.status}</span>
              {locker.status === LockerStatus.OCCUPIED && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Locker Detail Modal */}
      {selectedLocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Loker #{selectedLocker.number}</h3>
              <button onClick={() => setSelectedLocker(null)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 hover:bg-rose-50 rounded-full">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 text-sm font-medium">Status Saat Ini</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                   selectedLocker.status === LockerStatus.OCCUPIED ? 'bg-rose-100 text-rose-700' : 
                   selectedLocker.status === LockerStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {selectedLocker.status}
                </span>
              </div>
              
              {selectedLocker.currentUserId ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                        {MOCK_USERS.find(u => u.id === selectedLocker.currentUserId)?.name.charAt(0)}
                     </div>
                     <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pengguna</p>
                        <p className="font-bold text-slate-800 text-lg leading-tight">{MOCK_USERS.find(u => u.id === selectedLocker.currentUserId)?.name}</p>
                        <p className="text-sm text-slate-500">{MOCK_USERS.find(u => u.id === selectedLocker.currentUserId)?.nim}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Clock size={16} className="text-indigo-500 mb-2" />
                        <span className="block text-xs text-slate-400 font-medium">Waktu Simpan</span>
                        <span className="font-bold text-slate-700">{selectedLocker.lastUpdated}</span>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Fingerprint size={16} className="text-indigo-500 mb-2" />
                        <span className="block text-xs text-slate-400 font-medium">RFID UID</span>
                        <span className="font-mono text-xs font-bold text-slate-700">{MOCK_USERS.find(u => u.id === selectedLocker.currentUserId)?.uid}</span>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Box size={48} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 font-medium">Loker ini sedang kosong.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => setSelectedLocker(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">Tutup</button>
               {selectedLocker.status === LockerStatus.OCCUPIED && (
                 <button onClick={handleForceOpen} className="px-5 py-2.5 text-sm font-medium bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 hover:shadow-xl transition-all flex items-center gap-2">
                    <Lock size={16} /> Force Open
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Users View
const UsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await ApiService.getUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.nim.includes(searchTerm) ||
    user.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Database Pengguna</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama, NIM, atau UID..." 
            className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">RFID UID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Loker Aktif</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-12 mx-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{user.nim}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs bg-slate-50/50 rounded-lg">{user.uid}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.status === UserStatus.ACTIVE ? 'bg-green-50 text-green-700' :
                        user.status === UserStatus.SUSPENDED ? 'bg-red-50 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === UserStatus.ACTIVE ? 'bg-green-500' :
                          user.status === UserStatus.SUSPENDED ? 'bg-red-500' : 'bg-slate-400'
                        }`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.currentLockerId ? (
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold text-xs border border-indigo-100">
                          #{MOCK_LOCKERS.find(l => l.id === user.currentLockerId)?.number}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all">
                        <Settings size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredUsers.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <UserCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada user ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Activity Logs View
const ActivityView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const data = await ApiService.getActivityLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800">Log Aktivitas</h2>
         <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setLoading(true) /* Trigger refresh logic */}>
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all active:scale-95">
                <Filter size={16} /> Filter
            </button>
         </div>
      </div>

      <div className="space-y-4">
         {loading ? (
             Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
         ) : (
             logs.map((log, index) => (
                <div 
                  key={log.id} 
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md hover:border-indigo-100 transition-all duration-300 animate-fade-in-up"
                >
                   <div className={`p-3.5 rounded-xl flex-shrink-0 shadow-sm ${
                      log.type === LogType.STORE ? 'bg-blue-50 text-blue-600' : 
                      log.type === LogType.RETRIEVE ? 'bg-green-50 text-green-600' :
                      log.type === LogType.ERROR ? 'bg-red-50 text-red-600' :
                      'bg-purple-50 text-purple-600'
                   }`}>
                      {log.type === LogType.STORE ? <Box size={20} strokeWidth={2.5} /> : 
                       log.type === LogType.RETRIEVE ? <CheckCircle size={20} strokeWidth={2.5} /> :
                       log.type === LogType.ERROR ? <XCircle size={20} strokeWidth={2.5} /> : <UserCircle size={20} strokeWidth={2.5} />}
                   </div>
                   
                   <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-slate-800 text-sm md:text-base">
                            {log.userName}
                         </span>
                         <span className="text-slate-400 text-xs bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-mono">{log.userId}</span>
                      </div>
                      <p className="text-sm text-slate-600">
                         {log.type === LogType.STORE && `Menyimpan barang di Loker #${log.lockerNumber}`}
                         {log.type === LogType.RETRIEVE && `Mengambil barang dari Loker #${log.lockerNumber}`}
                         {log.type === LogType.REGISTER && log.details}
                         {log.type === LogType.ERROR && log.details}
                      </p>
                   </div>
                   
                   <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap md:border-l md:pl-6 md:border-slate-100 h-full">
                      <Clock size={14} />
                      {log.timestamp}
                   </div>
                </div>
             ))
         )}
      </div>
    </div>
  );
};

// 5. Admin Profile View
const AdminProfileView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
       <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
          <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 animate-gradient-x"></div>
          <div className="px-8 pb-8">
             <div className="relative flex justify-between items-end -mt-16 mb-6">
                <div className="relative">
                   <img 
                      src={ADMIN_PROFILE.avatarUrl} 
                      alt="Admin" 
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                   />
                   <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
                   Edit Profil
                </button>
             </div>
             <div>
                <h1 className="text-3xl font-bold text-slate-900">{ADMIN_PROFILE.name}</h1>
                <p className="text-slate-500 font-medium mt-1">{ADMIN_PROFILE.email} • {ADMIN_PROFILE.role}</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5 hover:shadow-md transition-shadow">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Shield size={20} className="text-indigo-600" /> Informasi Akun
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-50">
                   <span className="text-slate-500 text-sm">Role Access</span>
                   <span className="font-bold text-indigo-600 text-xs bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">Super Admin</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                   <span className="text-slate-500 text-sm">Terakhir Login</span>
                   <span className="font-medium text-slate-800 text-sm">{ADMIN_PROFILE.lastLogin}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                   <span className="text-slate-500 text-sm">System Status</span>
                   <span className="text-green-600 font-bold text-xs bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      ONLINE
                   </span>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5 hover:shadow-md transition-shadow">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Settings size={20} className="text-slate-600" /> Pengaturan
             </h3>
             <div className="space-y-2">
                {[
                  "Manajemen Akses & Role",
                  "Notifikasi Sistem",
                  "Laporan / Support"
                ].map((item, idx) => (
                  <button key={idx} className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-slate-50 flex justify-between items-center group transition-all duration-200 border border-transparent hover:border-slate-100">
                     <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{item}</span>
                     <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
             </div>
          </div>
       </div>

       <button 
        onClick={onLogout}
        className="w-full py-4 text-rose-600 font-bold bg-white border border-rose-100 rounded-2xl hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
       >
          <LogOut size={20} /> Logout System
       </button>
    </div>
  );
};


// --- DASHBOARD LAYOUT ---

const DashboardLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock logout action
  const handleLogout = () => {
    if(confirm("Apakah anda yakin ingin keluar?")) {
      window.location.reload();
    }
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard />;
      case 'lockers': return <LockersView />;
      case 'users': return <UsersView />;
      case 'activity': return <ActivityView />;
      case 'profile': return <AdminProfileView onLogout={handleLogout} />;
      default: return <Dashboard />;
    }
  };

  const NavItem = ({ id, icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={() => {
        setCurrentView(id);
        if (onClick) onClick();
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="font-semibold text-sm tracking-wide">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-50 border-r border-slate-200 h-screen sticky top-0 z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Box className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">SmartLocker</span>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar py-4">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} />
          <NavItem id="lockers" icon={Box} label="Loker" active={currentView === 'lockers'} />
          <NavItem id="users" icon={Users} label="Pengguna" active={currentView === 'users'} />
          <NavItem id="activity" icon={Activity} label="Aktivitas" active={currentView === 'activity'} />
        </nav>

        <div className="p-6 border-t border-slate-200">
          <button 
             onClick={() => setCurrentView('profile')}
             className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 ${currentView === 'profile' ? 'bg-white shadow-md ring-1 ring-slate-100 scale-[1.02]' : 'hover:bg-white hover:shadow-sm hover:scale-[1.02]'}`}
          >
             <div className="relative">
                <img src={ADMIN_PROFILE.avatarUrl} alt="Admin" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
             </div>
             <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{ADMIN_PROFILE.name}</p>
                <p className="text-xs text-slate-500 truncate font-medium">View Profile</p>
             </div>
             <Settings size={18} className="text-slate-400" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
           <div className="flex items-center gap-2 text-indigo-600">
             <div className="p-1.5 bg-indigo-600 rounded-lg">
                <Box className="w-5 h-5 text-white" />
             </div>
            <span className="text-lg font-bold text-slate-900">SmartLocker</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
             <Menu size={24} />
          </button>
        </header>

        {/* Mobile Nav Drawer (Overlay) */}
        {isMobileMenuOpen && (
           <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 space-y-2 animate-slide-in-right duration-300" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-xl text-slate-800">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><XCircle className="text-slate-500" size={20} /></button>
                 </div>
                 <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setIsMobileMenuOpen(false)} />
                 <NavItem id="lockers" icon={Box} label="Loker" active={currentView === 'lockers'} onClick={() => setIsMobileMenuOpen(false)} />
                 <NavItem id="users" icon={Users} label="Pengguna" active={currentView === 'users'} onClick={() => setIsMobileMenuOpen(false)} />
                 <NavItem id="activity" icon={Activity} label="Aktivitas" active={currentView === 'activity'} onClick={() => setIsMobileMenuOpen(false)} />
                 <div className="border-t border-slate-100 my-4 pt-4">
                    <NavItem id="profile" icon={UserCircle} label="Profil Admin" active={currentView === 'profile'} onClick={() => setIsMobileMenuOpen(false)} />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-rose-500 font-semibold mt-2 hover:bg-rose-50">
                       <LogOut size={20} />
                       Logout
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar scroll-smooth bg-slate-50/50">
          <div className="max-w-6xl mx-auto pb-24 md:pb-0">
             {/* Header Section for Desktop */}
             <div className="hidden md:flex justify-between items-center mb-8 animate-fade-in">
                <div>
                   <h1 className="text-3xl font-bold text-slate-900 capitalize tracking-tight">
                      {currentView === 'users' ? 'Database Pengguna' : 
                       currentView === 'lockers' ? 'Status Loker' : 
                       currentView === 'activity' ? 'Log Aktivitas' :
                       currentView === 'profile' ? 'Profil Admin' :
                       'Dashboard Overview'}
                   </h1>
                   <p className="text-slate-500 text-sm font-medium mt-1">Selamat datang kembali, {ADMIN_PROFILE.name.split(' ')[0]}.</p>
                </div>
                <div className="flex items-center gap-4">
                   <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm relative group active:scale-95">
                      <Bell size={20} />
                      <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border border-white group-hover:scale-125 transition-transform"></span>
                   </button>
                   <div className="h-10 w-px bg-slate-200 mx-1"></div>
                   <div className="text-right bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-slate-500 font-mono">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                   </div>
                </div>
             </div>

             {renderView()}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200 flex justify-between px-2 py-2 pb-safe sticky bottom-0 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           {[
             { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
             { id: 'lockers', icon: Box, label: 'Loker' },
             { id: 'users', icon: Users, label: 'User' },
             { id: 'activity', icon: Activity, label: 'Aktivitas' },
             { id: 'profile', icon: UserCircle, label: 'Profil' },
           ].map((item) => (
             <button 
                key={item.id}
                onClick={() => setCurrentView(item.id)} 
                className={`flex-1 p-2 rounded-xl flex flex-col items-center gap-1 transition-all duration-300 relative ${
                  currentView === item.id 
                  ? 'text-indigo-600' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
             >
                <div className={`relative p-1 rounded-full transition-all duration-300 ${currentView === item.id ? '-translate-y-1' : ''}`}>
                  <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
                  {currentView === item.id && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></span>
                  )}
                </div>
                <span className={`text-[10px] font-bold transition-all duration-300 ${currentView === item.id ? 'opacity-100' : 'opacity-70 scale-90'}`}>
                  {item.label}
                </span>
             </button>
           ))}
        </div>
      </main>
    </div>
  );
}

// --- APP ENTRY POINT ---

export default function App() {
  // Login removed as requested. Direct to Dashboard.
  return <DashboardLayout />;
}