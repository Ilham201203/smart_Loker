import { User, UserStatus, Locker, LockerStatus, ActivityLog, LogType, AdminProfile } from './types';

export const ADMIN_PROFILE: AdminProfile = {
  name: "Budi Santoso",
  email: "admin@smartlocker.id",
  role: "Super Admin",
  lastLogin: "2023-10-27 08:30 AM",
  avatarUrl: "https://picsum.photos/200/200"
};

export const MOCK_USERS: User[] = [
  { id: 'u1', uid: 'RFID-99283', name: 'Ahmad Dani', nim: '2021001', email: 'ahmad@student.edu', status: UserStatus.ACTIVE, lastActive: '2 mins ago', currentLockerId: 'l1' },
  { id: 'u2', uid: 'RFID-11234', name: 'Siti Aminah', nim: '2021002', email: 'siti@student.edu', status: UserStatus.ACTIVE, lastActive: '1 hour ago', currentLockerId: null },
  { id: 'u3', uid: 'RFID-55667', name: 'Rudi Hartono', nim: '2021003', email: 'rudi@student.edu', status: UserStatus.INACTIVE, lastActive: '3 days ago', currentLockerId: null },
  { id: 'u4', uid: 'RFID-88990', name: 'Dewi Sartika', nim: '2021004', email: 'dewi@student.edu', status: UserStatus.ACTIVE, lastActive: '5 hours ago', currentLockerId: 'l5' },
  { id: 'u5', uid: 'RFID-33441', name: 'Bambang P', nim: '2021005', email: 'bambang@student.edu', status: UserStatus.SUSPENDED, lastActive: '1 week ago', currentLockerId: null },
];

export const MOCK_LOCKERS: Locker[] = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  if (num === 1) return { id: 'l1', number: num, status: LockerStatus.OCCUPIED, currentUserId: 'u1', lastUpdated: '10:00 AM' };
  if (num === 5) return { id: 'l5', number: num, status: LockerStatus.OCCUPIED, currentUserId: 'u4', lastUpdated: '08:30 AM' };
  if (num === 12) return { id: 'l12', number: num, status: LockerStatus.MAINTENANCE, currentUserId: null, lastUpdated: 'Yesterday' };
  return { id: `l${num}`, number: num, status: LockerStatus.AVAILABLE, currentUserId: null, lastUpdated: 'N/A' };
});

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'log1', type: LogType.STORE, timestamp: '2023-10-27 10:00:00', userId: 'u1', userName: 'Ahmad Dani', lockerId: 'l1', lockerNumber: 1 },
  { id: 'log2', type: LogType.RETRIEVE, timestamp: '2023-10-27 09:45:00', userId: 'u2', userName: 'Siti Aminah', lockerId: 'l2', lockerNumber: 2 },
  { id: 'log3', type: LogType.STORE, timestamp: '2023-10-27 08:30:00', userId: 'u4', userName: 'Dewi Sartika', lockerId: 'l5', lockerNumber: 5 },
  { id: 'log4', type: LogType.REGISTER, timestamp: '2023-10-26 14:20:00', userId: 'u5', userName: 'Bambang P', details: 'New user registration via RFID Kiosk' },
  { id: 'log5', type: LogType.ERROR, timestamp: '2023-10-26 11:00:00', userId: 'u3', userName: 'Rudi Hartono', details: 'Failed authentication attempt' },
];
