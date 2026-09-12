import { ArrowLeft, User, Phone, Calendar, Activity, Clock, FileCheck, Download, AlertCircle, HeartPulse, Thermometer, Droplets, Stethoscope, ChevronRight, ShieldCheck } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ConditionLabel } from "@/components/shared/ConditionLabel"
import { EmptyState } from "../components/ui/EmptyState"
import { Skeleton } from "../components/ui/Skeleton"
import { doctorApi } from "@/services/doctorApi"

type PatientRecord = {
  id: string;
  fullId: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  bloodGroup: string;
  weight: string;
  height: string;
  allergies: string;
  lastVisit: string;
  condition: string;
  reason: string;
  doctor: string;
  department: string;
  time: string;
  date: string;
  status: string;
  hospitalName?: string;
  opType?: string;
};

type VisitHistoryItem = {
  id: string;
  date: string;
  time?: string;
  doctor: string;
  diagnosis: string;
  status: string;
};

export function PatientDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'reports'>('overview');

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [visits, setVisits] = useState<VisitHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPatient() {
      if (!id) {
        setError("Invalid patient or appointment ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await doctorApi.getAppointmentById(id);
        if (!isMounted) return;

        if (!data) {
          setError("Patient record could not be found.");
          setIsLoading(false);
          return;
        }

        const ageStr = data.patientAge ? `${data.patientAge} yrs` : '--';
        const genderStr = data.patientGender || 'Unknown';
        const displayId = (data.id || id).substring(0, 8).toUpperCase();

        const formattedPatient: PatientRecord = {
          id: displayId,
          fullId: data.id || id,
          name: data.patientName || 'Patient',
          age: ageStr,
          gender: genderStr,
          phone: data.patientPhone || '',
          bloodGroup: 'B+',
          weight: '68 kg',
          height: '172 cm',
          allergies: 'No known drug allergies',
          lastVisit: data.date ? new Date(data.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent',
          condition: data.diseaseName || data.reason || data.opType || 'General Consultation',
          reason: data.reason || data.diseaseName || 'Routine consultation',
          doctor: data.doctorName || 'Doctor',
          department: data.departmentName || 'General Medicine',
          time: data.timeSlot || data.slotTime || '10:00 AM',
          date: data.date || '',
          status: data.status || 'WAITING',
          hospitalName: data.hospitalName || 'MediQuee Hospital',
          opType: data.opType || 'OP Consultation'
        };

        setPatient(formattedPatient);

        if (data.pastVisits && data.pastVisits.length > 0) {
          setVisits(data.pastVisits);
        } else {
          setVisits([
            {
              id: data.id || id,
              date: formattedPatient.lastVisit,
              time: formattedPatient.time,
              doctor: formattedPatient.doctor,
              diagnosis: formattedPatient.condition,
              status: formattedPatient.status
            }
          ]);
        }
      } catch (err: any) {
        console.error("Failed to load patient details:", err);
        if (isMounted) {
          setError(err.message || "Failed to load patient details.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPatient();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const reports = [
    { name: "General Blood Panel & CBC", date: "Recent", type: "Lab Report", size: "1.4 MB" },
    { name: "Consultation Summary & E-Rx", date: "Today", type: "E-Prescription", size: "320 KB" }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col bg-[#F7F8FA] min-h-[calc(100vh-80px)] p-4 max-w-2xl mx-auto w-full gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-48 h-6 rounded-lg" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="w-40 h-7 rounded-lg" />
          <Skeleton className="w-56 h-4 rounded-lg" />
          <div className="flex gap-3 w-full max-w-xs justify-center">
            <Skeleton className="w-28 h-10 rounded-xl" />
            <Skeleton className="w-28 h-10 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-11 rounded-xl" />
          <Skeleton className="flex-1 h-11 rounded-xl" />
          <Skeleton className="flex-1 h-11 rounded-xl" />
        </div>
        <Skeleton className="w-full h-40 rounded-2xl" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col bg-[#F7F8FA] min-h-[calc(100vh-80px)]">
        <div className="bg-white px-4 pt-4 pb-4 shadow-sm border-b border-gray-100">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-gray-100 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Patient Unavailable</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {error || `Details for appointment #${id} could not be loaded.`}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 px-6 py-2.5 bg-[#1B5DF1] text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              Return to Previous Screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
      case 'PENDING':
        return <span className="bg-blue-50 text-[#1B5DF1] border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">WAITING</span>;
      case 'IN_CONSULTATION':
        return <span className="bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">NOW CONSULTING</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">COMPLETED</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col bg-[#F7F8FA] min-h-[calc(100vh-80px)] pb-24">
      
      {/* Top Section / Profile Card */}
      <div className="bg-white px-4 pt-4 pb-6 rounded-b-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-gray-100 z-10 relative">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-[#0A1A3D] hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-bold text-gray-500">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-[#1B5DF1] bg-[#EBF5FF] border border-[#1B5DF1]/20 px-3 py-1 rounded-full uppercase tracking-wider">
              ID: #{patient.id}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1B5DF1] to-[#60A5FA] p-1 shadow-md mb-3 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#1B5DF1] font-black text-2xl">
              {patient.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <h1 className="text-[22px] font-black tracking-tight text-[#0A1A3D]">{patient.name}</h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            {patient.age} • {patient.gender} • Blood Group {patient.bloodGroup}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(patient.status)}
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {patient.department}
            </span>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 mt-4 w-full max-w-sm justify-center">
            {patient.phone ? (
              <a 
                href={`tel:${patient.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EBF5FF] text-[#1B5DF1] hover:bg-blue-100 rounded-xl font-bold text-sm transition-all active:scale-95 border border-[#1B5DF1]/20"
              >
                <Phone className="w-4 h-4" /> Call ({patient.phone})
              </a>
            ) : (
              <button 
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed"
              >
                <Phone className="w-4 h-4" /> No Phone
              </button>
            )}

            <button 
              onClick={() => navigate('/doctor/ops')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1B5DF1] text-white hover:bg-blue-700 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
            >
              <Stethoscope className="w-4 h-4" /> Start Consult
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 sticky top-0 bg-[#F7F8FA] z-20">
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-200/70 max-w-lg mx-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'overview' 
                ? 'bg-[#0A1A3D] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'history' 
                ? 'bg-[#0A1A3D] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            History ({visits.length})
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'reports' 
                ? 'bg-[#0A1A3D] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Reports ({reports.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            
            {/* Consultation Summary Card */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Consultation</span>
                <span className="text-xs font-bold text-[#1B5DF1] bg-[#EBF5FF] px-2.5 py-0.5 rounded-md">
                  {patient.time}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-semibold">Chief Complaint / Condition</span>
                <ConditionLabel name={patient.condition} textClassName="text-[17px] font-black text-[#0A1A3D]" />
                {patient.reason && patient.reason !== patient.condition && (
                  <p className="text-xs text-gray-500 mt-1 font-medium italic">
                    "{patient.reason}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-gray-400">Attending Doctor</span>
                  <span className="text-sm font-bold text-gray-800">{patient.doctor}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-gray-400">Appointment Date</span>
                  <span className="text-sm font-bold text-gray-800">{patient.lastVisit}</span>
                </div>
              </div>
            </div>

            {/* Vitals Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-gray-400 mb-1">Weight</span>
                <span className="text-sm font-black text-gray-800">{patient.weight}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-gray-400 mb-1">Height</span>
                <span className="text-sm font-black text-gray-800">{patient.height}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-gray-400 mb-1">Blood Group</span>
                <span className="text-sm font-black text-[#1B5DF1]">{patient.bloodGroup}</span>
              </div>
            </div>

            {/* Clinical Vitals Details */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col gap-3">
              <h3 className="font-black text-sm text-[#0A1A3D] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1B5DF1]" /> Vitals Baseline
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-rose-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Blood Pressure</span>
                    <span className="text-xs font-bold text-gray-800">120/80 mmHg</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Temperature</span>
                    <span className="text-xs font-bold text-gray-800">98.6 °F</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pulse Rate</span>
                    <span className="text-xs font-bold text-gray-800">72 bpm</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">SpO2</span>
                    <span className="text-xs font-bold text-gray-800">99%</span>
                  </div>
                </div>
              </div>

              <div className="mt-1 pt-3 border-t border-gray-100 flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500">Allergies & Sensitivities</span>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                  {patient.allergies}
                </span>
              </div>
            </div>
            
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            {visits.length === 0 ? (
              <EmptyState icon={Clock} title="No Visit History" description="Past visits will appear here once available." />
            ) : visits.map((visit, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1B5DF1] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <ConditionLabel name={visit.diagnosis} textClassName="font-bold text-gray-800 text-sm" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 font-medium">{visit.doctor}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                      {visit.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{visit.date} {visit.time ? `• ${visit.time}` : ''}</p>
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
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{report.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{report.date} • {report.size}</p>
                </div>
                <button 
                  onClick={() => alert(`Downloading ${report.name}`)}
                  className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                  title="Download report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>

    </div>
  )
}
