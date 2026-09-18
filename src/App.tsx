import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  X,
  AlertCircle,
  ExternalLink,
  QrCode,
  ShieldAlert
} from 'lucide-react';
import {
  TabType,
  Room,
  Booking,
  User,
  IssueReport,
  AuditLog,
  RoomId,
  BookingStatus
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { DeveloperCreditFooter } from './components/DeveloperCreditFooter';
import { DashboardView } from './components/DashboardView';
import { BookingView } from './components/BookingView';
import { FloorPlanView } from './components/FloorPlanView';
import { MyBookingsView } from './components/MyBookingsView';
import { ApprovalsView } from './components/ApprovalsView';
import { RoomManagementView } from './components/RoomManagementView';
import { UserManagementView } from './components/UserManagementView';
import { ReportsView } from './components/ReportsView';
import { HelpAndManualView } from './components/HelpAndManualView';
import { QrScannerModal } from './components/QrScannerModal';
import { ProfileModal } from './components/ProfileModal';
import { AboutModal } from './components/AboutModal';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [selectedRoomIdForBooking, setSelectedRoomIdForBooking] = useState<RoomId | null>(null);

  // App Data States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Modals
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Notification Toast State (Simulates Line Notify & System Popups)
  const [toast, setToast] = useState<{
    type: 'line' | 'email' | 'info' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Initialize Data
  useEffect(() => {
    const loadedRooms = StorageService.getRooms();
    const loadedBookings = StorageService.getBookings();
    const loadedUsers = StorageService.getUsers();
    const loadedCurrentUser = StorageService.getCurrentUser();
    const loadedIssues = StorageService.getIssues();
    const loadedLogs = StorageService.getLogs();
    const loadedTheme = StorageService.getTheme();

    setRooms(loadedRooms);
    setBookings(loadedBookings);
    setUsers(loadedUsers);
    setCurrentUser(loadedCurrentUser);
    setIssues(loadedIssues);
    setLogs(loadedLogs);
    setIsDarkMode(loadedTheme);

    // Apply dark class to html document
    if (loadedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme Toggle Handler
  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    StorageService.saveTheme(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Trigger Toast Notification helper
  const showNotification = (
    type: 'line' | 'email' | 'info' | 'success',
    title: string,
    message: string
  ) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Booking Created Handler
  const handleBookingCreated = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    StorageService.saveBookings(updated);

    // Trigger Line Notify simulation toast
    showNotification(
      'line',
      'LINE Notify: แจ้งเตือนการจองใหม่',
      `มีการจองห้อง ${newBooking.roomId} รหัส ${newBooking.bookingCode} โดย ${newBooking.userName}`
    );
  };

  // Booking Cancel Handler
  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b
    );
    setBookings(updated);
    StorageService.saveBookings(updated);

    if (currentUser) {
      StorageService.addLog(
        currentUser,
        'ยกเลิกการจองห้อง',
        `ยกเลิกคำขอจองห้อง รหัส ID: ${bookingId}`
      );
    }

    showNotification(
      'info',
      'ยกเลิกการจองสำเร็จ',
      'ระบบได้ปรับสถานะการจองเป็น "ยกเลิกแล้ว" เรียบร้อย'
    );
  };

  // Approval Status Update Handler (Approve / Reject)
  const handleUpdateBookingStatus = (
    bookingId: string,
    status: BookingStatus,
    adminNote?: string
  ) => {
    if (!currentUser) return;

    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status,
          adminNote: adminNote || b.adminNote,
          approvedBy: currentUser.name,
          approvedAt: new Date().toLocaleString('th-TH'),
        };
      }
      return b;
    });

    setBookings(updated);
    StorageService.saveBookings(updated);

    const targetBooking = bookings.find((b) => b.id === bookingId);
    const actionLabel = status === 'approved' ? 'อนุมัติการจองห้อง' : 'ปฏิเสธคำขอจองห้อง';

    StorageService.addLog(
      currentUser,
      actionLabel,
      `${actionLabel} ${targetBooking?.roomName || ''} (${targetBooking?.bookingCode || ''})`
    );

    // Notify user via simulated email/line
    showNotification(
      'line',
      status === 'approved' ? 'LINE Notify: อนุมัติการจองห้องแล้ว' : 'LINE Notify: ปฏิเสธคำขอจอง',
      `คำขอจองรหัส ${targetBooking?.bookingCode} ได้รับการ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'} โดย ${currentUser.name}`
    );
  };

  // User Switcher Handler (For Demo testing of Student vs Teacher vs Admin)
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);

    StorageService.addLog(
      user,
      'เข้าสู่ระบบ (Switch User)',
      `สลับผู้ใช้งานเป็น ${user.name} (${user.role})`
    );

    showNotification(
      'info',
      'สลับผู้ใช้งานสำเร็จ',
      `ปัจจุบันคุณกำลังเข้าใช้งานในฐานะ: ${user.name} (${user.role === 'admin' ? 'ผู้ดูแลระบบ' : user.role === 'teacher' ? 'อาจารย์' : 'นักศึกษา'})`
    );
  };

  // Rooms Save Handler
  const handleSaveRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    StorageService.saveRooms(updatedRooms);
    if (currentUser) {
      StorageService.addLog(currentUser, 'อัปเดตข้อมูลห้องปฏิบัติการ', 'บันทึกการแก้ไขห้อง 311-315');
    }
    showNotification('success', 'บันทึกสำเร็จ', 'อัปเดตข้อมูลห้องปฏิบัติการเรียบร้อยแล้ว');
  };

  // Users Save Handler
  const handleSaveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    if (currentUser) {
      StorageService.addLog(currentUser, 'จัดการผู้ใช้งาน', 'อัปเดตรายชื่อหรือสิทธิ์ผู้ใช้');
    }
    showNotification('success', 'บันทึกสำเร็จ', 'ข้อมูลผู้ใช้งานได้รับการบันทึกเรียบร้อย');
  };

  // Add Issue Handler
  const handleAddIssue = (newIssue: IssueReport) => {
    const updated = [newIssue, ...issues];
    setIssues(updated);
    StorageService.saveIssues(updated);
    showNotification(
      'line',
      'LINE Notify: แจ้งเตือนอุปกรณ์ชำรุด',
      `มีการแจ้งซ่อมอุปกรณ์ ${newIssue.equipmentName} ห้อง ${newIssue.roomId}`
    );
  };

  // Profile Update Handler
  const handleUpdateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    StorageService.setCurrentUser(updatedUser);
    const updatedAllUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedAllUsers);
    StorageService.saveUsers(updatedAllUsers);
    showNotification('success', 'อัปเดตโปรไฟล์สำเร็จ', 'ข้อมูลส่วนตัวของคุณได้รับการบันทึกแล้ว');
  };

  // Navigation Shortcut: from Dashboard or FloorPlan directly to Booking
  const handleQuickBookRoom = (roomId?: RoomId) => {
    if (roomId) setSelectedRoomIdForBooking(roomId);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If loading
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-cyan-400 font-mono">กำลังโหลดระบบจองห้อง DBT...</span>
        </div>
      </div>
    );
  }

  const pendingApprovalsCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Real-time Simulated Toast (Line Notify / Email / Alerts) */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 rounded-2xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-start gap-3">
            {toast.type === 'line' ? (
              <div className="w-8 h-8 rounded-xl bg-[#06C755] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                LINE
              </div>
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-cyan-500 shrink-0" />
            )}
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">{toast.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        availableUsers={users}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: Dashboard / Home */}
        {currentTab === 'dashboard' && (
          <DashboardView
            rooms={rooms}
            bookings={bookings}
            currentUser={currentUser}
            onNavigateToBooking={handleQuickBookRoom}
            onNavigateToFloorPlan={() => setCurrentTab('floorplan')}
            onNavigateToMyBookings={() => setCurrentTab('my-bookings')}
            onOpenQrScanner={() => setIsQrScannerOpen(true)}
          />
        )}

        {/* VIEW 2: Booking Form */}
        {currentTab === 'booking' && (
          <BookingView
            rooms={rooms}
            bookings={bookings}
            currentUser={currentUser}
            initialRoomId={selectedRoomIdForBooking}
            onBookingCreated={handleBookingCreated}
            onNavigateToMyBookings={() => setCurrentTab('my-bookings')}
          />
        )}

        {/* VIEW 3: Interactive Floor Plan */}
        {currentTab === 'floorplan' && (
          <FloorPlanView
            rooms={rooms}
            bookings={bookings}
            currentUser={currentUser}
            onBookRoom={handleQuickBookRoom}
          />
        )}

        {/* VIEW 4: My Bookings */}
        {currentTab === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            currentUser={currentUser}
            onCancelBooking={handleCancelBooking}
            onNavigateToBooking={() => setCurrentTab('booking')}
          />
        )}

        {/* VIEW 5: Approvals (Admin & Teacher) */}
        {currentTab === 'approvals' && (
          <ApprovalsView
            bookings={bookings}
            currentUser={currentUser}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}

        {/* VIEW 6: Room Management (Admin & Teacher) */}
        {currentTab === 'rooms' && (
          <RoomManagementView
            rooms={rooms}
            onSaveRooms={handleSaveRooms}
          />
        )}

        {/* VIEW 7: User Management (Admin) */}
        {currentTab === 'users' && (
          <UserManagementView
            users={users}
            onSaveUsers={handleSaveUsers}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 8: Reports & Statistics (Admin & Teacher) */}
        {currentTab === 'reports' && (
          <ReportsView
            rooms={rooms}
            bookings={bookings}
          />
        )}

        {/* VIEW 9: Help, Manual, Safety & Issue Reporting */}
        {currentTab === 'help' && (
          <HelpAndManualView
            rooms={rooms}
            currentUser={currentUser}
            issues={issues}
            onAddIssue={handleAddIssue}
          />
        )}

      </main>

      {/* Developer Credit Footer (Fixed & Polished) */}
      <DeveloperCreditFooter onOpenAbout={() => setIsAboutOpen(true)} />

      {/* MODAL 1: QR Scanner Simulator */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        bookings={bookings}
        currentUser={currentUser}
        onCheckInSuccess={(checkedIn) => {
          setBookings(StorageService.getBookings());
        }}
      />

      {/* MODAL 2: User Profile & Security */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateCurrentUser}
        logs={logs}
      />

      {/* MODAL 3: About & Developer Credit */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
}
