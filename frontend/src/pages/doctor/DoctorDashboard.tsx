import { Video, Stethoscope, Megaphone, ChevronRight, Calendar } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/EmptyState"

export function DoctorDashboard() {
  const navigate = useNavigate()

  // Current / next patient comes from the backend queue. Null until connected.
  const [nextPatient] = useState<{
    name: string; age: number; gender: string; mqId: string;
    time: string; period: string; type: string; status: string;
  } | null>(null);

  // Today's schedule comes from the backend. Empty until connected.
  const todaySchedule: {
    id: number; name: string; mqId: string; time: string; period: string;
    type: string; category: string; status: string;
  }[] = [];

  // Upcoming video consultations come from the backend. Empty until connected.
  const upcomingVideos: {
    id: number; name: string; mqId: string; time: string; type: string; status: string;
  }[] = [];

  const getStatusStyle = (status: string, category: string) => {
    if (category === 'VIDEO') return 'bg-indigo-50 text-indigo-600';
    switch (status) {
      case 'WAITING':
      case 'PENDING':
        return 'bg-[#EBF5FF] text-[#1B5DF1]';
      case 'UPCOMING':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none md:p-4 pb-12 bg-[#F7F8FA] min-h-full px-4 pt-4">
      
      {/* Compact Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-[#0A1A3D] text-[20px] font-black tracking-tight">
              Welcome back
            </h1>
            <span className="bg-[#EBF5FF] text-[#1B5DF1] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              DOCTOR
            </span>
          </div>
        </div>
      </div>

      {/* Current / Next Patient Contextual Card */}
      <div className="bg-gradient-to-br from-[#1B5DF1] to-[#1244B6] rounded-[24px] p-5 text-white shadow-[0_8px_24px_rgba(27,93,241,0.25)] flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
            NOW CONSULTING
          </span>
        </div>

        {nextPatient ? (
          <>
            <div className="relative z-10 flex flex-col gap-1">
              <h2 className="text-[22px] font-black tracking-tight text-white">{nextPatient.name}</h2>
              <div className="flex items-center gap-2 text-[13px] text-[#EBF5FF]/90 font-medium">
                <span>{nextPatient.age} yrs</span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                <span>{nextPatient.gender}</span>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                <span>ID {nextPatient.mqId}</span>
              </div>
              <p className="text-[#EBF5FF] text-[13px] font-semibold mt-1">
                {nextPatient.time} {nextPatient.period} · {nextPatient.type}
              </p>
            </div>

            <div className="relative z-10 flex gap-3 mt-2">
              <button
                onClick={() => navigate('/patients/' + nextPatient.mqId)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-[14px] transition-all active:scale-[0.98] text-[14px]"
              >
                Open Patient
              </button>
              <button
                onClick={() => navigate('/doctor/ops')}
                className="flex-1 bg-white text-[#1B5DF1] font-bold py-3 rounded-[14px] shadow-sm transition-all active:scale-[0.98] text-[14px]"
              >
                Start Consult
              </button>
            </div>
          </>
        ) : (
          <div className="relative z-10 flex flex-col gap-1 py-2">
            <h2 className="text-[22px] font-black tracking-tight text-white">—</h2>
            <p className="text-[#EBF5FF]/90 text-[13px] font-medium">
              No patient in consultation.
            </p>
          </div>
        )}
      </div>

      {/* Today's Overview (Grid) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] p-4 flex flex-col gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <span className="text-[24px] font-black text-[#0A1A3D]">—</span>
          <span className="text-[12px] font-bold text-gray-500">Today's OPs</span>
        </div>
        <div className="bg-white rounded-[20px] p-4 flex flex-col gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <span className="text-[24px] font-black text-[#1B5DF1]">—</span>
          <span className="text-[12px] font-bold text-[#1B5DF1]">Pending OPs</span>
        </div>
        <div className="bg-white rounded-[20px] p-4 flex flex-col gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <span className="text-[24px] font-black text-emerald-500">—</span>
          <span className="text-[12px] font-bold text-gray-500">Completed</span>
        </div>
        <div className="bg-white rounded-[20px] p-4 flex flex-col gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
          <span className="text-[24px] font-black text-indigo-500">—</span>
          <span className="text-[12px] font-bold text-gray-500">Video Calls</span>
        </div>
      </div>

      {/* Book Marketing Tile */}
      <div 
        onClick={() => navigate('/book-marketing')}
        className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[20px] p-6 md:p-8 flex items-center justify-between cursor-pointer shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition-all active:scale-[0.98] min-h-[110px]"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
            <Megaphone className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-white font-bold text-[18px] md:text-[20px]">Book Marketing</h3>
            <p className="text-indigo-100 text-[13px] md:text-[14px] font-medium leading-tight max-w-[200px]">Request admin for marketing support</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Today's Schedule Feed */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[17px] font-bold text-[#0A1A3D] tracking-tight">
            Today's Schedule
          </h3>
          <button 
            onClick={() => navigate('/doctor/ops')}
            className="text-[#1B5DF1] text-[13px] font-bold"
          >
            View All
          </button>
        </div>
        
        <div className="flex flex-col bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          {todaySchedule.length === 0 ? (
            <EmptyState icon={Calendar} title="No Schedule" description="Today's schedule will appear here once available." />
          ) : todaySchedule.map((patient, index) => (
            <div 
              key={patient.id} 
              onClick={() => navigate(patient.category === 'VIDEO' ? '/doctor/video-consultations' : '/doctor/ops')}
              className={cn(
                "p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors",
                index !== todaySchedule.length - 1 ? "border-b border-gray-100" : ""
              )}
            >
              <div className="flex flex-col items-center min-w-[50px] pt-0.5">
                <span className="text-[14px] font-black text-[#0A1A3D]">{patient.time}</span>
                <span className="text-[10px] font-bold text-[#667085]">{patient.period}</span>
              </div>
              
              <div className="flex flex-col flex-1">
                <span className="font-bold text-[#0A1A3D] text-[15px]">{patient.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12px] font-semibold text-gray-500 flex items-center gap-1">
                    {patient.category === 'VIDEO' ? <Video className="w-3.5 h-3.5 text-indigo-500" /> : <Stethoscope className="w-3.5 h-3.5 text-[#1B5DF1]" />}
                    {patient.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[12px] font-medium text-gray-500">{patient.type}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md", getStatusStyle(patient.status, patient.category))}>
                  {patient.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Video Consultation Preview */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[17px] font-bold text-[#0A1A3D] tracking-tight">
            Video Consultations
          </h3>
          <button 
            onClick={() => navigate('/doctor/video-consultations')}
            className="text-indigo-600 text-[13px] font-bold"
          >
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {upcomingVideos.length === 0 ? (
            <EmptyState icon={Video} title="No Video Consultations" description="Upcoming video consultations will appear here once available." />
          ) : upcomingVideos.map((video) => (
            <div key={video.id} className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-[20px] flex items-center justify-between shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {video.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-[#0A1A3D] flex items-center gap-1.5">
                    {video.time} <span className="text-gray-400 font-medium">·</span> {video.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[12px] font-medium text-gray-500">ID {video.mqId}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[12px] font-medium text-gray-500">{video.type}</span>
                  </div>
                  <span className={cn(
                    "text-[12px] font-bold mt-1.5",
                    video.status.includes('Starts') ? "text-indigo-600" : "text-gray-500"
                  )}>
                    {video.status}
                  </span>
                </div>
              </div>

              {video.status.includes('Starts') && (
                <button 
                  onClick={() => navigate('/doctor/video-consultations')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Join
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
