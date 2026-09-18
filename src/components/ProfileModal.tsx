import React, { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  History,
  Shield,
  CheckCircle2,
  X,
  Camera,
  Save,
  Clock,
  Phone,
  Mail,
  Key
} from 'lucide-react';
import { User, AuditLog } from '../types';
import { StorageService } from '../services/storageService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  logs: AuditLog[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  logs,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'logs'>('profile');

  // Profile Form state
  const [name, setName] = useState(currentUser.name);
  const [code, setCode] = useState(currentUser.code);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [department, setDepartment] = useState(currentUser.department);
  const [isSaved, setIsSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name,
      code,
      phone,
      email,
      avatarUrl,
      department,
    };
    onUpdateUser(updated);

    StorageService.addLog(
      currentUser,
      'แก้ไขข้อมูลส่วนตัว',
      `อัปเดตข้อมูลผู้ใช้งาน ${name} (${code})`
    );

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ success: false, text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ success: false, text: 'รหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง' });
      return;
    }

    StorageService.addLog(currentUser, 'เปลี่ยนรหัสผ่าน', 'อัปเดตรหัสผ่านใหม่สำเร็จ');
    setPasswordMsg({ success: true, text: 'เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 3500);
  };

  const userLogs = logs.filter((l) => l.userId === currentUser.id || currentUser.role === 'admin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ข้อมูลผู้ใช้งานและความปลอดภัย (User Profile & Security)
              </h3>
              <p className="text-[11px] text-slate-500">
                จัดการโปรไฟล์, เปลี่ยนรหัสผ่าน, และบันทึกประวัติการเข้าใช้งาน
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

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ข้อมูลส่วนตัว
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'password'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            เปลี่ยนรหัสผ่าน
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ประวัติการใช้งาน (Log)
          </button>
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {isSaved && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว</span>
              </div>
            )}

            {/* Avatar Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <img
                src={avatarUrl}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/30"
              />
              <div className="flex-1 space-y-1">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                  URL รูปโปรไฟล์ (Image URL)
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รหัสนักศึกษา / รหัสอาจารย์
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                สังกัดแผนกวิชา / ระดับชั้น
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูลส่วนตัว</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            {passwordMsg && (
              <div
                className={`p-3 rounded-2xl border flex items-center gap-2 ${
                  passwordMsg.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200'
                }`}
              >
                {passwordMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Key className="w-4 h-4 text-rose-500" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                รหัสผ่านเดิม
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ยืนยันรหัสผ่านใหม่อีกครั้ง
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>อัปเดตรหัสผ่านใหม่</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Log System */}
        {activeTab === 'logs' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>ประวัติกิจกรรมและความปลอดภัยของระบบ</span>
              <span className="font-mono font-bold text-cyan-600">{userLogs.length} รายการ</span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {userLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {log.action}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{log.details}</p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>โดย: {log.userName}</span>
                    <span>•</span>
                    <span className="font-mono">IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
