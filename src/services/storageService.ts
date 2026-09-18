import { Room, Booking, User, IssueReport, AuditLog, RoomId, BookingStatus } from '../types';
import { INITIAL_ROOMS, INITIAL_BOOKINGS, INITIAL_USERS, INITIAL_REPORTS, INITIAL_LOGS } from '../data/initialData';

const STORAGE_KEYS = {
  ROOMS: 'dbt_lab_rooms_v1',
  BOOKINGS: 'dbt_lab_bookings_v1',
  USERS: 'dbt_lab_users_v1',
  CURRENT_USER_ID: 'dbt_lab_current_user_id_v1',
  ISSUES: 'dbt_lab_issues_v1',
  LOGS: 'dbt_lab_logs_v1',
  THEME: 'dbt_lab_theme_v1',
};

export const StorageService = {
  getRooms: (): Room[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    return INITIAL_ROOMS;
  },

  saveRooms: (rooms: Room[]) => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  },

  getBookings: (): Booking[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  },

  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUserId: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-student-01';
  },

  setCurrentUserId: (id: string) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  getCurrentUser: (): User => {
    const users = StorageService.getUsers();
    const currentId = StorageService.getCurrentUserId();
    const found = users.find((u) => u.id === currentId);
    return found || users[0] || INITIAL_USERS[0];
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
  },

  getTheme: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
  },

  saveTheme: (isDark: boolean) => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  },

  getIssues: (): IssueReport[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  },

  saveIssues: (issues: IssueReport[]) => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  },

  getLogs: (): AuditLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  },

  addLog: (user: User, action: string, details: string) => {
    const logs = StorageService.getLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('th-TH'),
      userId: user.id,
      userName: user.name,
      role: user.role,
      action,
      details,
      ip: '192.168.30.' + Math.floor(Math.random() * 200 + 10),
    };
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
    return updated;
  },

  // Conflict detection
  checkTimeConflict: (
    roomId: RoomId,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): { hasConflict: boolean; conflictingBooking?: Booking } => {
    const bookings = StorageService.getBookings();
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const targetStart = toMinutes(startTime);
    const targetEnd = toMinutes(endTime);

    for (const b of bookings) {
      if (b.id === excludeBookingId) continue;
      if (b.roomId !== roomId) continue;
      if (b.date !== date) continue;
      if (b.status === 'cancelled' || b.status === 'rejected') continue;

      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);

      // Overlap condition: not (targetEnd <= bStart or targetStart >= bEnd)
      if (!(targetEnd <= bStart || targetStart >= bEnd)) {
        return { hasConflict: true, conflictingBooking: b };
      }
    }

    return { hasConflict: false };
  },

  // Generate unique booking code
  generateBookingCode: (roomId: RoomId): string => {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = Math.floor(100 + Math.random() * 900);
    return `DBT-${roomId}-${datePart}-${randomPart}`;
  },

  // Export to CSV
  exportBookingsToCSV: (bookings: Booking[]) => {
    const headers = ['รหัสการจอง', 'ห้อง', 'ผู้จอง', 'สถานะผู้ใช้', 'รหัสประจำตัว', 'เบอร์โทร', 'วันที่', 'เวลาเริ่ม', 'เวลาสิ้นสุด', 'วัตถุประสงค์', 'จำนวนคน', 'สถานะ', 'วันที่สร้าง'];
    const rows = bookings.map(b => [
      b.bookingCode,
      b.roomName,
      b.userName,
      b.userRole === 'student' ? 'นักศึกษา' : b.userRole === 'teacher' ? 'อาจารย์' : 'ผู้ดูแล',
      b.userCode,
      b.userPhone,
      b.date,
      b.startTime,
      b.endTime,
      b.purposeDetail.replace(/,/g, ' '),
      b.attendeeCount,
      b.status,
      b.createdAt,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DBT_Lab_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  resetToDefault: () => {
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ISSUES);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    window.location.reload();
  }
};
