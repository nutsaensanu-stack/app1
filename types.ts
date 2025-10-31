// FIX: Define all the application's shared types in this file.

export enum DriverStatus {
    Active = "Active",
    Inactive = "Inactive",
}

export enum AssignmentStatus {
    Completed = "Completed",
    InProgress = "In Progress",
    Pending = "Pending",
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Driver {
    id: string;
    name: string;
    shift: 'Day' | 'Night';
    holidayDate: string;
    phone: string;
    licenseType: string;
    status: DriverStatus;
    currentLocation?: LatLng;
}

export interface PickupPoint {
    id: string;
    groupName: string;
    name: string;
    address: string;
    gps: LatLng;
    contactPerson: string;
    contactPhone: string;
}

export interface Assignment {
    id: string;
    driverId: string;
    pickupPointId: string;
    assignmentDate: string;
    status: AssignmentStatus;
    notes: string;
}
