import React, { useState } from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import {
  TestTube,
  FileText,
  AlertCircle,
  Eye,
  X,
  CheckCircle2,
  Lock,
  Stethoscope
} from 'lucide-react';

export const CitizenTestResults: React.FC = () => {
  const { testResults, patients } = useHealthData();
  const patient = patients.find((p) => p.id === 'SS-PT-10021') || patients[0];
  const patientTests = testResults.filter((t) => t.patientId === patient.id);

  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center">
            <TestTube className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Diagnostic Test Reports</h1>
            <p className="text-xs text-slate-500">Public healthcare laboratory results & screening summaries</p>
          </div>
        </div>
      </div>

      {/* Clinical Guidance Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900 flex items-start gap-3">
        <Stethoscope className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-900 mb-0.5">Medical Results Guidance Note</p>
          <p className="text-blue-800 leading-relaxed">
            Discuss all laboratory test results with a qualified health professional or your assigned ASHA health worker. Do not alter prescribed treatments independently based on raw laboratory values.
          </p>
        </div>
      </div>

      {/* Test Results List */}
      <div className="space-y-3">
        {patientTests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No diagnostic tests recorded.
          </div>
        ) : (
          patientTests.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-500 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{t.id}</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {t.category}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {t.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{t.testName}</h3>
                <p className="text-xs text-slate-600 font-semibold">{t.resultSummary}</p>
                <p className="text-[11px] text-slate-400">
                  Facility: {t.facility} • Lab Tech: {t.labTechnician} • Date: {t.resultDate}
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(t)}
                className="py-2 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-teal-200 transition-all shadow-2xs shrink-0"
              >
                <Eye className="w-4 h-4 text-teal-700" />
                <span>View Full Report</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                LAB
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedReport.testName}</h3>
                <p className="text-xs text-slate-500">{selectedReport.facility}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 my-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Patient Name:</span>
                <span className="font-bold text-slate-900">{selectedReport.patientName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Test Category:</span>
                <span className="font-bold text-slate-900">{selectedReport.category}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Test Result Summary</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedReport.resultSummary}</p>
                {selectedReport.normalRange && (
                  <p className="text-[11px] text-slate-500 mt-1">Normal Reference Range: {selectedReport.normalRange}</p>
                )}
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Sample Date: {selectedReport.sampleCollectedDate}</span>
                <span>Report Date: {selectedReport.resultDate}</span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 text-xs mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Digital Laboratory Certificate</span>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs"
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
