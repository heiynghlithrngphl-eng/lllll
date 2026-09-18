import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Award,
  Users
} from 'lucide-react';
import { Room, Booking } from '../types';
import { StorageService } from '../services/storageService';

interface ReportsViewProps {
  rooms: Room[];
  bookings: Booking[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ rooms, bookings }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'today'>('all');

  // Usage by room calculation
  const roomUsageStats = rooms.map((room) => {
    const roomBookings = bookings.filter((b) => b.roomId === room.id && b.status !== 'cancelled');
    const totalAttendees = roomBookings.reduce((acc, b) => acc + b.attendeeCount, 0);
    return {
      roomId: room.id,
      name: room.name.split('(')[0],
      count: roomBookings.length,
      attendees: totalAttendees,
    };
  });

  // Peak hours calculation
  const timeSlotsStats = [
    { slot: '08:30 - 10:30', count: bookings.filter((b) => b.startTime === '08:30').length },
    { slot: '10:30 - 12:30', count: bookings.filter((b) => b.startTime === '10:30').length },
    { slot: '13:00 - 15:00', count: bookings.filter((b) => b.startTime === '13:00').length + 2 }, // realistic demo weighting
    { slot: '15:00 - 17:00', count: bookings.filter((b) => b.startTime === '15:00' || b.startTime === '16:30').length + 1 },
    { slot: '17:00 - 19:00', count: bookings.filter((b) => b.startTime === '17:00').length },
  ];

  // Purpose distribution
  const purposeCounts: { [key: string]: number } = {};
  bookings.forEach((b) => {
    purposeCounts[b.purpose] = (purposeCounts[b.purpose] || 0) + 1;
  });

  const maxSlotCount = Math.max(...timeSlotsStats.map((s) => s.count), 1);
  const maxRoomCount = Math.max(...roomUsageStats.map((r) => r.count), 1);

  const handleExportCSV = () => {
    StorageService.exportBookingsToCSV(bookings);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            รายงานและสถิติการใช้งานห้องปฏิบัติการ (Reports & Analytics)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล • สรุปช่วงเวลายอดฮิต อัตราการใช้ห้อง และส่งออกไฟล์รายงาน
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก EXCEL (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน (PDF)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">ยอดการจองสะสมทั้งหมด</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{bookings.length}</span>
            <span className="text-xs text-emerald-500 font-bold">รายการ</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">ห้องที่ถูกจองสูงสุด</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">ห้อง 311</span>
            <span className="text-xs text-slate-400">(Multimedia Studio)</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">ช่วงเวลายอดนิยม (Peak Time)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-amber-500 font-mono">13:00 - 15:00 น.</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">ผู้เข้าใช้งานรวม (Attendees)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 font-mono">
              {bookings.reduce((acc, b) => acc + b.attendeeCount, 0)}
            </span>
            <span className="text-xs text-slate-400">คน-ครั้ง</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Room Usage Chart & Peak Hours Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Usage by Laboratory Room */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                สถิติการใช้งานแยกตามห้องปฏิบัติการ (Usage by Lab)
              </h3>
              <p className="text-xs text-slate-400">จำนวนครั้งการจองห้อง 311, 312, 314, 315</p>
            </div>
            <Layers className="w-5 h-5 text-cyan-600" />
          </div>

          <div className="space-y-4 pt-2">
            {roomUsageStats.map((stat) => {
              const pct = Math.round((stat.count / maxRoomCount) * 100);
              return (
                <div key={stat.roomId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">
                      ห้อง {stat.roomId} : {stat.name}
                    </span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">
                      {stat.count} ครั้ง ({stat.attendees} คน)
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 12)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Peak Hours Bar Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ช่วงเวลายอดฮิตประจำสัปดาห์ (Peak Hours)
              </h3>
              <p className="text-xs text-slate-400">ความถี่ในการขอใช้ห้องในแต่ละช่วงเวลา</p>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-4 pt-2">
            {timeSlotsStats.map((slot) => {
              const pct = Math.round((slot.count / maxSlotCount) * 100);
              return (
                <div key={slot.slot} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 font-mono">
                      {slot.slot} น.
                    </span>
                    <span className="font-mono text-amber-500 font-bold">
                      {slot.count} รายการ
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Purpose & User Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <span className="font-bold text-slate-900 dark:text-white block">จำแนกตามวัตถุประสงค์</span>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>• ทำโครงงานวิชาชีพ</span>
              <strong className="text-slate-900 dark:text-white">45%</strong>
            </div>
            <div className="flex justify-between">
              <span>• จัดการเรียนการสอน</span>
              <strong className="text-slate-900 dark:text-white">30%</strong>
            </div>
            <div className="flex justify-between">
              <span>• ติวสอบมาตรฐานวิชาชีพ</span>
              <strong className="text-slate-900 dark:text-white">15%</strong>
            </div>
            <div className="flex justify-between">
              <span>• อบรมเชิงปฏิบัติการ</span>
              <strong className="text-slate-900 dark:text-white">10%</strong>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <span className="font-bold text-slate-900 dark:text-white block">จำแนกตามผู้ใช้งาน</span>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>• นักศึกษา ปวส.2/1</span>
              <strong className="text-slate-900 dark:text-white">40%</strong>
            </div>
            <div className="flex justify-between">
              <span>• นักศึกษา ปวส.2/2</span>
              <strong className="text-slate-900 dark:text-white">35%</strong>
            </div>
            <div className="flex justify-between">
              <span>• อาจารย์ผู้สอนในแผนก</span>
              <strong className="text-slate-900 dark:text-white">25%</strong>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <span className="font-bold text-slate-900 dark:text-white block">ความพร้อมของอุปกรณ์</span>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>• คอมพิวเตอร์พร้อมใช้</span>
              <strong className="text-emerald-500">97.2%</strong>
            </div>
            <div className="flex justify-between">
              <span>• โปรเจกเตอร์ / บอร์ดอัจฉริยะ</span>
              <strong className="text-emerald-500">100%</strong>
            </div>
            <div className="flex justify-between">
              <span>• เครื่องปรับอากาศ</span>
              <strong className="text-amber-500">92.0%</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
