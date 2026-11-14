import React, { useState } from 'react';
import { Users, CalendarCheck, HardHat, ChevronsLeft, ChevronsRight, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`min-h-screen bg-white border-r border-slate-100 flex flex-col justify-between p-4 shrink-0 transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className={`flex items-center pb-6 border-b border-slate-100 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-amber-200 shrink-0">
              <HardHat size={20} />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">LABOUR MS</h2>
                <p className="text-[11px] text-slate-400">Site Management & Payroll</p>
              </div>
            )}
          </div>

          {/* Working Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="mt-6">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </span>
          )}
          <nav className="mt-2 space-y-1">
            {/* View 1: Labour Directory */}
            <button
              onClick={() => setActiveTab('labours')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'labours'
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Labour Directory"
            >
              <Users size={18} className="shrink-0" />
              {!isCollapsed && <span>Labour Directory</span>}
            </button>

            {/* View 2: Attendance & Wages */}
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Attendance & Wages"
            >
              <CalendarCheck size={18} className="shrink-0" />
              {!isCollapsed && <span>Attendance & Wages</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Supervisor Profile Card */}
      <div className={`pt-4 border-t border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            SS
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Site Supervisor</p>
              <span className="text-[10px] text-slate-400">Administrator</span>
            </div>
          )}
        </div>
        {!isCollapsed && <ShieldCheck size={16} className="text-emerald-500" />}
      </div>
    </aside>
  );
};

export default Sidebar;