import React, { useState } from 'react';
import {
  FileCheck,
  Calendar,
  Clock,
  QrCode,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Printer,
  Search,
  Filter,
  Users,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Booking, User, BookingStatus } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

interface MyBookingsViewProps {
  bookings: Booking[];
  currentUser: User;
  onCancelBooking: (bookingId: string) => void;
  onNavigateToBooking: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  currentUser,
  onCancelBooking,
  onNavigateToBooking,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQrModalBooking, setActiveQrModalBooking] = useState<Booking | null>(null);

  // Filter bookings: by default shows currentUser's bookings, or if admin/teacher allows viewing all
  const userBookings = bookings.filter((b) => {
    // If student, strictly their bookings. If admin/teacher, prioritize their bookings but allow toggle
    return b.userId === currentUser.id;
  });

  const filteredBookings = userBookings.filter((b) => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingCode.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q) ||
        b.purposeDetail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            อนุมัติแล้ว
          </span>
        );
      case 'checked_in':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            เช็คอินแล้ว
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            รออนุมัติ
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            ปฏิเสธ
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            ยกเลิกแล้ว
          </span>
        );
    }
  };

  const handlePrintTicket = (b: Booking) => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            รายการการจองของฉัน (My Bookings)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ดูประวัติการจองห้องปฏิบัติการ, สแกน QR Code เช็คอิน, และติดตามสถานะการอนุมัติ
          </p>
        </div>
        <button
          onClick={onNavigateToBooking}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-sm transition-all"
        >
          + จองห้องใหม่
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'approved', label: 'อนุมัติแล้ว' },
            { id: 'pending', label: 'รออนุมัติ' },
            { id: 'checked_in', label: 'เช็คอินแล้ว' },
            { id: 'cancelled', label: 'ยกเลิกแล้ว' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหารหัสจอง หรือวิชา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <FileCheck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            ไม่พบประวัติการจองห้อง
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            คุณยังไม่มีรายการจองห้องในสถานะที่เลือก สามารถกดปุ่มด้านล่างเพื่อเริ่มจองห้องปฏิบัติการได้ทันที
          </p>
          <button
            onClick={onNavigateToBooking}
            className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm"
          >
            ไปที่หน้าจองห้อง
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header: Room & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      ห้อง {booking.roomId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {booking.roomName}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                    รหัสการจอง: {booking.bookingCode}
                  </p>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">วันและเวลาที่จอง</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    {booking.date}
                  </strong>
                  <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                    {booking.startTime} - {booking.endTime} น.
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">วัตถุประสงค์ & จำนวนคน</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold block truncate">
                    {booking.purposeDetail}
                  </strong>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    ผู้เข้าใช้ {booking.attendeeCount} คน {booking.selectedSeats.length > 0 ? `(ระบุ ${booking.selectedSeats.length} ที่นั่ง)` : ''}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">อุปกรณ์เพิ่มเติม</span>
                  <p className="text-slate-700 dark:text-slate-300 truncate">
                    {booking.requestedEquipment.length > 0
                      ? booking.requestedEquipment.join(', ')
                      : 'ไม่มีอุปกรณ์พิเศษเพิ่มเติม'}
                  </p>
                  {booking.adminNote && (
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 block italic">
                      หมายเหตุอาจารย์: "{booking.adminNote}"
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400">
                  ทำรายการเมื่อ: {booking.createdAt}
                </div>

                <div className="flex items-center gap-2">
                  {/* QR Code Button */}
                  {(booking.status === 'approved' || booking.status === 'checked_in') && (
                    <button
                      onClick={() => setActiveQrModalBooking(booking)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>แสดง QR Code เช็คอิน</span>
                    </button>
                  )}

                  {/* Cancel Button (only for pending or approved) */}
                  {(booking.status === 'pending' || booking.status === 'approved') && (
                    <button
                      onClick={() => {
                        if (confirm(`คุณต้องการยกเลิกการจองรหัส ${booking.bookingCode} หรือไม่?`)) {
                          onCancelBooking(booking.id);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
                    >
                      ยกเลิกการจอง
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Pass Modal */}
      {activeQrModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                บัตรเข้าใช้งานห้องแล็บ (Digital Entry Pass)
              </span>
              <button
                onClick={() => setActiveQrModalBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeQrModalBooking.roomName}
              </h3>
              <p className="text-xs font-mono text-slate-500">
                {activeQrModalBooking.date} • {activeQrModalBooking.startTime} - {activeQrModalBooking.endTime} น.
              </p>
            </div>

            {/* Render High-res SVG QR code */}
            <div className="flex justify-center">
              <QRCodeDisplay
                value={activeQrModalBooking.bookingCode}
                size={200}
                label={activeQrModalBooking.bookingCode}
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1 text-left">
              <p>ผู้จอง: <strong>{activeQrModalBooking.userName}</strong></p>
              <p>รหัสประจำตัว: <strong>{activeQrModalBooking.userCode}</strong></p>
              <p>วัตถุประสงค์: <strong>{activeQrModalBooking.purposeDetail}</strong></p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePrintTicket(activeQrModalBooking)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์บัตรจอง</span>
              </button>
              <button
                onClick={() => setActiveQrModalBooking(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
