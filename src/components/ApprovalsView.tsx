import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  Calendar,
  Layers,
  Filter,
  Search
} from 'lucide-react';
import { Booking, User, BookingStatus } from '../types';

interface ApprovalsViewProps {
  bookings: Booking[];
  currentUser: User;
  onUpdateBookingStatus: (
    bookingId: string,
    status: BookingStatus,
    adminNote?: string
  ) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  bookings,
  currentUser,
  onUpdateBookingStatus,
}) => {
  const [filter, setFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState<string>('');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [adminNoteInput, setAdminNoteInput] = useState<{ [id: string]: string }>({});

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'pending' && b.status !== 'pending') return false;
    if (filter === 'approved' && b.status !== 'approved' && b.status !== 'checked_in') return false;
    if (filter === 'rejected' && b.status !== 'rejected') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.bookingCode.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.userCode.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q) ||
        b.purposeDetail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (booking: Booking) => {
    const note = adminNoteInput[booking.id] || 'อนุมัติเรียบร้อย ขอให้ดูแลรักษาความสะอาดและอุปกรณ์';
    onUpdateBookingStatus(booking.id, 'approved', note);
  };

  const handleConfirmReject = (bookingId: string) => {
    onUpdateBookingStatus(
      bookingId,
      'rejected',
      rejectReason || 'ปฏิเสธคำขอเนื่องจากติดภารกิจการเรียนการสอน หรืออุปกรณ์ไม่พร้อมใช้งาน'
    );
    setRejectingBookingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            จัดการคำขอจองห้อง (Booking Approvals)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            สำหรับอาจารย์ผู้ดูแลและเจ้าหน้าที่ศูนย์ปฏิบัติการ • ตรวจสอบและอนุมัติคำขอ พร้อมแจ้งเตือนผ่าน Line / Email
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            รอการอนุมัติ: {pendingBookings.length} รายการ
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            รออนุมัติ ({pendingBookings.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'approved'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            อนุมัติแล้ว
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ปฏิเสธคำขอ
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ทั้งหมด
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้จอง, รหัสจอง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bookings Approval Cards */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            ไม่มีรายการที่ต้องดำเนินการในขณะนี้
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            คำขอจองห้องทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all space-y-4 ${
                b.status === 'pending'
                  ? 'border-amber-400/80 dark:border-amber-500/40 shadow-md ring-1 ring-amber-400/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Header: User & Lab Room */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {b.roomId}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {b.userName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>รหัส: {b.userCode}</span>
                      <span>•</span>
                      <span>{b.userRole === 'student' ? 'นักศึกษา' : 'อาจารย์'}</span>
                      <span>•</span>
                      <span>โทร: {b.userPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {b.bookingCode}
                  </span>
                  {b.status === 'approved' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      อนุมัติแล้ว
                    </span>
                  )}
                  {b.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      รอการอนุมัติ
                    </span>
                  )}
                  {b.status === 'rejected' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      ปฏิเสธคำขอ
                    </span>
                  )}
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">ห้องและเวลา</span>
                  <strong className="text-slate-800 dark:text-slate-200 block">
                    {b.roomName}
                  </strong>
                  <span className="text-slate-600 dark:text-slate-400 font-mono mt-0.5 block">
                    {b.date} ({b.startTime} - {b.endTime} น.)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">วัตถุประสงค์ & ผู้เข้าใช้</span>
                  <strong className="text-slate-800 dark:text-slate-200 block truncate">
                    {b.purposeDetail}
                  </strong>
                  <span className="text-slate-500 mt-0.5 block">
                    ผู้เข้าใช้ {b.attendeeCount} คน {b.selectedSeats.length > 0 ? `(ระบุ ${b.selectedSeats.length} ที่นั่ง)` : ''}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">อุปกรณ์เพิ่มเติม</span>
                  <p className="text-slate-700 dark:text-slate-300 truncate">
                    {b.requestedEquipment.length > 0
                      ? b.requestedEquipment.join(', ')
                      : 'ไม่มีอุปกรณ์พิเศษ'}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ส่งคำขอเมื่อ: {b.createdAt}
                  </span>
                </div>
              </div>

              {/* Admin Note Input (if pending) */}
              {b.status === 'pending' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="ข้อความหมายเหตุ / คำแนะนำแก่นักศึกษา (ไม่บังคับ)"
                    value={adminNoteInput[b.id] || ''}
                    onChange={(e) =>
                      setAdminNoteInput({ ...adminNoteInput, [b.id]: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingBookingId(b.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>ปฏิเสธ</span>
                    </button>

                    <button
                      onClick={() => handleApprove(b)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>อนุมัติคำขอ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Existing note if approved or rejected */}
              {b.adminNote && b.status !== 'pending' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    บันทึกของผู้ดูแล/อาจารย์:
                  </span>{' '}
                  "{b.adminNote}"
                  {b.approvedBy && (
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ดำเนินการโดย: {b.approvedBy} ({b.approvedAt})
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ระบุเหตุผลในการปฏิเสธคำขอจองห้อง
            </h3>
            <p className="text-xs text-slate-500">
              ข้อความนี้จะถูกส่งแจ้งเตือนไปยังนักศึกษาผ่านระบบและ Line / Email
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="เช่น ห้องติดเรียนคาบสอนปกติ, อุปกรณ์อยู่ระหว่างบำรุงรักษา, หรือโปรดเปลี่ยนช่วงเวลา..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingBookingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleConfirmReject(rejectingBookingId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
