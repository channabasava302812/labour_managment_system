import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Filter, Trash2, Phone, Briefcase, IndianRupee } from 'lucide-react';
import { fetchLabours, onboardLabour, deleteLabour } from '../../services/api';
import OnboardModal from './OnboardModal';

const SKILLS = ['ALL', 'Mason', 'Electrician', 'Carpenter', 'Welder', 'Plumber', 'Painter', 'Helper'];

const LabourDirectory = ({ onDataChange }) => {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const loadLabours = async () => {
    setLoading(true);
    try {
      const res = await fetchLabours({ search, skill: skillFilter });
      setLabours(res.data);
    } catch (err) {
      console.error('Error fetching labours', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabours();
  }, [search, skillFilter]);

  const handleOnboard = async (formData) => {
    try {
      await onboardLabour(formData);
      setMessage('Labour onboarded successfully!');
      setIsModalOpen(false);
      loadLabours();
      if (onDataChange) onDataChange();
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to onboard labour');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove worker "${name}"?`)) {
      try {
        await deleteLabour(id);
        setMessage('Labour removed successfully!');
        loadLabours();
        if (onDataChange) onDataChange();
        setTimeout(() => setMessage(''), 3500);
      } catch (err) {
        alert('Failed to remove labour');
      }
    }
  };

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>✅ {message}</span>
          <button onClick={() => setMessage('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search by worker name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter size={14} className="text-slate-400" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs"
            >
              {SKILLS.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Skills / Trades' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-amber-200 transition active:scale-95 cursor-pointer"
        >
          <UserPlus size={15} />
          Onboard New Labour
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Labour Name</th>
                <th className="py-3.5 px-4">Trade / Skill</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4 text-center">Daily Wage Rate</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">Loading worker directory...</td>
                </tr>
              ) : labours.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">No labours found. Click "Onboard New Labour" to add workers.</td>
                </tr>
              ) : (
                labours.map((labour) => (
                  <tr key={labour.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {labour.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{labour.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: LAB-{labour.id.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        <Briefcase size={12} className="text-slate-400" />
                        {labour.skill}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400" />
                        {labour.phone}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-800 text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        ₹{Number(labour.dailyWage).toLocaleString()} / day
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {labour.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(labour.id, labour.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove worker"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OnboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleOnboard}
      />
    </div>
  );
};

export default LabourDirectory;