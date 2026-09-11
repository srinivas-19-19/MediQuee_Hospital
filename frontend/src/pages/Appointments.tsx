import { Search, Filter, Calendar, ArrowLeft, Play, FileText, Plus } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { AppointmentDetailModal } from "../components/appointments/AppointmentDetailModal"
import { WalkInModal } from "../components/appointments/WalkInModal"
import { Skeleton } from "../components/ui/Skeleton"
import { EmptyState } from "../components/ui/EmptyState"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { adminApi } from "@/services/adminApi"

export function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState('ops');
  const [selectedDate, setSelectedDate] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { role } = useAuth();
  const navigate = useNavigate();

  const filterTypes = [
    { id: 'ops', label: 'OPs' },
    { id: 'video', label: 'Video Consultation' },
    { id: 'lab', label: 'Lab' },
    { id: 'home_sample', label: 'Home Sample Collection' },
    { id: 'home_nursing', label: 'Home Nursing' },
  ];

  // Dynamic 14-day date strip starting from today
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayStr = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;
    return { iso, date: dateStr, day: dayStr };
  });

  // Appointment records
  type Appointment = {
    id: string; mqId: string; patientName: string; patientPhone?: string; time: string; period: string;
    date: string; type: string; doctor: string; status: string; avatar: string;
  };
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  const fetchBookings = useCallback(async (targetDate: string) => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (targetDate === 'upcoming') {
        filters.range = 'upcoming';
      } else if (targetDate === 'all') {
        filters.range = 'all';
      } else {
        filters.date = targetDate;
      }
      const data = await adminApi.getBookings(filters);
      const mapped = (data || []).map((b: any) => {
        const timeStr = b.timeSlot || b.slotTime || new Date(b.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const parts = timeStr.trim().split(' ');
        return {
          id: b.id,
          mqId: `OP-${b.id.substring(0, 6).toUpperCase()}`,
          patientName: b.patientName || 'Patient',
          patientPhone: b.patientPhone,
          time: parts[0] || '10:00',
          period: parts[1] || 'AM',
          date: (b.appointmentDate || '').split('T')[0],
          type: b.opType || b.condition?.name || 'Walk-In',
          doctor: b.doctor?.name || 'Assigned Doctor',
          status: b.status || 'WAITING',
          avatar: b.doctor?.avatar || ''
        };
      });
      setAppointmentsList(mapped);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate, fetchBookings]);

  const filteredAppointments = appointmentsList.filter(apt =>
    (apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.mqId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateBookingStatus(id, newStatus);
      fetchBookings(selectedDate); // Refresh the list
    } catch (err) {
      console.error(err);
    }
    setActiveDropdown(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-50 text-emerald-500';
      case 'PENDING': return 'bg-[#EBF5FF] text-[#1B5DF1]';
      case 'IN_CONSULTATION': return 'bg-blue-50 text-blue-600';
      case 'COMPLETED': return 'bg-[#0A1A3D] text-white';
      case 'CANCELLED': return 'bg-red-50 text-red-500';
      case 'WAITING': return 'bg-amber-50 text-amber-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col bg-gray-50/30 min-h-full pb-8" onClick={() => setActiveDropdown(null)}>
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl pt-6 pb-4 px-4 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#0A1A3D] hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-[22px] font-black text-[#0A1A3D] tracking-tight">Appointments</h1>
          </div>
          <button 
            onClick={() => setIsWalkInModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#1B5DF1] hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Walk-In
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1B5DF1] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-[16px] outline-none focus:border-[#1B5DF1] focus:ring-4 focus:ring-[#1B5DF1]/10 transition-all text-[15px] font-medium text-[#0A1A3D] placeholder:text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            />
            <button className="absolute inset-y-0 right-4 flex items-center text-[#1B5DF1]">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filterTypes.map((type) => {
            const isActive = selectedFilter === type.id;
            return (
              <button 
                key={type.id}
                onClick={() => setSelectedFilter(type.id)}
                className={cn(
                  "px-5 py-2 rounded-full flex-shrink-0 transition-all active:scale-95 font-bold text-[13px]",
                  isActive ? "bg-[#1B5DF1] text-white shadow-md shadow-[#1B5DF1]/20" : "bg-white text-[#667085] border border-gray-200"
                )}
              >
                {type.label}
              </button>
            )
          })}
        </div>

        {/* Date Strip */}
        <div className="flex items-center gap-3 mt-1">
          <button 
            onClick={() => setSelectedDate('upcoming')}
            title="View all upcoming appointments"
            className="flex items-center justify-center w-[52px] h-[52px] bg-white border border-gray-200 text-[#0A1A3D] rounded-[16px] flex-shrink-0 active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <Calendar className="w-6 h-6 text-primary" />
          </button>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 flex-1">
            <button 
              onClick={() => setSelectedDate('upcoming')}
              className={cn(
                "flex flex-col items-center justify-center min-w-[76px] h-[52px] rounded-[16px] flex-shrink-0 transition-all active:scale-95 px-3 border",
                selectedDate === 'upcoming' 
                  ? "bg-[#1B5DF1] text-white shadow-lg shadow-[#1B5DF1]/30 border-[#1B5DF1]" 
                  : "bg-white border-gray-200 text-[#0A1A3D] hover:bg-gray-50"
              )}
            >
              <span className={cn("text-[13px] font-bold leading-tight", selectedDate === 'upcoming' ? "text-white" : "text-[#0A1A3D]")}>Upcoming</span>
              <span className={cn("text-[10px] font-semibold leading-tight", selectedDate === 'upcoming' ? "text-[#EBF5FF]" : "text-gray-400")}>All Dates</span>
            </button>

            {dates.map((d) => {
              const isActive = selectedDate === d.iso;
              return (
                <button 
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[56px] h-[52px] rounded-[16px] flex-shrink-0 transition-all active:scale-95 border",
                    isActive 
                      ? "bg-[#1B5DF1] text-white shadow-lg shadow-[#1B5DF1]/30 border-[#1B5DF1]" 
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <span className={cn("text-[13px] font-bold leading-tight", isActive ? "text-white" : "text-[#0A1A3D]")}>{d.date.split(' ')[0]} {d.date.split(' ')[1]}</span>
                  <span className={cn("text-[11px] font-semibold leading-tight", isActive ? "text-[#EBF5FF]" : "text-gray-400")}>{d.day}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 pt-5 gap-6">
        
        {/* Summary Block */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[15px] font-bold text-[#0A1A3D]">
              {selectedDate === 'upcoming' 
                ? 'Upcoming Consultations' 
                : selectedDate === todayIso 
                  ? "Today's Consultations" 
                  : `Consultations on ${dates.find(d => d.iso === selectedDate)?.date || selectedDate}`}
            </h3>
            <span className="text-[#1B5DF1] text-[13px] font-bold">
              {filteredAppointments.length} Bookings
            </span>
          </div>

          <div className="bg-white rounded-[20px] p-4 flex items-center justify-between border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[22px] font-black text-[#0A1A3D]">{appointmentsList.length}</span>
              <span className="text-[11px] font-bold text-gray-500">Total</span>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="flex flex-col items-center flex-1">
              <span className="text-[22px] font-black text-[#0A1A3D]">{appointmentsList.filter(a => a.status === 'WAITING').length}</span>
              <span className="text-[11px] font-bold text-gray-500">Waiting</span>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="flex flex-col items-center flex-1">
              <span className="text-[22px] font-black text-[#0A1A3D]">{appointmentsList.filter(a => a.status === 'IN_CONSULTATION').length}</span>
              <span className="text-[11px] font-bold text-gray-500">In Consult</span>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="flex flex-col items-center flex-1">
              <span className="text-[22px] font-black text-[#0A1A3D]">{appointmentsList.filter(a => a.status === 'COMPLETED').length}</span>
              <span className="text-[11px] font-bold text-gray-500">Completed</span>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-[#0A1A3D] text-[17px] px-1">Appointment List</h2>

          <div className="flex flex-col relative gap-3">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-2xl bg-white border border-gray-100" />
                  ))}
                </motion.div>
              ) : filteredAppointments.length > 0 ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                  {filteredAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      className="flex flex-col bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    >
                      <div className="flex gap-4">
                        {/* Time */}
                        <div className="flex flex-col items-center min-w-[60px] pt-1">
                          <span className="text-[16px] font-black text-[#0A1A3D] leading-none">{apt.time}</span>
                          <span className="text-[11px] font-bold text-gray-400 mt-1">{apt.period}</span>
                          {apt.date && (
                            <span className="text-[10px] font-bold text-primary bg-blue-50 px-1.5 py-0.5 rounded mt-1.5 text-center whitespace-nowrap">
                              {apt.date}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col flex-1 gap-1 border-l border-gray-100 pl-4">
                          {/* Info & Status */}
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-[16px] font-bold text-[#0A1A3D]">{apt.patientName}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[12px] font-medium text-gray-500">ID: {apt.mqId}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-[12px] font-medium text-gray-500">{apt.doctor}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-[12px] font-medium text-gray-500">{apt.type}</span>
                              </div>
                            </div>
                            
                            <div className="relative">
                              {role === 'doctor' ? (
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setActiveDropdown(activeDropdown === apt.id ? null : apt.id); 
                                  }}
                                  className={cn(
                                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shrink-0",
                                    getStatusColor(apt.status)
                                  )}
                                >
                                  {apt.status}
                                </button>
                              ) : (
                                <div className={cn(
                                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shrink-0",
                                  getStatusColor(apt.status)
                                )}>
                                  {apt.status}
                                </div>
                              )}

                              {activeDropdown === apt.id && (
                                <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden">
                                  {['PENDING', 'WAITING', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED'].map(status => (
                                    <button
                                      key={status}
                                      onClick={() => updateStatus(apt.id, status)}
                                      className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase text-[#0A1A3D] hover:bg-[#EBF5FF] hover:text-[#1B5DF1] transition-colors"
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-1.5 text-gray-500 text-[12px] font-semibold">
                              <FileText className="w-3.5 h-3.5" />
                              Consultation
                            </div>
                            
                            {apt.status !== 'CANCELLED' && role === 'doctor' ? (
                              <button 
                                onClick={() => setSelectedAppointment(apt)}
                                className="flex items-center gap-1.5 text-[#1B5DF1] font-bold text-[13px] px-3 py-1.5 rounded-lg border border-[#1B5DF1]/20 hover:bg-[#EBF5FF] transition-colors active:scale-95"
                              >
                                <Play className="w-3.5 h-3.5 fill-[#1B5DF1]" />
                                Start
                              </button>
                            ) : (
                              <div className="px-5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 font-bold">
                                --
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
                  <EmptyState 
                    icon={Search}
                    title="No Patients Found"
                    description="Try adjusting your filters or search query."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AppointmentDetailModal 
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
      <WalkInModal 
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onSuccess={() => fetchBookings()}
      />
    </div>
  )
}
