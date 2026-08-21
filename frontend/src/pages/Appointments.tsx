import { Search, Filter, Stethoscope, Video, Home, FlaskConical, TestTube, Calendar, ChevronDown, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { AppointmentDetailModal } from "../components/appointments/AppointmentDetailModal"
import { Skeleton } from "../components/ui/Skeleton"
import { EmptyState } from "../components/ui/EmptyState"
import { cn } from "@/lib/utils"

export function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedType, setSelectedType] = useState('op');
  const [selectedDate, setSelectedDate] = useState('14 May');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { role } = useAuth();
  
  const allAppointmentTypes = [
    { id: 'op', label: 'OP', icon: Stethoscope },
    { id: 'video', label: 'Video Consult', icon: Video },
    { id: 'home', label: 'Home Nursing', icon: Home },
    { id: 'lab', label: 'Lab Tests', icon: FlaskConical },
    { id: 'sample', label: 'Sample Collection', icon: TestTube },
  ];

  const appointmentTypes = allAppointmentTypes.filter(type => {
    if (role === 'doctor') return ['op', 'video'].includes(type.id);
    if (role === 'nurse') return ['home'].includes(type.id);
    if (role === 'lab') return ['lab', 'sample'].includes(type.id);
    return true; // admin and receptionist see all
  });

  const dates = [
    { date: '14 May', day: 'Wed' },
    { date: '15 May', day: 'Thu' },
    { date: '16 May', day: 'Fri' },
    { date: '17 May', day: 'Sat' },
  ];

  const initialAppointments = [
    { id: 1, patientName: "Ramesh Kumar", time: "09:00 AM", type: "Cardiology", doctor: "Dr. Arjun Singh", status: "Confirmed", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, patientName: "Priya Sharma", time: "10:00 AM", type: "Dermatology", doctor: "Dr. Neha Verma", status: "Confirmed", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, patientName: "Mohammed Ali", time: "11:00 AM", type: "General", doctor: "Dr. Amit Patel", status: "Pending", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, patientName: "Sunita Devi", time: "12:00 PM", type: "Gynecology", doctor: "Dr. Pooja Mehta", status: "Pending", avatar: "https://i.pravatar.cc/150?u=4" }
  ];

  const [appointmentsList, setAppointmentsList] = useState(initialAppointments);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedType, selectedDate]);

  const filteredAppointments = appointmentsList.filter(apt => 
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setAppointmentsList(prev => prev.filter(a => a.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col bg-slate-50/50 min-h-full pb-8">
      
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pt-6 pb-4 px-4 flex flex-col gap-5 border-b border-slate-200/60 shadow-sm">
        
        {/* Title & Actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search patient, doctor, or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-[15px] font-medium text-slate-900 placeholder:text-slate-500"
          />
        </div>

        {/* Service Selector Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {appointmentTypes.map((type) => {
            const isActive = selectedType === type.id;
            const Icon = type.icon;
            return (
              <button 
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0 transition-all active:scale-95 font-semibold",
                  isActive ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm whitespace-nowrap">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pt-6">
        
        {/* Calendar Strip */}
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-14 h-14 bg-white border border-slate-200/80 text-slate-700 rounded-2xl flex-shrink-0 active:scale-95 transition-transform shadow-sm">
            <Calendar className="w-6 h-6" strokeWidth={2} />
          </button>
          <div className="w-px h-10 bg-slate-200 mx-1"></div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1">
            {dates.map((d) => {
              const isActive = selectedDate === d.date;
              return (
                <button 
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[68px] py-2 rounded-2xl flex-shrink-0 transition-all active:scale-95",
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-white border border-slate-200/80 text-slate-500"
                  )}
                >
                  <span className={cn("text-sm", isActive ? "font-bold" : "font-semibold text-slate-800")}>{d.date}</span>
                  <span className={cn("text-[11px]", isActive ? "font-medium text-blue-100" : "font-medium text-slate-400")}>{d.day}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* List Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-slate-900 text-lg">Schedule</h2>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              All Departments <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col relative gap-3">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4">
                      <div className="flex flex-col items-center justify-center">
                        <Skeleton className="w-12 h-4 mb-1" />
                        <Skeleton className="w-8 h-3" />
                      </div>
                      <div className="w-px h-10 bg-slate-100 my-auto" />
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredAppointments.length > 0 ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                  <AnimatePresence>
                    {filteredAppointments.map((apt) => (
                      <motion.div 
                        layout
                        key={apt.id} 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -80) handleDelete(apt.id);
                        }}
                        className="relative rounded-2xl group overflow-hidden bg-rose-500"
                      >
                        {/* Delete Background Layer */}
                        <div className="absolute inset-0 flex items-center justify-end px-6 z-0">
                          <Trash2 className="text-white w-6 h-6" />
                        </div>

                        {/* Foreground Card */}
                        <motion.div 
                          onClick={() => setSelectedAppointment(apt)}
                          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors relative z-10 bg-white border border-slate-200/60 rounded-2xl shadow-sm"
                        >
                          <div className="flex flex-col items-center justify-center min-w-[70px]">
                            <span className="text-[15px] font-extrabold text-slate-900 tracking-tight">{apt.time.split(' ')[0]}</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{apt.time.split(' ')[1]}</span>
                          </div>
                          
                          <div className="w-px h-12 bg-slate-100 shrink-0" />

                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              <img src={apt.avatar} alt={apt.patientName} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[16px] font-bold text-slate-900 truncate">{apt.patientName}</span>
                                <div className={cn(
                                  "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border shrink-0",
                                  getStatusColor(apt.status)
                                )}>
                                  {apt.status}
                                </div>
                              </div>
                              <span className="text-[13px] font-medium text-slate-600 mt-0.5 truncate">{apt.type}</span>
                              <span className="text-[12px] font-semibold text-slate-400 mt-0.5 truncate">{apt.doctor}</span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
                  <EmptyState 
                    icon={Search}
                    title="No appointments found"
                    description="Adjust your search or filters to find what you're looking for."
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
    </div>
  )
}
