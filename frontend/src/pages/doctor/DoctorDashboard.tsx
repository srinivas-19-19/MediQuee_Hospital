import { motion } from "framer-motion"
import { Calendar, Video, Clock, Users, ArrowRight, Activity, Phone } from "lucide-react"

export function DoctorDashboard() {
  const nextPatient = {
    name: "Rahul Sharma",
    time: "09:00 AM",
    type: "Follow up",
    status: "Waiting",
    avatar: "R"
  };

  const todayOPs = [
    { id: 2, name: "Priya Singh", time: "09:30 AM", type: "New Patient", status: "In Progress" },
    { id: 3, name: "Amit Kumar", time: "10:00 AM", type: "Report Review", status: "Scheduled" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none md:p-4 pb-8">
      {/* Hero / Next Patient */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="bg-blue-500/20 text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Up Next
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
              <Clock className="w-4 h-4" /> In 10 mins
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold border border-slate-700 shrink-0">
              {nextPatient.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{nextPatient.name}</h2>
              <p className="text-slate-400 text-sm">{nextPatient.time} • {nextPatient.type}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button className="flex-1 bg-white text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98]">
              Start Consult
            </button>
            <button className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors active:scale-[0.98]">
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Streamlined */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">24</span>
          </div>
          <p className="text-sm font-medium text-slate-500">Today's OPs</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">8</span>
          </div>
          <p className="text-sm font-medium text-slate-500">Video Consults</p>
        </div>
      </div>

      {/* Schedule Feed */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1 px-1">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Schedule</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        
        <div className="flex flex-col gap-2.5">
          {todayOPs.map(patient => (
            <div key={patient.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 font-bold flex items-center justify-center text-sm border border-slate-200">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 text-sm">{patient.name}</span>
                  <span className="text-xs text-slate-500">{patient.time} • {patient.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  patient.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {patient.status}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
