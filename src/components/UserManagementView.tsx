import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  GraduationCap,
  Award,
  Lock,
  CheckCircle2,
  X,
  Phone,
  Mail
} from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementViewProps {
  users: User[];
  onSaveUsers: (updatedUsers: User[]) => void;
  currentUser: User;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onSaveUsers,
  currentUser,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDepartment, setNewDepartment] = useState('แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleChangeRole = (userId: string, targetRole: UserRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u));
    onSaveUsers(updated);
  };

  const handleToggleStatus = (userId: string) => {
    const updated = users.map((u) =>
      u.id === userId
        ? { ...u, status: (u.status === 'active' ? 'suspended' : 'active') as any }
        : u
    );
    onSaveUsers(updated);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newName,
      code: newCode,
      role: newRole,
      email: newEmail || `${newCode}@dbt.ac.th`,
      phone: newPhone || '08x-xxx-xxxx',
      department: newDepartment,
      avatarUrl:
        newRole === 'student'
          ? 'https://cdn.phototourl.com/free/2026-09-18-db820fe9-d2e8-4d27-a941-b13f06ad62e9.jpg'
          : 'https://cdn.phototourl.com/free/2026-09-18-88394a56-ccc2-41d8-85bc-242449e3b914.jpg',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    onSaveUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setNewName('');
    setNewCode('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            จัดการข้อมูลผู้ใช้งานและสิทธิ์ (User & RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            กำหนดบทบาทการเข้าถึง (Student, Teacher, Admin) และจัดการสถานะผู้ใช้งาน
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4" />
          <span>เพิ่มผู้ใช้งานใหม่</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'student', label: 'นักศึกษา' },
            { id: 'teacher', label: 'อาจารย์ผู้สอน' },
            { id: 'admin', label: 'ผู้ดูแลระบบ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                roleFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัส, อีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4">ผู้ใช้งาน</th>
                <th className="p-4">รหัสประจำตัว</th>
                <th className="p-4">แผนกวิชา</th>
                <th className="p-4">สิทธิ์การใช้งาน (Role)</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-semibold">
                        {user.name}
                      </strong>
                      <span className="text-[11px] text-slate-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {user.code}
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {user.department}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
                    >
                      <option value="student">🎓 นักศึกษา (Student)</option>
                      <option value="teacher">👨‍🏫 อาจารย์ (Teacher)</option>
                      <option value="admin">🛡️ ผู้ดูแลระบบ (Admin)</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {user.status === 'active' ? 'ปกติ' : 'ระงับชั่วคราว'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline"
                    >
                      {user.status === 'active' ? 'ระงับสิทธิ์' : 'เปิดใช้งาน'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                เพิ่มผู้ใช้งานใหม่เข้าระบบ
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น นายพงศกร สดใส"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    รหัสนักศึกษา / รหัสอาจารย์ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 66309010099"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    สิทธิ์การใช้งาน (Role)
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="student">นักศึกษา (Student)</option>
                    <option value="teacher">อาจารย์ผู้สอน (Teacher)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  placeholder="student@dbt.ac.th"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  placeholder="08x-xxx-xxxx"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs"
                >
                  บันทึกผู้ใช้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
