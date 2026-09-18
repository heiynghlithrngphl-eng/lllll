import React, { useState } from 'react';
import {
  Layers,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  X,
  Cpu,
  Zap,
  DoorOpen,
  ScreenShare
} from 'lucide-react';
import { Room, RoomId, SeatItem, Booking, User } from '../types';

interface FloorPlanViewProps {
  rooms: Room[];
  bookings?: Booking[];
  currentUser?: User;
  initialRoomId?: RoomId;
  onBookSeat?: (roomId: RoomId, seatId: string) => void;
  onBookRoom?: (roomId: RoomId) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  rooms,
  bookings,
  currentUser,
  initialRoomId = '311',
  onBookSeat,
  onBookRoom,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>(initialRoomId);
  const [selectedSeat, setSelectedSeat] = useState<SeatItem | null>(null);

  const room = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const availableCount = room.seats.filter((s) => s.status === 'available').length;
  const reservedCount = room.seats.filter((s) => s.status === 'reserved').length;
  const maintenanceCount = room.seats.filter((s) => s.status === 'maintenance').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Room Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            แผนผังห้องปฏิบัติการ Interactive (Live Floor Plan)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            คลิกเลือกโต๊ะคอมพิวเตอร์เพื่อดูข้อมูลสเปก และกดจองที่นั่งได้ทันที
          </p>
        </div>

        {/* Room Tab Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start md:self-center">
          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRoomId(r.id);
                setSelectedSeat(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoomId === r.id
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ห้อง {r.id}
            </button>
          ))}
        </div>
      </div>

      {/* Legend and Room Overview Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {room.name}
          </span>
          <span className="text-xs text-slate-500">
            (ทั้งหมด {room.computersCount} เครื่อง)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-xs"></span>
            <span className="text-slate-700 dark:text-slate-300">ว่างพร้อมใช้ ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-xs"></span>
            <span className="text-slate-700 dark:text-slate-300">มีการจองแล้ว ({reservedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500 shadow-xs"></span>
            <span className="text-slate-700 dark:text-slate-300">แจ้งซ่อม ({maintenanceCount})</span>
          </div>
        </div>
      </div>

      {/* Interactive Floor Plan Stage */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* Front of Room: Projector Screen & Teacher Podium */}
        <div className="relative z-10 max-w-2xl mx-auto mb-10 text-center space-y-3">
          {/* 4K Laser Screen */}
          <div className="h-9 rounded-xl bg-gradient-to-r from-blue-900/80 via-cyan-900/80 to-blue-900/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold tracking-wider shadow-lg shadow-cyan-500/10">
            <ScreenShare className="w-4 h-4 mr-2" />
            จอโปรเจกเตอร์ 4K Laser & Smart Interactive Board 86" (ด้านหน้าห้อง)
          </div>

          {/* Teacher Desk */}
          <div className="w-48 mx-auto py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-2 shadow-md">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>โต๊ะควบคุมครูผู้สอน</span>
          </div>
        </div>

        {/* Room Entrance Door (Left side) */}
        <div className="absolute top-10 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-mono">
          <DoorOpen className="w-4 h-4 text-emerald-400" />
          <span>ประตูทางเข้า (จุดสแกน QR)</span>
        </div>

        {/* Computer Workstation Grid */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 justify-items-center">
            {room.seats.map((seat) => {
              const isSelected = selectedSeat?.id === seat.id;
              let statusBg = 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-emerald-300';
              let badgeColor = 'bg-emerald-500';

              if (seat.status === 'reserved') {
                statusBg = 'bg-amber-950/40 border-amber-800/80 text-amber-200 cursor-pointer';
                badgeColor = 'bg-amber-500';
              } else if (seat.status === 'maintenance') {
                statusBg = 'bg-rose-950/40 border-rose-800/80 text-rose-300 cursor-not-allowed';
                badgeColor = 'bg-rose-500';
              } else {
                statusBg = 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200 hover:bg-emerald-900/50 cursor-pointer';
              }

              if (isSelected) {
                statusBg = 'bg-cyan-500 border-cyan-400 text-white ring-4 ring-cyan-500/30 scale-105 shadow-lg';
              }

              return (
                <button
                  key={seat.id}
                  onClick={() => setSelectedSeat(seat)}
                  className={`group relative w-14 sm:w-16 h-14 sm:h-16 rounded-2xl border flex flex-col items-center justify-center p-1 transition-all duration-200 ${statusBg}`}
                >
                  <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${badgeColor}`}></span>
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 mb-1 opacity-90 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-tight">
                    {seat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Back of the room indicator */}
        <div className="relative z-10 text-center mt-10 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-500">
          — ด้านหลังห้องปฏิบัติการ {room.id} (ตู้จัดเก็บอุปกรณ์ & ปลั๊กไฟส่วนกลาง) —
        </div>
      </div>

      {/* Selected Computer Info Drawer / Modal */}
      {selectedSeat && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-cyan-500/40 dark:border-cyan-500/30 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    สถานะเครื่อง {selectedSeat.name} (ห้อง {selectedRoomId})
                  </h3>
                  {selectedSeat.status === 'available' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      ว่างพร้อมใช้งาน
                    </span>
                  )}
                  {selectedSeat.status === 'reserved' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      มีการจองไว้แล้ว
                    </span>
                  )}
                  {selectedSeat.status === 'maintenance' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      แจ้งซ่อมบำรุง
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  แถวที่ {selectedSeat.row} คอลัมน์ที่ {selectedSeat.col}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSeat(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Computer Specs Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">หน่วยประมวลผล (CPU)</span>
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{room.specs.cpu}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">การ์ดจอ & แรม (GPU / RAM)</span>
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{room.specs.gpu} • {room.specs.ram}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">จอแสดงผล (Monitor)</span>
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{room.specs.monitors}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {selectedSeat.status === 'available' ? (
              <button
                onClick={() => {
                  if (onBookSeat) onBookSeat(selectedRoomId, selectedSeat.id);
                  if (onBookRoom) onBookRoom(selectedRoomId);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>จองเครื่องนี้และห้อง {selectedRoomId} ทันที</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500">
                {selectedSeat.status === 'maintenance'
                  ? 'เครื่องนี้อยู่ในระหว่างการซ่อมบำรุง ไม่สามารถเลือกจองได้'
                  : 'เครื่องนี้มีการจองไว้แล้วในรอบปัจจุบัน'}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
