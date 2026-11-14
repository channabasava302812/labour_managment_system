import React from 'react';
import { Users, UserCheck, Clock, IndianRupee } from 'lucide-react';

const BffSummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Onboarded */}
      <div className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={20} />
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Active Registry
          </span>
        </div>
        <div className="my-3">
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">{summary.totalLabours || 0}</h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Total Onboarded Labours</p>
        </div>
        <div className="pt-2 border-t border-slate-50 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Across all construction trades</span>
        </div>
      </div>

      {/* Card 2: Present Today */}
      <div className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            On Site
          </span>
        </div>
        <div className="my-3">
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">{summary.presentCount || 0}</h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Present Today</p>
        </div>
        <div className="pt-2 border-t border-slate-50 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Full-day shift confirmed</span>
        </div>
      </div>

      {/* Card 3: Half-Day / Absent */}
      <div className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            Shift Logs
          </span>
        </div>
        <div className="my-3">
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">
            {summary.halfDayCount || 0}{' '}
            <span className="text-slate-400 text-base font-normal">/ {summary.absentCount || 0} Abs</span>
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Half-Day / Absent Today</p>
        </div>
        <div className="pt-2 border-t border-slate-50 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{summary.unmarkedCount || 0} unrecorded workers</span>
        </div>
      </div>

      {/* Card 4: Daily Wage Liability */}
      <div className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <IndianRupee size={20} />
          </div>
          <span className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
            Calculated
          </span>
        </div>
        <div className="my-3">
          <h3 className="text-3xl font-bold tracking-tight text-slate-800">
            ₹{summary.totalDailyWages?.toLocaleString() || 0}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Total Daily Wage Payout</p>
        </div>
        <div className="pt-2 border-t border-slate-50 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span>Auto-computed from attendance</span>
        </div>
      </div>
    </div>
  );
};

export default BffSummaryCards;