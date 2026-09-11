import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { UserPlus, Clock, ArrowRight, Building, CheckCircle2, Activity, PlaySquare, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { EmptyState } from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { receptionistApi, type QueueEntry } from "@/services/receptionistApi"

export function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [depts, queueData] = await Promise.all([
        receptionistApi.getDepartments().catch(() => []),
        receptionistApi.getQueue().catch(() => []),
      ]);
      setDepartments(depts);
      setQueue(queueData);
    } catch (err) {
      console.error("Error loading receptionist dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      loadData(true);
    }, 15000);
    return () => clearInterval(timer);
  }, [loadData]);

  // Derived counts
  const waitingCount = queue.filter(q => q.status === 'WAITING').length;
  const inConsultCount = queue.filter(q => q.status === 'IN_CONSULTATION').length;
  const completedCount = queue.filter(q => q.status === 'COMPLETED').length;

  const stats = [
    { title: "Waiting", value: loading ? "—" : waitingCount, icon: Clock, color: "text-orange-600 bg-orange-50 border-orange-100" },
    { title: "In Consultation", value: loading ? "—" : inConsultCount, icon: PlaySquare, color: "text-[#1B5DF1] bg-[#EBF5FF] border-[#1B5DF1]/20" },
    { title: "Completed", value: loading ? "—" : completedCount, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  ];

  const departmentQueues = departments.map(dept => {
    const deptItems = queue.filter(q => q.departmentId === dept.id);
    const waiting = deptItems.filter(q => q.status === 'WAITING');
    const inConsult = deptItems.filter(q => q.status === 'IN_CONSULTATION').length;
    const nextOp = waiting.length > 0 ? waiting[0].token : "None";

    return {
      id: dept.id,
      name: dept.name,
      waiting: waiting.length,
      inConsult,
      nextOp,
    };
  });

  const getRushLevel = (count: number) => {
    if (count === 0) return { label: "Calm", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" };
    if (count <= 3) return { label: "Low", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" };
    if (count <= 8) return { label: "Moderate", text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" };
    return { label: "High Rush", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" };
  };

  const rush = getRushLevel(waitingCount);

  return (
    <div className="flex flex-col gap-5 p-4 pb-24 min-h-[calc(100vh-80px)] bg-gray-50/30">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <div>
          <h1 className="text-[22px] font-black text-[#0A1A3D] tracking-tight">Patient Flow</h1>
          <p className="text-gray-500 text-[13px] font-medium mt-0.5">Manage queues and appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            title="Refresh dashboard"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#1B5DF1] hover:bg-[#EBF5FF] hover:border-[#1B5DF1]/30 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin text-[#1B5DF1]")} />
          </button>
          <button 
            onClick={() => navigate('/receptionist/check-in')}
            title="Check-In Patient"
            className="w-10 h-10 rounded-full bg-[#1B5DF1] text-white flex items-center justify-center hover:bg-[#154ac2] transition-colors shadow-sm"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-3">
        {loading ? (
          <>
            <Skeleton className="h-24 rounded-2xl bg-white border border-gray-100" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-gray-100" />
            <Skeleton className="h-24 rounded-2xl bg-white border border-gray-100" />
          </>
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn("bg-white p-3.5 rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-2", stat.color.split(' ')[2])}
            >
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", stat.color.split(' ').slice(0,2).join(' '))}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <h3 className={cn("text-[20px] font-black leading-none", stat.color.split(' ')[0])}>{stat.value}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">{stat.title}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Department Queues */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3 mt-2"
      >
        <div className="flex items-center justify-between px-1 mb-1">
          <h2 className="text-[14px] font-bold text-[#0A1A3D] uppercase tracking-wider">Department Queues</h2>
          <span className="text-[12px] font-semibold text-gray-400">
            {departments.length} {departments.length === 1 ? 'Department' : 'Departments'}
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-28 rounded-[20px] bg-white border border-gray-100" />
              <Skeleton className="h-28 rounded-[20px] bg-white border border-gray-100" />
            </div>
          ) : departmentQueues.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No Department Queues"
              description="No departments have been added to this hospital yet."
            />
          ) : departmentQueues.map(dept => (
            <button 
              key={dept.id} 
              onClick={() => navigate(`/receptionist/queue?dept=${dept.id}`)}
              className="flex flex-col p-4 bg-white rounded-[20px] border border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#1B5DF1]/30 active:scale-[0.98] transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1B5DF1] shrink-0 border border-blue-100">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A1A3D] text-[16px]">{dept.name}</h4>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">Waiting</span>
                    <span className="text-[15px] font-black text-orange-600">{dept.waiting}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">In Consult</span>
                    <span className="text-[15px] font-black text-[#1B5DF1]">{dept.inConsult}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">Next</span>
                    <span className="text-[15px] font-black text-[#0A1A3D]">{dept.nextOp}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#1B5DF1] group-hover:border-[#1B5DF1]/30 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Hospital Rush */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between bg-white p-5 rounded-[20px] border border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mt-2"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border", rush.bg, rush.border, rush.text)}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">Hospital Rush</h2>
            <div className={cn("flex items-center gap-2 text-[16px] font-black", rush.text)}>
              {loading ? "—" : rush.label}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[20px] font-black text-[#0A1A3D]">{loading ? "—" : waitingCount}</span>
          <span className="text-[11px] font-bold text-gray-400 uppercase">Total Waiting</span>
        </div>
      </motion.div>

    </div>
  )
}
