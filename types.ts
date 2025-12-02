export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended'
}

export interface User {
  id: string;
  uid: string; // RFID UID
  name: string;
  nim: string;
  email: string;
  status: UserStatus;
  lastActive: string;
  currentLockerId?: string | null;
}

export enum LockerStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  MAINTENANCE = 'Maintenance'
}

export interface Locker {
  id: string;
  number: number;
  status: LockerStatus;
  currentUserId?: string | null;
  lastUpdated: string;
}

export enum LogType {
  STORE = 'Store',
  RETRIEVE = 'Retrieve',
  REGISTER = 'Register',
  ERROR = 'Error'
}

export interface ActivityLog {
  id: string;
  type: LogType;
  timestamp: string;
  userId: string;
  userName: string;
  lockerId?: string;
  lockerNumber?: number;
  details?: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  avatarUrl: string;
}
