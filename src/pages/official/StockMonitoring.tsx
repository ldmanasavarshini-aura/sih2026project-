import React from 'react';
import { useHealthData } from '../../context/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  PackageCheck,
  AlertTriangle,
  Lock,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const StockMonitoring: React.FC = () => {
  const { stocks, facilities } = useHealthData();

  const stockOuts = stocks.filter((s) => s.status === 'Unavailable');
  const lowStocks = stocks.filter((s) => s.status === 'Low Stock');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">District Medicine & Diagnostic Stock Monitoring</h1>
            <p className="text-xs text-slate-500">Facility-by-facility inventory levels, stock-out alerts, & shortage analytics</p>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {stockOuts.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900 mb-0.5">Critical Stock-Out Alert ({stockOuts.length} Item)</p>
            <p className="text-red-800 leading-relaxed">
              {stockOuts.map((s) => `${s.itemName} at ${s.facilityName}`).join(', ')} reported 0 quantity on hand. Requisition dispatched.
            </p>
          </div>
        </div>
      )}

      {/* Stock Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700">Facility Inventory Availability Matrix</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-600" /> View Only
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-4 font-bold">Item Name</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Facility Location</th>
                <th className="p-4 font-bold">Quantity On Hand</th>
                <th className="p-4 font-bold">Stock Status</th>
                <th className="p-4 font-bold text-right">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stocks.map((stk) => (
                <tr key={stk.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{stk.itemName}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {stk.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">{stk.facilityName}</td>
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {stk.quantityOnHand} {stk.unit}
                  </td>
                  <td className="p-4">
                    <StatusBadge type="stock" status={stk.status} />
                  </td>
                  <td className="p-4 text-right text-slate-400 font-mono text-[11px]">{stk.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
