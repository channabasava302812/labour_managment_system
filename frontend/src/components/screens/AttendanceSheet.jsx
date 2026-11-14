import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, IndianRupee, Sun, Moon } from 'lucide-react';
import { fetchDailyAttendance, logAttendance } from '../../services/api';

const AttendanceSheet = ({ onDataChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadDailySheet = async () => {
    setLoading(true);
    try {
      const res = await fetchDailyAttendance(selectedDate);
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching attendance sheet', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailySheet();
  }, [selectedDate]);

  const handleStatusChange = async (labourId, newStatus, currentShift) => {
    try {
      await logAttendance({
        labourId,
        date: selectedDate,
        status: newStatus,
        shift: currentShift || 'DAY',
      });
      loadDailySheet();
      if (onDataChange) onDataChange();
      setMessage(`Attendance marked as ${newStatus} for Labour #${labourId}`);
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      alert('Failed to log attendance');
    }
  };

  const handleShiftChange = async (labourId, currentStatus, newShift) => {
    if (currentStatus === 'NOT_MARKED') return;
    try {
      await logAttendance({
        labourId,
        date: selectedDate,
        status: currentStatus,
        shift: newShift,
      });
      loadDailySheet();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert('Failed to update shift');
    }
  };

  // Compute daily totals
  const totalDailyPayout = records.reduce((acc, r) => acc + (r.calculatedWage || 0), 0);
  const totalPresent = records.filter((r) => r.status === 'PRESENT').length;
  const totalHalfDay = records.filter((r) => r.status === 'HALF_DAY').length;
  const totalAbsent = records.filter((r) => r.status === 'ABSENT').length;

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>✅ {message}</span>
          <button onClick={() => setMessage('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Date Bar & Daily Wage Summary Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar size={18} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Live Daily Calculations Banner */}
        <div className="flex items-center gap-5 text-xs">
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Attendance Counts</span>
            <span className="font-semibold text-slate-700">
              <strong className="text-emerald-600">{totalPresent}</strong> Present •{' '}
              <strong className="text-amber-600">{totalHalfDay}</strong> Half-Day •{' '}
              <strong className="text-rose-600">{totalAbsent}</strong> Absent
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-right bg-violet-50 px-3.5 py-1.5 rounded-xl border border-violet-100">
            <span className="text-violet-600 text-[10px] block uppercase font-bold">Calculated Day's Wages</span>
            <span className="text-base font-bold text-violet-900">
              ₹{totalDailyPayout.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Labour Details</th>
                <th className="py-3.5 px-4">Daily Wage Rate</th>
                <th className="py-3.5 px-4 text-center">Mark Daily Attendance</th>
                <th className="py-3.5 px-4 text-center">Shift</th>
                <th className="py-3.5 px-4 text-right">Computed Wage (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">Loading daily attendance sheet...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No active labours found. Onboard workers in Screen 1 first.</td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.labourId} className="hover:bg-slate-50/60 transition">
                    {/* Worker */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{r.name}</p>
                      <span className="text-[10px] text-slate-400">{r.skill}</span>
                    </td>

                    {/* Base Rate */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      ₹{r.dailyWage} / day
                    </td>

                    {/* Attendance Buttons: PRESENT (100%), HALF_DAY (50%), ABSENT (0%) */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(r.labourId, 'PRESENT', r.shift)}
                          className={`px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                            r.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          Present (100%)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(r.labourId, 'HALF_DAY', r.shift)}
                          className={`px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                            r.status === 'HALF_DAY'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock size={13} />
                          Half-Day (50%)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(r.labourId, 'ABSENT', r.shift)}
                          className={`px-3 py-1 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                            r.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle size={13} />
                          Absent (₹0)
                        </button>
                      </div>
                    </td>

                    {/* Shift Toggle: Day vs Night */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={r.shift || 'DAY'}
                        onChange={(e) => handleShiftChange(r.labourId, r.status, e.target.value)}
                        disabled={r.status === 'NOT_MARKED' || r.status === 'ABSENT'}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 disabled:opacity-40"
                      >
                        <option value="DAY">☀️ Day Shift</option>
                        <option value="NIGHT">🌙 Night Shift</option>
                      </select>
                    </td>

                    {/* Computed Salary / Wage */}
                    <td className="py-3 px-4 text-right">
                      {r.status === 'NOT_MARKED' ? (
                        <span className="text-slate-400 italic">Not Marked</span>
                      ) : (
                        <span className="font-bold text-sm text-slate-900 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
                          ₹{r.calculatedWage}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;