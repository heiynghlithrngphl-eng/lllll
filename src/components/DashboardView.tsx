import React, { useState } from 'react';
import {
  Monitor,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle,
  Flame,
  Check,
  Cpu,
  Tv,
  Wifi
} from 'lucide-react';
import { Room, Booking, User, RoomId } from '../types';

interface DashboardViewProps {
  rooms: Room[];
  bookings: Booking[];
  currentUser: User;
  onNavigateToBooking: (roomId?: RoomId) => void;
  onNavigateToFloorPlan: (roomId?: RoomId) => void;
  onNavigateToApprovals?: () => void;
  onNavigateToMyBookings?: () => void;
  onOpenQrScanner?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rooms,
  bookings,
  currentUser,
  onNavigateToBooking,
  onNavigateToFloorPlan,
  onNavigateToApprovals,
  onNavigateToMyBookings,
  onOpenQrScanner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const todayStr = new Date().toISOString().split('T')[0];

  const todayBookings = bookings.filter((b) => b.date === todayStr && b.status !== 'cancelled');
  const pendingApprovals = bookings.filter((b) => b.status === 'pending');
  const totalComputers = rooms.reduce((acc, r) => acc + r.computersCount, 0);
  const activeRooms = rooms.filter((r) => r.status === 'available').length;

  // Determine current room state dynamically based on active bookings right now
  const isRoomOccupiedNow = (roomId: RoomId) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return todayBookings.some((b) => {
      if (b.roomId !== roomId) return false;
      if (b.status !== 'approved' && b.status !== 'checked_in') return false;
      const [sh, sm] = b.startTime.split(':').map(Number);
      const [eh, em] = b.endTime.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      return currentMinutes >= startMin && currentMinutes <= endMin;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner with Glassmorphism & High-tech Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-cyan-500/30 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              ศูนย์ปฏิบัติการคอมพิวเตอร์ แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              ยินดีต้อนรับ, <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">{currentUser.name}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ตรวจสอบสถานะห้องว่างแบบเรียลไทม์ จองเข้าใช้งานห้องปฏิบัติการ 311, 312, 314, 315 ตรวจสอบอุปกรณ์ และสแกน QR Code เช็คอินเข้าใช้งานทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToBooking()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>จองห้องทันที</span>
            </button>
            <button
              onClick={() => onNavigateToFloorPlan()}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/15 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>ดูผังที่นั่ง Interactive</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">ห้องพร้อมใช้งาน</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white font-mono">{activeRooms}</span>
              <span className="text-xs text-slate-400">/ {rooms.length} ห้อง</span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-xs text-slate-400 font-medium">คอมพิวเตอร์ทั้งหมด</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-cyan-300 font-mono">{totalComputers}</span>
              <span className="text-xs text-slate-400">เครื่อง</span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-xs text-slate-400 font-medium">รายการจองวันนี้</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white font-mono">{todayBookings.length}</span>
              <span className="text-xs text-slate-400">รายการ</span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-xs text-slate-400 font-medium">คำขอรออนุมัติ</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-amber-400 font-mono">{pendingApprovals.length}</span>
              <span className="text-xs text-slate-400">รายการ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Laboratory Rooms Grid (ห้อง 311, 312, 314, 315) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              สถานะห้องปฏิบัติการ (4 Labs Status)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              สถานะเรียลไทม์ ข้อมูลสเปกเครื่องคอมพิวเตอร์ และอุปกรณ์ประจำห้อง
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ว่าง / พร้อมใช้
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              กำลังใช้งาน
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              ปิดปรับปรุง
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {rooms.map((room) => {
            const isOccupied = isRoomOccupiedNow(room.id) || room.status === 'occupied';
            const isMaintenance = room.status === 'maintenance';
            
            return (
              <div
                key={room.id}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300"
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        ห้อง {room.id}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mt-1">
                        {room.name.split('(')[0]}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">
                        ({room.name.split('(')[1] || ''}
                      </p>
                    </div>

                    {isMaintenance ? (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                        ปรับปรุง
                      </span>
                    ) : isOccupied ? (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                        กำลังใช้งาน
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                        ว่างพร้อมใช้
                      </span>
                    )}
                  </div>

                  {/* Room Image with overlay */}
                  <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                      <span className="font-semibold flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                        {room.computersCount} เครื่อง
                      </span>
                      <span className="text-slate-200 text-[11px]">ความจุ {room.capacity} ที่นั่ง</span>
                    </div>
                  </div>

                  {/* Specs & Hardware pill list */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="truncate">{room.specs.cpu}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="truncate">{room.specs.gpu} • RAM {room.specs.ram.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.equipment.slice(0, 2).map((eq, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 truncate max-w-[135px]"
                        >
                          {eq}
                        </span>
                      ))}
                      {room.equipment.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                          +{room.equipment.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => onNavigateToFloorPlan(room.id)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>ผังที่นั่ง</span>
                  </button>
                  <button
                    onClick={() => onNavigateToBooking(room.id)}
                    disabled={isMaintenance}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isMaintenance
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs'
                    }`}
                  >
                    <span>จองห้อง</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Column Layout: Today's Schedule Timeline & Quick Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule Timeline (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ตารางการใช้ห้องวันนี้ ({new Date().toLocaleDateString('th-TH', { dateStyle: 'medium' })})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  รายการจองที่ได้รับอนุมัติแล้วและกำลังเข้าใช้บริการ
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {todayBookings.length} รายการ
            </span>
          </div>

          {todayBookings.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">ยังไม่มีการจองห้องในวันนี้</p>
              <button
                onClick={() => onNavigateToBooking()}
                className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
              >
                + จองห้องคนแรกวันนี้
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 sm:w-16 py-1 px-2 rounded-lg bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 text-center font-mono font-bold text-xs">
                      {b.startTime}
                      <span className="block text-[10px] text-slate-500 font-normal">ถึง {b.endTime}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          ห้อง {b.roomId}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {b.purposeDetail}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        ผู้จอง: <span className="font-semibold text-slate-700 dark:text-slate-300">{b.userName}</span> ({b.userRole === 'student' ? 'นักศึกษา' : 'อาจารย์'}) • {b.attendeeCount} คน
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {b.status === 'checked_in' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        เช็คอินแล้ว
                      </span>
                    ) : b.status === 'approved' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                        อนุมัติแล้ว
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        รออนุมัติ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lab Rules & Smart Notice (1 col) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ระเบียบการใช้ห้องปฏิบัติการ
              </h3>
            </div>
            
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>จองล่วงหน้าอย่างน้อย 1-2 ชั่วโมง และรอการอนุมัติจากอาจารย์ผู้ดูแล</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>สแกน QR Code หน้าห้องเพื่อเช็คอินเมื่อถึงเวลาเริ่มใช้งาน</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>ห้ามนำอาหารและเครื่องดื่มทุกชนิดเข้ามาในห้องปฏิบัติการ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                <span>ปิดเครื่องคอมพิวเตอร์และเก็บเก้าอี้ให้เรียบร้อยก่อนออกจากห้อง</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200 text-xs">
              <span className="font-bold block mb-1">🔔 การแจ้งเตือนอัจฉริยะ</span>
              ระบบจะส่งข้อความแจ้งเตือนสถานะการอนุมัติผ่าน Line Notify และ Email อัตโนมัติทันที
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigateToBooking()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>ส่งคำขอจองห้องตอนนี้</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
