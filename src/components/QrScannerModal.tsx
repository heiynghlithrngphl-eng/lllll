import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Scan,
  CheckCircle2,
  AlertTriangle,
  X,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { Booking, User } from '../types';
import { StorageService } from '../services/storageService';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  currentUser: User;
  onCheckInSuccess: (checkedInBooking: Booking) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  bookings,
  currentUser,
  onCheckInSuccess,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    booking?: Booking;
  } | null>(null);

  if (!isOpen) return null;

  const handleVerifyCode = (codeToVerify: string) => {
    const cleanCode = codeToVerify.trim().toUpperCase();
    if (!cleanCode) return;

    setScanning(true);

    setTimeout(() => {
      const found = bookings.find(
        (b) => b.bookingCode.toUpperCase() === cleanCode
      );

      if (!found) {
        setScanResult({
          success: false,
          message: `ไม่พบรหัสการจอง "${cleanCode}" ในระบบ กรุณาตรวจสอบรหัสใหม่อีกครั้ง`,
        });
        setScanning(false);
        return;
      }

      if (found.status === 'cancelled' || found.status === 'rejected') {
        setScanResult({
          success: false,
          message: `รหัสการจองนี้ถูก${found.status === 'cancelled' ? 'ยกเลิก' : 'ปฏิเสธ'}แล้ว ไม่สามารถเช็คอินได้`,
        });
        setScanning(false);
        return;
      }

      // Check-in success!
      const checkedInBooking: Booking = {
        ...found,
        status: 'checked_in',
        checkedInAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedBookings = bookings.map((b) =>
        b.id === found.id ? checkedInBooking : b
      );
      StorageService.saveBookings(updatedBookings);

      StorageService.addLog(
        currentUser,
        'สแกน QR Code เช็คอินเข้าห้องสำเร็จ',
        `เช็คอินเข้าห้อง ${found.roomId} รหัส ${found.bookingCode}`
      );

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#3b82f6'],
        });
      } catch (e) {
        console.error(e);
      }

      setScanResult({
        success: true,
        message: `เช็คอินเข้าห้องปฏิบัติการ ${found.roomId} สำเร็จ! ยินดีต้อนรับ`,
        booking: checkedInBooking,
      });
      setScanning(false);
      onCheckInSuccess(checkedInBooking);
    }, 600);
  };

  // Quick selectable codes for convenience
  const pendingOrApproved = bookings.filter(
    (b) => b.status === 'approved' || b.status === 'checked_in'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                สแกน QR Code เช็คอินหน้าห้อง
              </h3>
              <p className="text-[11px] text-slate-500">
                ระบบจำลองเครื่องสแกนหน้าห้องปฏิบัติการ 311-315
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Simulation Viewport */}
        <div className="relative aspect-video rounded-2xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
          {/* Scanning line animation */}
          <div className="absolute inset-x-8 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-80"></div>
          
          <div className="w-36 h-36 border-2 border-dashed border-cyan-400/70 rounded-2xl flex flex-col items-center justify-center p-3 relative">
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            <Camera className="w-8 h-8 text-cyan-400/80 animate-pulse mb-1" />
            <span className="text-[10px] text-cyan-300 font-mono">จัดวาง QR Code ในกรอบ</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            กล้องจับภาพอัตโนมัติ • กรอกรหัส หรือคลิกจำลองการสแกนด้านล่าง
          </p>
        </div>

        {/* Scan Result Feedback */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl text-xs space-y-1 ${
              scanResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {scanResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              )}
              <span>{scanResult.message}</span>
            </div>
            {scanResult.booking && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-6">
                ผู้ใช้งาน: <strong>{scanResult.booking.userName}</strong> ({scanResult.booking.startTime} - {scanResult.booking.endTime} น.)
              </p>
            )}
          </div>
        )}

        {/* Input Code Field */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            พิมพ์หรือสแกนรหัสการจอง (Booking Code)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="เช่น DBT-311-0918-01"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
            />
            <button
              onClick={() => handleVerifyCode(inputCode)}
              disabled={scanning || !inputCode.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {scanning ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ'}
            </button>
          </div>
        </div>

        {/* Quick Click Demo Codes */}
        {pendingOrApproved.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              คลิกเพื่อจำลองการสแกนด้วยรหัสที่มีในระบบ:
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {pendingOrApproved.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setInputCode(b.bookingCode);
                    handleVerifyCode(b.bookingCode);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-left text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-colors"
                >
                  <span className="font-mono font-semibold">{b.bookingCode}</span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400">
                    ห้อง {b.roomId} ({b.userName.split(' ')[0]})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
