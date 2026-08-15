import { Bell, BellOff, ArrowRight } from "lucide-react"
import { useState } from "react"

export function Notifications() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 min-h-[calc(100vh-80px)] pb-24 transition-colors">
      <div className="p-4 flex flex-col gap-6">
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Notifications</h2>

          <div className="flex flex-col gap-4">
            
            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">Push Notifications</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Receive alerts on your device</span>
                </div>
              </div>
              
              <button 
                onClick={() => setEnabled(!enabled)}
                className={`w-14 h-8 rounded-full p-1 transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div 
                  className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {/* Notification History */}
            <div className="flex flex-col gap-2 mt-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
              
              <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">New Appointment</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rahul Sharma booked an OP consultation.</span>
                </div>
                <div className="text-xs font-semibold text-gray-400">2h ago</div>
              </div>
              
              <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">System Update</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">App successfully updated to v1.2</span>
                </div>
                <div className="text-xs font-semibold text-gray-400">1d ago</div>
              </div>
              
              <button className="w-full flex items-center justify-center p-4 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 text-primary font-medium text-sm transition-colors group">
                View All History
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
