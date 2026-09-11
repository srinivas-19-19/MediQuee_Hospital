import { useState, useEffect, useCallback } from "react"
import { Clock, Users, IndianRupee, Calendar, FileText, ChevronDown, Stethoscope, MoreVertical, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from "react-router-dom"
import { PromoCarousel } from "../components/PromoCarousel"
import { EmptyState } from "../components/ui/EmptyState"
import { Skeleton } from "../components/ui/Skeleton"
import { useAuth } from "../context/AuthContext"
import { dashboardApi, type DashboardOverview } from "../services/dashboardApi"

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getOverview();
      setOverview(data);
    } catch (err: any) {
      console.error("Failed to load dashboard overview:", err);
      setError(err?.message || "Failed to load live metrics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();

    // Auto-refresh every 30 seconds for live counters
    const interval = setInterval(() => {
      fetchOverview(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOverview]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    { icon: Users, label: 'OP Mgt', path: '/appointments' },
    { icon: Calendar, label: 'Appts', path: '/appointments' },
    { icon: IndianRupee, label: 'Payout', path: '/payouts' },
    { icon: Stethoscope, label: 'Doctors', path: '/profile' },
    { icon: FileText, label: 'Reports', path: '/dashboard' },
  ];

  const revenueData = overview?.revenueTrend || [];
  const todayAppointments = overview?.todayAppointments || [];
  const upcomingAppointments = overview?.upcomingAppointments || [];
  const [appointmentTab, setAppointmentTab] = useState<'today' | 'upcoming'>('today');

  // If today has no appointments, but upcoming has appointments, default to upcoming so user immediately sees bookings
  useEffect(() => {
    if (overview && todayAppointments.length === 0 && upcomingAppointments.length > 0) {
      setAppointmentTab('upcoming');
    }
  }, [overview, todayAppointments.length, upcomingAppointments.length]);

  const activeAppointments = appointmentTab === 'today' ? todayAppointments : upcomingAppointments;

  const formatApptDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="flex flex-col gap-6 p-4 pt-2"
    >
      {/* Greeting & Refresh Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-[#172033]">
            {getGreeting()} {user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-[14px] text-[#667085]">Here's what's happening at your hospital today.</p>
        </div>
        <button 
          onClick={() => fetchOverview(true)}
          disabled={isLoading}
          aria-label="Refresh metrics"
          className="p-2 rounded-xl bg-white border border-gray-100/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-gray-500 hover:text-primary active:scale-95 transition-all mt-0.5"
          title="Refresh metrics"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between">
          <span>Unable to refresh live metrics. Showing cached or fallback data.</span>
          <button onClick={() => fetchOverview(true)} className="font-semibold underline ml-2">Retry</button>
        </div>
      )}

      {/* Today's Overview (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Total OPs */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-primary rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-[#667085]">Today's OPs</span>
          </div>
          <div className="flex flex-col min-h-[32px] justify-center">
            {isLoading && !overview ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-semibold text-[#172033] tracking-tight">
                  {overview?.totalOPs ?? 0}
                </span>
                {(overview?.upcomingOPs ?? 0) > 0 && (
                  <span className="text-[11px] font-semibold text-primary bg-blue-50 px-2 py-0.5 rounded-full">
                    +{overview?.upcomingOPs} upcoming
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 2: Pending OPs */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 text-warning rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-[#667085]">Pending OPs</span>
          </div>
          <div className="flex flex-col min-h-[32px] justify-center">
            {isLoading && !overview ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <span className="text-[24px] font-semibold text-[#172033] tracking-tight">
                {overview?.pendingOPs ?? 0}
              </span>
            )}
          </div>
        </motion.div>

        {/* Card 3: Lab Tests */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 text-info rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-[#667085]">Lab Tests</span>
          </div>
          <div className="flex flex-col min-h-[32px] justify-center">
            {isLoading && !overview ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <span className="text-[24px] font-semibold text-[#172033] tracking-tight">
                {overview?.labTests ?? 0}
              </span>
            )}
          </div>
        </motion.div>

        {/* Card 4: Revenue Today */}
        <motion.div variants={item} className="bg-white rounded-2xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 text-teal rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-[13px] font-medium text-[#667085]">Revenue</span>
          </div>
          <div className="flex flex-col min-h-[32px] justify-center">
            {isLoading && !overview ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <span className="text-[24px] font-semibold text-[#172033] tracking-tight">
                {formatCurrency(overview?.revenueToday ?? 0)}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      <PromoCarousel />

      {/* Revenue Trend Chart */}
      <motion.div variants={item} className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-[#172033]">Revenue</h3>
            <span className="text-[12px] font-medium text-[#667085]">This Week</span>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-semibold text-[#172033] bg-[#F7F8FA] px-2.5 py-1.5 rounded-lg interactive-element">
            Week <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex flex-col min-h-[32px] justify-center">
            {isLoading && !overview ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <span className="text-[24px] font-semibold text-[#172033] tracking-tight">
                {formatCurrency(overview?.revenueThisWeek ?? 0)}
              </span>
            )}
          </div>
        </div>

        <div className="h-[120px] w-full mt-2 -ml-2">
          {isLoading && !overview ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ) : revenueData.some(d => d.revenue > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1769E0" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1769E0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                  itemStyle={{ color: '#1769E0', fontWeight: '600' }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']}
                  cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1769E0" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center ml-2">
              <span className="text-[13px] font-medium text-[#98A2B3]">No revenue recorded this week</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Access */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <h3 className="text-[17px] font-semibold text-[#172033] px-1">Quick Access</h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
          {quickActions.map((action, idx) => (
            <button key={idx} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-2 min-w-[72px] interactive-element active:scale-95 transition-transform">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-primary">
                <action.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-[12px] font-medium text-[#172033]">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Appointments Feed with Today vs Upcoming Toggle */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAppointmentTab('today')}
              className={`text-[15px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                appointmentTab === 'today'
                  ? 'bg-[#172033] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#172033] bg-gray-100/60'
              }`}
            >
              Today ({todayAppointments.length})
            </button>
            <button
              onClick={() => setAppointmentTab('upcoming')}
              className={`text-[15px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                appointmentTab === 'upcoming'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#172033] bg-gray-100/60'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
          </div>
          <button 
            onClick={() => navigate('/appointments')} 
            className="text-[13px] font-semibold text-primary interactive-element hover:underline"
          >
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
          {isLoading && !overview ? (
            <div className="p-4 flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : activeAppointments.length > 0 ? (
            activeAppointments.map((appt) => (
              <div 
                key={appt.id} 
                onClick={() => navigate('/appointments')} 
                className="flex items-start gap-3 p-4 border-b border-gray-50 last:border-0 interactive-element active:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center pt-1 min-w-[70px]">
                  <span className="text-[13px] font-bold text-[#172033]">{appt.time.split(' ')[0]}</span>
                  <span className="text-[10px] font-semibold text-[#98A2B3]">{appt.time.split(' ')[1]}</span>
                  {appt.date && (
                    <span className="text-[10px] font-bold text-primary bg-blue-50 px-1.5 py-0.5 rounded mt-1 text-center whitespace-nowrap">
                      {formatApptDate(appt.date)}
                    </span>
                  )}
                </div>

                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                  <img src={appt.avatar} alt={appt.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[15px] font-semibold text-[#172033]">{appt.name}</span>
                    <button className="p-1 -mt-1 -mr-1 text-[#98A2B3] active:text-[#172033]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[13px] font-medium text-[#667085] mt-0.5">{appt.dept} &middot; {appt.doctor}</span>
                  <span className={`text-[12px] font-semibold mt-1.5 px-2 py-0.5 rounded-md inline-block w-fit ${appt.statusColor}`}>{appt.status}</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Calendar}
              title={appointmentTab === 'today' ? "No Consultations Today" : "No Upcoming Consultations"}
              description={
                appointmentTab === 'today' 
                  ? upcomingAppointments.length > 0 
                    ? `No appointments for today. You have ${upcomingAppointments.length} upcoming appointment(s).` 
                    : "Today's appointments will appear here once booked."
                  : "No upcoming consultations scheduled."
              }
            />
          )}
        </div>
      </motion.div>
      
    </motion.div>
  )
}
