export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  code: string; // รหัสนักศึกษา หรือ รหัสอาจารย์
  role: UserRole;
  email: string;
  phone: string;
  department: string;
  avatarUrl: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export type RoomId = '311' | '312' | '314' | '315';

export interface SeatItem {
  id: string;
  name: string; // e.g. PC-01
  row: number;
  col: number;
  status: 'available' | 'reserved' | 'maintenance';
}

export interface Room {
  id: RoomId;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  computersCount: number;
  status: 'available' | 'maintenance' | 'occupied';
  description: string;
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
    os: string;
    monitors: string;
  };
  equipment: string[];
  image: string;
  color: string;
  seats: SeatItem[];
}

export type BookingPurpose = 'teaching' | 'exam_prep' | 'training' | 'project' | 'other';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'checked_in';

export interface Booking {
  id: string;
  bookingCode: string; // e.g. DBT-311-20260918-01
  roomId: RoomId;
  roomName: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userCode: string;
  userPhone: string;
  userEmail: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. 08:30
  endTime: string; // e.g. 10:30
  purpose: BookingPurpose;
  purposeDetail: string;
  attendeeCount: number;
  requestedEquipment: string[];
  selectedSeats: string[];
  status: BookingStatus;
  adminNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  checkedInAt?: string;
  createdAt: string;
  lineNotifySent?: boolean;
  emailSent?: boolean;
}

export interface IssueReport {
  id: string;
  roomId: RoomId;
  roomName: string;
  equipmentName: string;
  seatId?: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  reportedBy: string;
  reportedByRole: UserRole;
  reportedByContact: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  adminComment?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  ip: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  bookingId?: string;
}

export type TabType =
  | 'dashboard'
  | 'booking'
  | 'floorplan'
  | 'my-bookings'
  | 'approvals'
  | 'rooms'
  | 'users'
  | 'reports'
  | 'help';

