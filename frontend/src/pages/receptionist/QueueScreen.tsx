import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueueStateMachine } from '../../services/useQueueStateMachine';
import { type QueueStatus, receptionistApi } from '../../services/receptionistApi';
import { BottomSheet } from '../../components/ui/BottomSheet';

export function QueueScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>(searchParams.get('dept') || '');
  const [isDeptSheetOpen, setIsDeptSheetOpen] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<any>(null);

  const { queue, updateStatus, isValidTransition } = useQueueStateMachine(selectedDept || undefined);

  useEffect(() => {
    receptionistApi.getDepartments().then(setDepartments);
  }, []);

  const handleDeptSelect = (deptId: string) => {
    setSelectedDept(deptId);
    setSearchParams(deptId ? { dept: deptId } : {});
    setIsDeptSheetOpen(false);
  };

  const getStatusColor = (status: QueueStatus) => {
    switch (status) {
      case 'ARRIVED': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'WAITING': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'CALLED': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'IN_CONSULTATION': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'COMPLETED': return 'text-gray-600 bg-gray-50 border-gray-100';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPrimaryAction = (status: QueueStatus) => {
    switch (status) {
      case 'ARRIVED': return { label: 'Move to Waiting', next: 'WAITING' };
      case 'WAITING': return { label: 'Call Patient', next: 'CALLED' };
      case 'CALLED': return { label: 'Start Consultation', next: 'IN_CONSULTATION' };
      case 'IN_CONSULTATION': return { label: 'Complete', next: 'COMPLETED' };
      default: return null;
    }
  };

  // Fake data if queue is empty because API is not returning real data yet
  const displayQueue = queue.length > 0 ? queue : [
    { id: 'q1', token: 'OP-103', patientName: 'Rahul Kumar', departmentName: 'General Medicine', doctorName: 'Dr. Sharma', arrivalTime: '10:15 AM', status: 'IN_CONSULTATION' as QueueStatus },
    { id: 'q2', token: 'OP-104', patientName: 'Priya Patel', departmentName: 'General Medicine', doctorName: 'Dr. Sharma', arrivalTime: '10:30 AM', status: 'CALLED' as QueueStatus },
    { id: 'q3', token: 'OP-105', patientName: 'Amit Singh', departmentName: 'General Medicine', doctorName: 'Dr. Verma', arrivalTime: '10:45 AM', status: 'WAITING' as QueueStatus },
    { id: 'q4', token: 'OP-106', patientName: 'Sneha Reddy', departmentName: 'General Medicine', doctorName: 'Dr. Verma', arrivalTime: '11:00 AM', status: 'ARRIVED' as QueueStatus },
  ].filter(q => selectedDept ? q.departmentName === departments.find(d => d.id === selectedDept)?.name : true);

  const waitingCount = displayQueue.filter(q => q.status === 'WAITING' || q.status === 'ARRIVED').length;
  const calledCount = displayQueue.filter(q => q.status === 'CALLED').length;
  const inConsultCount = displayQueue.filter(q => q.status === 'IN_CONSULTATION').length;

  return (
    <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-80px)] pb-24 relative">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/receptionist')} className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-[18px] font-bold text-gray-900">OP Queue</h1>
          </div>
          <button 
            onClick={() => setIsDeptSheetOpen(true)}
            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-semibold text-gray-700 active:bg-gray-100 transition-colors"
          >
            {selectedDept ? departments.find(d => d.id === selectedDept)?.name : 'All Depts'}
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Summary Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex flex-col shrink-0 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-100">
            <span className="text-[10px] font-bold uppercase text-orange-600 mb-0.5">Waiting</span>
            <span className="text-sm font-black text-orange-700">{waitingCount}</span>
          </div>
          <div className="flex flex-col shrink-0 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-[10px] font-bold uppercase text-blue-600 mb-0.5">Called</span>
            <span className="text-sm font-black text-blue-700">{calledCount}</span>
          </div>
          <div className="flex flex-col shrink-0 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-[10px] font-bold uppercase text-emerald-600 mb-0.5">In Consult</span>
            <span className="text-sm font-black text-emerald-700">{inConsultCount}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {displayQueue.map((item, i) => {
          const action = getPrimaryAction(item.status);
          
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedQueueItem(item)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="p-4 flex items-start justify-between border-b border-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getStatusColor(item.status)}`}>
                    <span className="font-black tracking-tight">{item.token.split('-')[1]}</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-[16px] text-gray-900">{item.patientName}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{item.departmentName} • {item.doctorName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">Arr: {item.arrivalTime}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
              </div>
              
              {action && (
                <div className="bg-gray-50 px-4 py-3 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(item.id, action.next as QueueStatus);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
                  >
                    {action.label} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <BottomSheet isOpen={isDeptSheetOpen} onClose={() => setIsDeptSheetOpen(false)}>
        <div className="p-4 pb-8 flex flex-col gap-2">
          <h2 className="text-lg font-bold mb-2">Select Department</h2>
          <button 
            onClick={() => handleDeptSelect('')}
            className={`p-4 rounded-xl text-left font-semibold ${!selectedDept ? 'bg-blue-50 text-primary border border-blue-100' : 'bg-gray-50 text-gray-700 border border-transparent'}`}
          >
            All Departments
          </button>
          {departments.map(dept => (
            <button 
              key={dept.id}
              onClick={() => handleDeptSelect(dept.id)}
              className={`p-4 rounded-xl text-left font-semibold ${selectedDept === dept.id ? 'bg-blue-50 text-primary border border-blue-100' : 'bg-gray-50 text-gray-700 border border-transparent hover:bg-gray-100'}`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Action Sheet for specific queue item */}
      <BottomSheet isOpen={!!selectedQueueItem} onClose={() => setSelectedQueueItem(null)}>
        {selectedQueueItem && (
          <div className="p-5 pb-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{selectedQueueItem.token}</span>
                <h2 className="text-xl font-bold text-gray-900">{selectedQueueItem.patientName}</h2>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${getStatusColor(selectedQueueItem.status)}`}>
                {selectedQueueItem.status}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Update Status</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {['ARRIVED', 'WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED'].map((status) => {
                  const isValid = isValidTransition(selectedQueueItem.status, status as QueueStatus);
                  const isCurrent = selectedQueueItem.status === status;
                  return (
                    <button
                      key={status}
                      disabled={!isValid && !isCurrent}
                      onClick={() => {
                        updateStatus(selectedQueueItem.id, status as QueueStatus);
                        setSelectedQueueItem(null);
                      }}
                      className={`p-3 rounded-xl border text-left font-semibold text-sm transition-all ${
                        isCurrent ? 'bg-blue-50 border-primary text-primary shadow-sm ring-1 ring-primary/20' :
                        isValid ? 'bg-white border-gray-200 text-gray-700 hover:border-primary active:bg-gray-50' : 
                        'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>

              {isValidTransition(selectedQueueItem.status, 'CANCELLED') && (
                <button 
                  onClick={() => {
                    updateStatus(selectedQueueItem.id, 'CANCELLED');
                    setSelectedQueueItem(null);
                  }}
                  className="mt-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl font-semibold text-sm"
                >
                  Cancel OP
                </button>
              )}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
