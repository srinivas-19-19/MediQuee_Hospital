import { ArrowLeft, User, Phone, Calendar, Activity, Clock, FileCheck, Download } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import { ConditionLabel } from "@/components/shared/ConditionLabel"
import { EmptyState } from "../components/ui/EmptyState"

export function PatientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'reports'>('overview');

  // Patient record comes from the backend (GET /api/patients/:id). Null until connected.
  type PatientRecord = {
    id: string; name: string; age: string; gender: string; phone: string;
    bloodGroup: string; weight: string; height: string; allergies: string; lastVisit: string;
  };
  const [patient] = useState<PatientRecord | null>(null);

  // Visit history & reports come from the backend. Empty until connected.
  const visits: { date: string; doctor: string; diagnosis: string; status: string }[] = [];
  const reports: { name: string; date: string; type: string; size: string }[] = [];

  if (!patient) {
    return (
      <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-80px)]">
        <div className="bg-white px-4 pt-4 pb-4 shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={User}
            title="Patient Unavailable"
            description={`Details for patient #${id} will appear here once available.`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-80px)] pb-20">
      
      {/* Top Section / Profile Card */}
      <div className="bg-white px-4 pt-4 pb-6 rounded-b-3xl shadow-sm z-10 relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">ID: #{patient.id}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 border-4 border-white shadow-lg flex items-center justify-center text-blue-500 mb-4">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{patient.age} • {patient.gender} • {patient.bloodGroup}</p>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-semibold text-sm hover:bg-primary/20 transition-colors">
              <Phone className="w-4 h-4" /> Call
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
              <Calendar className="w-4 h-4" /> Book Appt
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4 sticky top-0 bg-gray-50 z-20">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'history' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex flex-col gap-4">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between">
              <div className="flex flex-col items-center justify-center flex-1 border-r border-gray-100">
                <span className="text-xs text-gray-500 mb-1">Weight</span>
                <span className="font-bold text-gray-800">{patient.weight}</span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1 border-r border-gray-100">
                <span className="text-xs text-gray-500 mb-1">Height</span>
                <span className="font-bold text-gray-800">{patient.height}</span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <span className="text-xs text-gray-500 mb-1">Allergies</span>
                <span className="font-bold text-orange-500">{patient.allergies}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Vitals Summary
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Vitals summary will appear here once available.
              </p>
            </div>
            
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            {visits.length === 0 ? (
              <EmptyState icon={Clock} title="No Visit History" description="Past visits will appear here once available." />
            ) : visits.map((visit, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <ConditionLabel name={visit.diagnosis} textClassName="font-bold text-gray-800 text-base" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">{visit.doctor}</span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {visit.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{visit.date}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            {reports.length === 0 ? (
              <EmptyState icon={FileCheck} title="No Reports" description="Lab reports will appear here once available." />
            ) : reports.map((report, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <ConditionLabel name={report.name} textClassName="font-bold text-gray-800 text-base truncate" />
                  <p className="text-xs text-gray-500 mt-1">{report.date} • {report.size}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  )
}
