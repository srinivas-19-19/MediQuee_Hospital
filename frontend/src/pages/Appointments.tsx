import { Search, Filter, Stethoscope, Video, Home, FlaskConical, TestTube, Calendar, ChevronDown, MoreVertical, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
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

  const appointmentTypes = [
    { id: 'op', label: 'OP', icon: Stethoscope },
    { id: 'video', label: 'Video Consultation', icon: Video },
    { id: 'home', label: 'Home Nursing', icon: Home },
    { id: 'lab', label: 'Lab Tests', icon: FlaskConical },
    { id: 'sample', label: 'Home Sample Collection', icon: TestTube },
  ];

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

  // Simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
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
      case 'Confirmed': return 'bg-green-50 text-success border-green-100';
      case 'Pending': return 'bg-orange-50 text-warning border-orange-100';
      case 'Completed': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'Cancelled': return 'bg-red-50 text-destructive border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="flex flex-col bg-background min-h-full pb-6">
      
      {/* Sticky Top Controls */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-4 pb-2 px-4 flex flex-col gap-4 border-b border-gray-100/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        
        {/* Header Title & Actions */}
        <div className="flex justify-between items-center px-1">
          <h1 className="text-[22px] font-semibold text-[#172033]">Appointments</h1>
          <div className="flex gap-3 text-[#172033]">
            <Search className="w-5 h-5 cursor-pointer interactive-element" />
            <Filter className="w-5 h-5 cursor-pointer interactive-element" />
          </div>
        </div>

        {/* Compact Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#98A2B3]">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search patient, doctor, or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200/60 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-[14px] text-[#172033] placeholder:text-[#98A2B3] shadow-sm"
          />
        </div>

        {/* Service Selector (Above Date) */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {appointmentTypes.map((type) => {
            const isActive = selectedType === type.id;
            const Icon = type.icon;
            return (
              <button 
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl flex-shrink-0 transition-all interactive-element border",
                  isActive ? "bg-blue-50/80 border-primary/30 text-primary" : "bg-white border-gray-200/60 text-[#667085] hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[13px] font-semibold whitespace-nowrap", isActive ? "text-primary" : "text-[#172033]")}>
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-4">
        
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200/60 text-[#172033] rounded-xl flex-shrink-0 interactive-element active:scale-95 transition-transform shadow-sm">
            <Calendar className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {dates.map((d) => {
              const isActive = selectedDate === d.date;
              return (
                <button 
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[64px] py-1.5 rounded-xl flex-shrink-0 transition-all interactive-element border",
                    isActive ? "bg-primary text-white border-primary shadow-[0_4px_12px_rgba(23,105,224,0.25)]" : "bg-white border-gray-200/60 text-[#667085]"
                  )}
                >
                  <span className={cn("text-[14px]", isActive ? "font-bold" : "font-semibold text-[#172033]")}>{d.date}</span>
                  <span className={cn("text-[11px]", isActive ? "font-medium opacity-90" : "font-medium text-[#98A2B3]")}>{d.day}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Department Filter */}
        <button className="flex items-center justify-between w-full bg-white rounded-xl px-3.5 py-3 border border-gray-200/60 shadow-sm active:scale-[0.98] transition-transform interactive-element">
          <span className="font-semibold text-[14px] text-[#172033]">All Departments</span>
          <ChevronDown className="w-4 h-4 text-[#98A2B3]" />
        </button>

        {/* Appointment List (Grouped Rows) */}
        <div className="flex flex-col relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 py-2 px-1">
                    <Skeleton className="w-[60px] h-4 mt-2" />
                    <div className="flex items-start flex-1 gap-3">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                      <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : filteredAppointments.length > 0 ? (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
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
                        if (info.offset.x < -60) handleDelete(apt.id);
                      }}
                      className="relative border-b border-gray-100 last:border-0 group"
                    >
                      {/* Delete Background Layer */}
                      <div className="absolute inset-0 bg-destructive/10 flex items-center justify-end px-6 z-0">
                        <Trash2 className="text-destructive w-5 h-5" />
                      </div>

                      {/* Foreground Row */}
                      <motion.div 
                        onClick={() => setSelectedAppointment(apt)}
                        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-50 transition-colors relative z-10 bg-white interactive-element"
                      >
                        <div className="flex flex-col items-center pt-1 min-w-[65px]">
                          <span className="text-[13px] font-bold text-[#172033]">{apt.time.split(' ')[0]}</span>
                          <span className="text-[10px] font-semibold text-[#98A2B3]">{apt.time.split(' ')[1]}</span>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 mt-0.5">
                          <img src={apt.avatar} alt={apt.patientName} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-[15px] font-semibold text-[#172033]">{apt.patientName}</span>
                            <div className={cn(
                              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border shrink-0",
                              getStatusColor(apt.status)
                            )}>
                              {apt.status}
                            </div>
                          </div>
                          <span className="text-[13px] font-medium text-[#667085] mt-1">{apt.type}</span>
                          <span className="text-[12px] font-medium text-[#98A2B3] mt-0.5">{apt.doctor}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
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

      <AppointmentDetailModal 
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  )
}
