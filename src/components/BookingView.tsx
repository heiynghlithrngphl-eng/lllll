import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  BellRing,
  Info
} from 'lucide-react';
import { Room, Booking, User, RoomId, BookingPurpose } from '../types';
import { StorageService } from '../services/storageService';
import { TIME_SLOTS, PURPOSE_OPTIONS } from '../data/initialData';

interface BookingViewProps {
  rooms: Room[];
  currentUser: User;
  bookings?: Booking[];
  initialRoomId?: RoomId | null;
  preselectedRoomId?: RoomId;
  onBookingSuccess?: (newBooking: Booking) => void;
  onBookingCreated?: (newBooking: Booking) => void;
  onNavigateToMyBookings: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  rooms,
  currentUser,
  bookings,
  initialRoomId,
  preselectedRoomId,
  onBookingSuccess,
  onBookingCreated,
  onNavigateToMyBookings,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<RoomId>(initialRoomId || preselectedRoomId || '311');
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('t3'); // 13:00 - 15:00
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const [customStartTime, setCustomStartTime] = useState<string>('13:00');
  const [customEndTime, setCustomEndTime] = useState<string>('15:00');

  const [purpose, setPurpose] = useState<BookingPurpose>('project');
  const [purposeDetail, setPurposeDetail] = useState<string>('');
  const [attendeeCount, setAttendeeCount] = useState<number>(10);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showSeatPicker, setShowSeatPicker] = useState<boolean>(false);

  // Notifications toggles
  const [enableLineNotify, setEnableLineNotify] = useState<boolean>(true);
  const [enableEmailNotify, setEnableEmailNotify] = useState<boolean>(true);

  // Conflict state
  const [conflict, setConflict] = useState<{ hasConflict: boolean; conflictingBooking?: Booking }>({
    hasConflict: false,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const startTime = isCustomTime
    ? customStartTime
    : TIME_SLOTS.find((s) => s.id === selectedSlotId)?.start || '13:00';
  const endTime = isCustomTime
    ? customEndTime
    : TIME_SLOTS.find((s) => s.id === selectedSlotId)?.end || '15:00';

  // Conflict checker effect
  useEffect(() => {
    if (selectedRoomId && date && startTime && endTime) {
      const result = StorageService.checkTimeConflict(selectedRoomId, date, startTime, endTime);
      setConflict(result);
    }
  }, [selectedRoomId, date, startTime, endTime]);

  const toggleEquipment = (eq: string) => {
    if (selectedEquipment.includes(eq)) {
      setSelectedEquipment(selectedEquipment.filter((item) => item !== eq));
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= attendeeCount) {
        // limit to attendee count or expand
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict.hasConflict) return;
    if (!purposeDetail.trim()) {
      alert('กรุณาระบุรายละเอียดวัตถุประสงค์การใช้งาน');
      return;
    }

    setIsSubmitting(true);

    const bookingCode = StorageService.generateBookingCode(selectedRoomId);
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      bookingCode,
      roomId: selectedRoomId,
      roomName: selectedRoom.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userCode: currentUser.code,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      date,
      startTime,
      endTime,
      purpose,
      purposeDetail,
      attendeeCount: Number(attendeeCount),
      requestedEquipment: selectedEquipment,
      selectedSeats,
      // Teachers and Admins are automatically approved, students are pending
      status: currentUser.role === 'teacher' || currentUser.role === 'admin' ? 'approved' : 'pending',
      approvedBy: currentUser.role === 'teacher' || currentUser.role === 'admin' ? currentUser.name : undefined,
      approvedAt: currentUser.role === 'teacher' || currentUser.role === 'admin' ? `${date} ${startTime}` : undefined,
      createdAt: new Date().toLocaleString('th-TH'),
      lineNotifySent: enableLineNotify,
      emailSent: enableEmailNotify,
    };

    const currentBookings = StorageService.getBookings();
    const updatedBookings = [newBooking, ...currentBookings];
    StorageService.saveBookings(updatedBookings);

    StorageService.addLog(
      currentUser,
      'ยื่นคำขอจองห้องปฏิบัติการ',
      `จองห้อง ${selectedRoomId} วันที่ ${date} เวลา ${startTime}-${endTime} รหัส ${bookingCode}`
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      console.error(e);
    }

    setIsSubmitting(false);
    setSubmittedBooking(newBooking);
    if (onBookingSuccess) onBookingSuccess(newBooking);
    if (onBookingCreated) onBookingCreated(newBooking);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            ระบบจองเข้าใช้ห้องปฏิบัติการ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล • ตรวจสอบความซ้ำซ้อนของเวลาอัตโนมัติ (Automated Conflict Checker)
          </p>
        </div>
        <button
          onClick={onNavigateToMyBookings}
          className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          ดูรายการจองของฉัน →
        </button>
      </div>

      {/* Success Modal / Banner when booked */}
      {submittedBooking && (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {submittedBooking.status === 'approved'
                  ? 'อนุมัติการจองห้องปฏิบัติการเรียบร้อยแล้ว!'
                  : 'ส่งคำขอจองห้องเรียบร้อยแล้ว (รอการอนุมัติ)'}
              </h2>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                รหัสการจอง: <strong className="text-emerald-950 dark:text-emerald-50 font-bold">{submittedBooking.bookingCode}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900 text-xs text-slate-700 dark:text-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">ห้องปฏิบัติการ:</span>
              <strong className="font-semibold">{submittedBooking.roomName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">วันและเวลา:</span>
              <strong className="font-semibold">{submittedBooking.date} ({submittedBooking.startTime} - {submittedBooking.endTime} น.)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">การแจ้งเตือน:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {enableLineNotify ? '✓ Line Notify' : ''} {enableEmailNotify ? '✓ Email' : ''}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setSubmittedBooking(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 transition-colors"
            >
              จองห้องอื่นเพิ่มเติม
            </button>
            <button
              onClick={onNavigateToMyBookings}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
            >
              เปิดดูบัตรจอง & QR Code ทันที →
            </button>
          </div>
        </div>
      )}

      {/* Main Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Select Room (311, 312, 314, 315) */}
        <section className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-xs flex items-center justify-center">1</span>
              เลือกห้องปฏิบัติการ (Select Lab Room)
            </span>
            <span className="text-xs text-slate-400 font-normal">แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              const isMaintenance = room.status === 'maintenance';
              return (
                <div
                  key={room.id}
                  onClick={() => !isMaintenance && setSelectedRoomId(room.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 ring-2 ring-cyan-500/20 shadow-md'
                      : isMaintenance
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 opacity-50 cursor-not-allowed'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      ห้อง {room.id}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {room.name.split('(')[1]?.replace(')', '') || room.name}
                  </h4>
                  <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>{room.computersCount} เครื่อง</span>
                    <span>ชั้น {room.floor.replace('ชั้น ', '')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 2: Date & Time Selection with Automated Conflict Checker */}
        <section className="space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-xs flex items-center justify-center">2</span>
            เลือกวันและช่วงเวลา (Date & Time Slots)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                วันที่ต้องการเข้าใช้งาน
              </label>
              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>

            {/* Time Mode Switcher */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  รูปแบบการเลือกเวลา
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomTime(!isCustomTime)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
                >
                  {isCustomTime ? 'ใช้ช่วงเวลามาตรฐาน' : 'กำหนดเวลาเอง (Custom Time)'}
                </button>
              </div>

              {!isCustomTime ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        <div className="font-mono">{slot.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
                          ช่วง{slot.period}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">เวลาเริ่ม</span>
                    <input
                      type="time"
                      value={customStartTime}
                      onChange={(e) => setCustomStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">เวลาสิ้นสุด</span>
                    <input
                      type="time"
                      value={customEndTime}
                      onChange={(e) => setCustomEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conflict Checker Live Indicator */}
          <div className="pt-2">
            {conflict.hasConflict ? (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">เวลาซ้ำซ้อน (Time Conflict Detected!)</strong>
                  ห้อง {selectedRoomId} ในช่วงเวลานี้ มีการจองไว้แล้วโดย{' '}
                  <span className="font-semibold underline">{conflict.conflictingBooking?.userName}</span> (
                  {conflict.conflictingBooking?.startTime} - {conflict.conflictingBooking?.endTime} น.)
                  <span className="block mt-1 text-slate-600 dark:text-slate-300">
                    โปรดเลือกช่วงเวลาอื่น หรือเปลี่ยนเป็นห้องปฏิบัติการอื่น
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>ห้องว่างพร้อมใช้งาน:</strong> ห้อง {selectedRoomId} ว่างในช่วงเวลา {startTime} - {endTime} น. วันที่ {date}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Step 3: Purpose of use & Details */}
        <section className="space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-xs flex items-center justify-center">3</span>
            วัตถุประสงค์และรายละเอียดการใช้ห้อง
          </label>

          {/* Purpose Type Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {PURPOSE_OPTIONS.map((opt) => {
              const isSelected = purpose === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPurpose(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-500'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-1 line-clamp-2">{opt.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Purpose Details textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              หัวข้อ / รายละเอียดกิจกรรมที่ต้องการใช้งานห้อง <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={purposeDetail}
              onChange={(e) => setPurposeDetail(e.target.value)}
              placeholder="ระบุชื่อวิชา, หัวข้อโครงงาน, กิจกรรมที่ทำ หรือวัตถุประสงค์โดยย่อ เช่น ทำโครงงานพัฒนาระบบอีคอมเมิร์ซ หรือ ติวสอบทักษะวิชาชีพ"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Attendees Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                จำนวนผู้เข้าใช้ห้อง (คน)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={selectedRoom.capacity}
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold"
                />
                <span className="text-xs text-slate-500">
                  (ความจุสูงสุด {selectedRoom.capacity} คน / {selectedRoom.computersCount} เครื่อง)
                </span>
              </div>
            </div>

            {/* Interactive PC Seats toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  เลือกตำแหน่งเครื่องคอมพิวเตอร์ (ไม่บังคับ)
                </label>
                <button
                  type="button"
                  onClick={() => setShowSeatPicker(!showSeatPicker)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
                >
                  {showSeatPicker ? 'ซ่อนผังเครื่อง' : 'เลือกหมายเลขเครื่อง PC'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {selectedSeats.length > 0
                  ? `เลือกแล้ว ${selectedSeats.length} เครื่อง: ${selectedSeats.slice(0, 5).join(', ')}${selectedSeats.length > 5 ? '...' : ''}`
                  : 'จัดที่นั่งอัตโนมัติเมื่อเข้าห้อง หรือคลิกเพื่อเจาะจงเครื่อง'}
              </p>
            </div>
          </div>

          {/* Seat Picker Grid */}
          {showSeatPicker && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  คลิกเพื่อเลือกหมายเลขเครื่อง PC สำหรับห้อง {selectedRoomId}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSeats([])}
                  className="text-rose-500 hover:underline"
                >
                  ล้างที่เลือก
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1">
                {selectedRoom.seats.map((seat) => {
                  const isPicked = selectedSeats.includes(seat.id);
                  const isMaintenance = seat.status === 'maintenance';
                  return (
                    <button
                      type="button"
                      key={seat.id}
                      disabled={isMaintenance}
                      onClick={() => toggleSeat(seat.id)}
                      className={`p-1.5 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                        isMaintenance
                          ? 'bg-rose-100 text-rose-400 cursor-not-allowed'
                          : isPicked
                          ? 'bg-cyan-600 text-white shadow-sm ring-2 ring-cyan-400'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400'
                      }`}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Step 4: Additional Equipment & Notification Options */}
        <section className="space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-xs flex items-center justify-center">4</span>
            อุปกรณ์เสริมและการแจ้งเตือน (Equipment & Smart Alerts)
          </label>

          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              อุปกรณ์เพิ่มเติมที่ต้องการให้เจ้าหน้าที่เตรียมพร้อม:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedRoom.equipment.map((eq) => {
                const isChecked = selectedEquipment.includes(eq);
                return (
                  <label
                    key={eq}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-900 dark:text-cyan-200'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleEquipment(eq)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="truncate">{eq}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Smart Notification Options (Line Notify / Email) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableLineNotify}
                onChange={(e) => setEnableLineNotify(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 block">
                  🟢 แจ้งเตือนผ่าน Line Notify
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  ส่งข้อความเตือนเมื่อคำขอได้รับการอนุมัติ / ปฏิเสธ
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableEmailNotify}
                onChange={(e) => setEnableEmailNotify(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <span className="text-xs font-bold text-cyan-800 dark:text-cyan-200 block">
                  ✉️ แจ้งเตือนผ่าน Email ({currentUser.email})
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400">
                  ส่งใบยืนยันการจองและ QR Code เช็คอิน
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="text-xs space-y-0.5 text-center sm:text-left">
            <p className="font-bold text-sm text-cyan-400">
              ยืนยันการจอง: ห้อง {selectedRoomId} ({startTime} - {endTime} น.)
            </p>
            <p className="text-slate-400">
              ผู้จอง: {currentUser.name} ({currentUser.role === 'student' ? 'นักศึกษา' : 'อาจารย์'})
            </p>
          </div>

          <button
            type="submit"
            disabled={conflict.hasConflict || isSubmitting}
            className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${
              conflict.hasConflict
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันและส่งคำขอจอง'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
