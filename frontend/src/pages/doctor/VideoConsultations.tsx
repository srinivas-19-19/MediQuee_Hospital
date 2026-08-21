import { Video, Phone, ShieldCheck, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function VideoConsultations() {
  const navigate = useNavigate();
  const upcomingCalls = [
    { id: 1, name: "Rahul Sharma", time: "09:00 AM", type: "Follow up", duration: "15 mins", status: "Waiting", avatar: "R" },
    { id: 2, name: "Anita Desai", time: "11:30 AM", type: "Initial Consult", duration: "30 mins", status: "Scheduled", avatar: "A" },
    { id: 3, name: "Vikram Singh", time: "02:00 PM", type: "Report Review", duration: "15 mins", status: "Scheduled", avatar: "V" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none md:p-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 px-1 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Telemedicine</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your virtual visits</p>
        </div>
      </div>

      {/* Featured Call / Waiting Room */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-indigo-200 text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm uppercase tracking-widest border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Patient Waiting
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-4 text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-bold border-2 border-white/20 shadow-xl">
              {upcomingCalls[0].avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{upcomingCalls[0].name}</h2>
              <p className="text-indigo-200 text-sm mt-1">{upcomingCalls[0].type} • Scheduled for {upcomingCalls[0].time}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
              <Video className="w-5 h-5" />
              Join Call
            </button>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        End-to-end encrypted consultations
      </div>

      {/* Upcoming List */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between mb-1 px-1">
          <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {upcomingCalls.slice(1).map(call => (
            <div key={call.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-purple-200 hover:shadow-md transition-all active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <span className="font-bold text-slate-900">{call.time.split(' ')[0]}</span>
                  <span className="text-xs font-semibold text-slate-500">{call.time.split(' ')[1]}</span>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">{call.name}</span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Video className="w-3 h-3" /> {call.type} • {call.duration}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
