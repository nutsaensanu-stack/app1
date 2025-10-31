import { DriverStatus, AssignmentStatus } from '../types';
import type { Driver, PickupPoint, Assignment } from '../types';

const mockDrivers: Driver[] = [
  { id: '6554', name: 'อุเทนชัย เข้มสุข', shift: 'Day', holidayDate: '2024-11-03', phone: '081-234-5678', licenseType: 'CDL-A', status: DriverStatus.Active, currentLocation: { lat: 13.7650, lng: 100.5115 } },
  { id: '9037', name: 'มงคล พึ่งผ่อง', shift: 'Night', holidayDate: '2024-11-03', phone: '082-345-6789', licenseType: 'CDL-B', status: DriverStatus.Active, currentLocation: { lat: 13.7458, lng: 100.5220 } },
  { id: '9343', name: 'อนันต์ ดวงฤทธิ์', shift: 'Day', holidayDate: '2024-11-02', phone: '083-456-7890', licenseType: 'CDL-A', status: DriverStatus.Inactive },
  { id: '24099', name: 'วิรัตน์ ปางบางกระดี่', shift: 'Night', holidayDate: '2024-11-02', phone: '084-567-8901', licenseType: 'CDL-C', status: DriverStatus.Active },
  { id: '1005', name: 'สมชาย ใจดี', shift: 'Day', holidayDate: '2024-11-09', phone: '085-678-9012', licenseType: 'CDL-A', status: DriverStatus.Active, currentLocation: { lat: 13.7500, lng: 100.4900 } },
];

const mockPickupPoints: PickupPoint[] = [
  { id: 'PUP2025102408BH4', groupName: '[S] HBKTH (4W) -03', name: 'คลังสินค้า A', address: '123 ถนนเหนือ, เมือง', gps: { lat: 13.7563, lng: 100.5018 }, contactPerson: 'ผู้จัดการ A', contactPhone: '02-111-2222' },
  { id: 'PUP202510240KL14', groupName: '[S] HBKTH (4W) -03', name: 'N/A (ไม่พบข้อมูล)', address: '456 ถนนเหนือ, เมือง', gps: { lat: 13.7570, lng: 100.5020 }, contactPerson: 'ผู้ดูแล B', contactPhone: '02-222-3333' },
  { id: 'PUP2024060402609', groupName: '[S] HBKTH (4W) -03', name: 'JQ', address: '789 ถนนใต้, เมือง', gps: { lat: 13.7550, lng: 100.5000 }, contactPerson: 'หัวหน้า C', contactPhone: '02-333-4444' },
  { id: 'PUP202509110H1N0', groupName: '[S] HBKTH (4W) -03', name: 'FURNITURELIGHTING', address: '101 ถนนตะวันออก, เมือง', gps: { lat: 13.7565, lng: 100.5035 }, contactPerson: 'เจ้าของ D', contactPhone: '02-444-5555' },
  { id: 'PUP2022091406FCK', groupName: '[S] HBKTH (4W) -04', name: 'hardware8', address: '212 ถนนใต้, เมือง', gps: { lat: 13.7540, lng: 100.5005 }, contactPerson: 'เสมียน E', contactPhone: '02-555-6666' },
  { id: 'PUP2023120203AFR', groupName: '[S] HBKTH (4W) -04', name: 'N/A (ไม่พบข้อมูล)', address: '333 ถนนตะวันตก, เมือง', gps: { lat: 13.7580, lng: 100.5040 }, contactPerson: 'ผู้ควบคุม F', contactPhone: '02-666-7777' },
  { id: 'PUP202510230KHQP', groupName: 'ไม่มีกลุ่ม', name: 'N/A (ไม่พบข้อมูล)', address: '111 ถนนหลัก, เมือง', gps: { lat: 13.7590, lng: 100.5050 }, contactPerson: 'G', contactPhone: '02-777-8888' },
];

const mockAssignments: Assignment[] = [
  { id: 'A001', driverId: '6554', pickupPointId: 'PUP2025102408BH4', assignmentDate: '2024-10-31', status: AssignmentStatus.Completed, notes: 'ส่งตรงเวลา' },
  { id: 'A002', driverId: '6554', pickupPointId: 'PUP202510240KL14', assignmentDate: '2024-10-31', status: AssignmentStatus.Completed, notes: '' },
  { id: 'A003', driverId: '9037', pickupPointId: 'PUP202510230KHQP', assignmentDate: '2024-10-31', status: AssignmentStatus.InProgress, notes: 'ล่าช้าเล็กน้อยเนื่องจากการจราจร' },
  { id: 'A004', driverId: '24099', pickupPointId: 'PUP2024060402609', assignmentDate: '2024-10-31', status: AssignmentStatus.Pending, notes: 'กำหนดรับช่วงเย็น' },
  { id: 'A005', driverId: '1005', pickupPointId: 'PUP202509110H1N0', assignmentDate: '2024-10-31', status: AssignmentStatus.Pending, notes: '' },
  { id: 'A006', driverId: '9343', pickupPointId: 'PUP2022091406FCK', assignmentDate: '2024-10-31', status: AssignmentStatus.Pending, notes: '' },
  { id: 'A007', driverId: '6554', pickupPointId: 'PUP2023120203AFR', assignmentDate: '2024-10-31', status: AssignmentStatus.Pending, notes: '' },
];

export {
    mockDrivers,
    mockPickupPoints,
    mockAssignments
};
