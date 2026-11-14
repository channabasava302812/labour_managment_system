import React from 'react';
import { LogOut, HardHat } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Supervisor Portal — Real-time Workforce Active</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition cursor-pointer active:scale-95"
        >
          <LogOut size={14} />
          Logout
        </button>

        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
          SS
        </div>
      </div>
    </header>
  );
};

export default Navbar;