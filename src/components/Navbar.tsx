import React, { useState } from 'react';
import {
  Monitor,
  Calendar,
  Layers,
  FileCheck,
  BarChart3,
  Shield,
  HelpCircle,
  Sun,
  Moon,
  QrCode,
  Users,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Bell
} from 'lucide-react';
import { User, UserRole } from '../types';
import { APP_ASSETS } from '../data/initialData';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  availableUsers: User[];
  currentTab: string;
  onSelectTab: (tab: any) => void;
  isDark?: boolean;
  isDarkMode?: boolean;
  onToggleTheme: () => void;
  onOpenQrScanner: () => void;
  onOpenProfile: () => void;
  onOpenAbout?: () => void;
  pendingCount?: number;
  pendingApprovalsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  availableUsers,
  currentTab,
  onSelectTab,
  isDark,
  isDarkMode,
  onToggleTheme,
  onOpenQrScanner,
  onOpenProfile,
  onOpenAbout,
  pendingCount = 0,
  pendingApprovalsCount = 0,
}) => {
  const activeDark = isDarkMode !== undefined ? isDarkMode : isDark;
  const activePendingCount = pendingApprovalsCount || pendingCount;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">นักศึกษา</span>;
      case 'teacher':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">อาจารย์ผู้สอน</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">ผู้ดูแลระบบ</span>;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Monitor },
    { id: 'booking', label: 'จองห้องปฏิบัติการ', icon: Calendar },
    { id: 'floorplan', label: 'ผังห้อง Interactive', icon: Layers },
    { id: 'my-bookings', label: 'รายการจองของฉัน', icon: FileCheck },
  ];

  const adminItems = [
    { id: 'approvals', label: 'จัดการคำขอจอง', icon: Shield, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'rooms', label: 'จัดการข้อมูลห้อง', icon: Monitor },
    { id: 'users', label: 'จัดการผู้ใช้งาน', icon: Users },
    { id: 'reports', label: 'รายงานและสถิติ', icon: BarChart3 },
  ];

  const supportItems = [
    { id: 'help', label: 'คู่มือ & ระเบียบ', icon: HelpCircle },
    { id: 'report-issue', label: 'แจ้งอุปกรณ์ชำรุด', icon: AlertCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <img
                src={APP_ASSETS.logo}
                alt="โลโก้แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล"
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-contain bg-white dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 shadow-md transition-transform group-hover:scale-105"
                onError={(e) => {
                  // graceful fallback icon
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
                  DBT LAB BOOKING
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  ห้อง 311-315
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
                แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold shadow-xs border border-cyan-200/60 dark:border-cyan-800/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin/Teacher dropdown or section */}
            {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
              <div className="relative group">
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    adminItems.some((i) => i.id === currentTab)
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-800/60'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>เมนูผู้ดูแล</span>
                  {activePendingCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                      {activePendingCount}
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 hidden group-hover:block transition-all z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                    สำหรับอาจารย์ / ผู้ดูแล
                  </div>
                  {adminItems.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSelectTab(sub.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                          currentTab === sub.id
                            ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <SubIcon className="w-4 h-4 text-slate-400" />
                          <span>{sub.label}</span>
                        </div>
                        {sub.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Support tab */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  supportItems.some((i) => i.id === currentTab)
                    ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>ช่วยเหลือ</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 hidden group-hover:block transition-all z-50">
                {supportItems.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectTab(sub.id)}
                      className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                        currentTab === sub.id
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <SubIcon className="w-4 h-4 text-slate-400" />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* QR Code Check-in Scanner Button */}
            <button
              onClick={onOpenQrScanner}
              title="สแกน QR Code เช็คอินเข้าห้อง"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm transition-all transform active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden md:inline">สแกนเช็คอิน</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={activeDark ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
              aria-label="Toggle theme"
            >
              {activeDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Role / User Switcher Dropdown (Crucial for Demo & Multi-Role Testing) */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all text-left"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  }}
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[110px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1 font-mono">รหัส: {currentUser.code}</p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        onOpenProfile();
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>แก้ไขข้อมูลส่วนตัว (Profile)</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 px-2">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                      สลับบทบาทผู้ใช้ (Switch Role Demo)
                    </div>
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-semibold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={u.avatarUrl}
                            alt=""
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <span className="truncate">{u.name}</span>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pt-3 pb-6 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">เมนูหลัก</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  currentTab === item.id
                    ? 'bg-cyan-500 text-white font-semibold shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
            <>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">ผู้ดูแลและอาจารย์</div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                      currentTab === item.id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          )}

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">ช่วยเหลือ & ข้อมูล</div>
          {supportItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  currentTab === item.id
                    ? 'bg-cyan-500 text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
