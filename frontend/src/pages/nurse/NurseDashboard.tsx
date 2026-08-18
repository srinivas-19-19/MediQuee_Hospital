import { motion } from "framer-motion"
import { Home, MapPin, Phone, CheckCircle, Clock } from "lucide-react"

export function NurseDashboard() {
  const stats = [
    { title: "Today's Bookings", value: "6", icon: Home, color: "text-blue-600 bg-blue-50" },
    { title: "In Progress", value: "1", icon: Clock, color: "text-orange-600 bg-orange-50" },
    { title: "Completed", value: "3", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  ];

  const upcomingVisits = [
    { id: 1, name: "Sneha Patel", time: "11:00 AM", service: "Post-op Care", address: "123 Park Street, City", status: "Next" },
    { id: 2, name: "Arun Verma", time: "02:00 PM", service: "Wound Dressing", address: "45 Lake View Apts", status: "Scheduled" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your home nursing bookings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Home Visits</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View Map</button>
          </div>
          <div className="flex flex-col gap-4">
            {upcomingVisits.map(visit => (
              <div key={visit.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 mt-1">
                    {visit.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-lg">{visit.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        visit.status === 'Next' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">{visit.service}</p>
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {visit.time}</span>
                      <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {visit.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
                    Start Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
