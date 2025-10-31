export const translations = {
  en: {
    // General
    appName: 'DriverApp',
    status: 'Status',
    actions: 'Actions',
    search: 'Search...',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    
    // Sidebar
    dashboard: 'Dashboard',
    driverManagement: 'Driver Management',
    drivers: 'Drivers',
    pickupPoints: 'Pickup Points',
    assignments: 'Assignments',
    reports: 'Reports',
    mapView: 'Map View',
    settings: 'Settings',
    collapseSidebar: 'Collapse',

    // Driver Management View (New Dashboard)
    driverManagementDesc: 'Manage driver and pickup point data',
    staff: 'Staff',
    pickupGroups: 'Pickup Groups',
    reload: 'Reload',
    reset: 'Reset',
    groupBtn: 'Group',
    workload: 'Workload',
    aiSuggest: 'AI Suggest',
    totalDrivers: 'Total Drivers',
    workingToday: 'Working Today',
    onLeave: 'On Leave',
    totalGroups: 'Groups',
    pickupPointCopyStatus: 'Pickup Point ID Copy Status', // Kept for legacy if needed, but new UI uses assignmentStatus
    pickupPointsLabel: 'Pickup Points',
    noGroup: 'No Group',
    noInfo: 'No Information',
    noAssignments: 'No assignments for today.',
    
    // Dashboard View (Legacy - some keys reused)
    activeDrivers: 'Active Drivers',
    todaysAssignments: "Today's Assignments",
    assignmentStatus: 'Assignment Status',
    recentAssignments: 'Recent Assignments',
    driver: 'Driver',
    date: 'Date',

    // Drivers View
    manageDrivers: 'Manage Drivers',
    addDriver: 'Add Driver',
    editDriver: 'Edit Driver',
    name: 'Name',
    phone: 'Phone',
    shift: 'Shift',
    license: 'License',

    // Pickup Points View
    managePickupPoints: 'Manage Pickup Points',
    addPoint: 'Add Point',
    address: 'Address',
    group: 'Group',
    contactPerson: 'Contact Person',

    // Assignments View
    manageAssignments: 'Manage Assignments',
    addAssignment: 'Add Assignment',
    notes: 'Notes',

    // Reports View
    reportsAndStats: 'Reports & Statistics',
    assignmentsPerDriver: 'Assignments per Driver',
    activeDriverShiftDist: 'Active Driver Shift Distribution',
    exportData: 'Export Data',
    exportAllCSV: 'Export All Data (CSV)',
    downloadMonthlyPDF: 'Download Monthly Report (PDF)',

    // Map View
    liveMapView: 'Live Map View',
    todaysRoutes: "Today's Routes",
    stops: 'stops',
    aiSuggestRoute: 'AI Suggest Route',
    generating: 'Generating...',
    aiRouteSuggestion: 'AI Route Suggestion',
    sources: 'Sources',
    locationError: 'Could not get your location. Please enable location services and try again.',
    aiError: 'Failed to get suggestions from AI. Please try again later.',
    aiRoutePrompt: 'You are a logistics coordinator. Based on my current location and the current time of day, suggest the shortest and fastest route to visit the following pickup points today. Please factor in typical traffic conditions.',
    noRoutesMap: 'No routes or drivers to display on the map.',
    mapLegend: 'Map Legend',
    driverLocation: 'Driver Location',
    pickupLocation: 'Pickup Location',

    // Settings View
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    dataManagement: 'Data Management',
    importExportDesc: 'Import or export your application data.',
    importCSV: 'Import from CSV',
    importBtn: 'Import',
    backupJSON: 'Backup to JSON',
    uploading: 'Uploading...',
    language: 'Language',
    selectLanguage: 'Select Language',
    csvImportError: 'Error importing data. Please check the file format and try again.',
    csvInvalidFormat: 'Invalid or empty CSV file. A header and at least one data row are required.',
    csvUnknownFormat: 'Unknown CSV format. Could not identify the required headers for this data type.',
    importedSuccessfully: 'imported successfully',
    downloadTemplate: 'Download Template',
    resetData: 'Reset Application Data',
    resetDataDesc: 'This will delete all your data and restore the initial mock data.',
    resetBtn: 'Reset Data',
    resetDataConfirmation: 'Are you sure you want to reset all application data? This action cannot be undone.',

    // Chatbot
    aiAssistant: 'AI Assistant',
    welcomeMessage: 'Hello! I am your AI assistant. How can I help you with the driver data today?',
    typeYourMessage: 'Type your message...',

  },
  th: {
    // General
    appName: 'ไดร์เวอร์แอป',
    status: 'สถานะ',
    actions: 'การดำเนินการ',
    search: 'ค้นหา...',
    cancel: 'ยกเลิก',
    saveChanges: 'บันทึกการเปลี่ยนแปลง',

    // Sidebar
    dashboard: 'แดชบอร์ด',
    driverManagement: 'จัดการคนขับ',
    drivers: 'พนักงานขับรถ',
    pickupPoints: 'จุดรับส่ง',
    assignments: 'งานที่ได้รับมอบหมาย',
    reports: 'รายงาน',
    mapView: 'มุมมองแผนที่',
    settings: 'การตั้งค่า',
    collapseSidebar: 'ย่อแถบข้าง',
    
    // Driver Management View (New Dashboard)
    driverManagementDesc: 'จัดการข้อมูลพนักงานและจุดรับส่ง',
    staff: 'พนักงาน',
    pickupGroups: 'กลุ่มจุดรับ',
    reload: 'โหลดใหม่',
    reset: 'รีเซ็ต',
    groupBtn: 'รวมกลุ่ม',
    workload: 'Workload',
    aiSuggest: 'AI แนะนำ',
    totalDrivers: 'พนักงานทั้งหมด',
    workingToday: 'ทำงานวันนี้',
    onLeave: 'ลาหยุด',
    totalGroups: 'กลุ่ม',
    pickupPointCopyStatus: 'สถานะการคัดลอก ID จุดรับ', // Kept for legacy, new UI uses assignmentStatus
    pickupPointsLabel: 'จุดรับ',
    noGroup: 'ไม่มีกลุ่ม',
    noInfo: 'ไม่พบข้อมูล',
    noAssignments: 'วันนี้ไม่มีงานที่ได้รับมอบหมาย',

    // Dashboard View (Legacy - some keys reused)
    activeDrivers: 'พนักงานที่พร้อมใช้งาน',
    todaysAssignments: 'งานวันนี้',
    assignmentStatus: 'สถานะงาน',
    recentAssignments: 'งานล่าสุด',
    driver: 'พนักงานขับรถ',
    date: 'วันที่',

    // Drivers View
    manageDrivers: 'จัดการพนักงานขับรถ',
    addDriver: 'เพิ่มพนักงานขับรถ',
    editDriver: 'แก้ไขข้อมูลคนขับ',
    name: 'ชื่อ',
    phone: 'เบอร์โทร',
    shift: 'กะ',
    license: 'ใบอนุญาต',

    // Pickup Points View
    managePickupPoints: 'จัดการจุดรับส่ง',
    addPoint: 'เพิ่มจุดรับส่ง',
    address: 'ที่อยู่',
    group: 'กลุ่ม',
    contactPerson: 'ผู้ติดต่อ',

    // Assignments View
    manageAssignments: 'จัดการงาน',
    addAssignment: 'เพิ่มงาน',
    notes: 'หมายเหตุ',

    // Reports View
    reportsAndStats: 'รายงานและสถิติ',
    assignmentsPerDriver: 'จำนวนงานต่อพนักงานขับรถ',
    activeDriverShiftDist: 'การกระจายกะของพนักงาน',
    exportData: 'ส่งออกข้อมูล',
    exportAllCSV: 'ส่งออกข้อมูลทั้งหมด (CSV)',
    downloadMonthlyPDF: 'ดาวน์โหลดรายงานประจำเดือน (PDF)',

    // Map View
    liveMapView: 'มุมมองแผนที่สด',
    todaysRoutes: 'เส้นทางวันนี้',
    stops: 'จุด',
    aiSuggestRoute: 'AI แนะนำเส้นทาง',
    generating: 'กำลังสร้าง...',
    aiRouteSuggestion: 'เส้นทางที่ AI แนะนำ',
    sources: 'แหล่งข้อมูล',
    locationError: 'ไม่สามารถเข้าถึงตำแหน่งของคุณได้ โปรดเปิดใช้งานบริการตำแหน่งแล้วลองอีกครั้ง',
    aiError: 'ไม่สามารถรับคำแนะนำจาก AI ได้ โปรดลองอีกครั้งในภายหลัง',
    aiRoutePrompt: 'คุณคือผู้ประสานงานด้านโลจิสติกส์ จากตำแหน่งปัจจุบันของฉันและช่วงเวลาของวัน โปรดแนะนำเส้นทางที่สั้นและเร็วที่สุดเพื่อไปยังจุดรับส่งต่อไปนี้สำหรับวันนี้ โปรดพิจารณาสภาพการจราจรโดยทั่วไปด้วย',
    noRoutesMap: 'ไม่มีเส้นทางหรือคนขับที่จะแสดงบนแผนที่',
    mapLegend: 'คำอธิบายแผนที่',
    driverLocation: 'ตำแหน่งคนขับ',
    pickupLocation: 'ตำแหน่งจุดรับส่ง',

    // Settings View
    appearance: 'ลักษณะ',
    darkMode: 'โหมดมืด',
    dataManagement: 'การจัดการข้อมูล',
    importExportDesc: 'นำเข้าหรือส่งออกข้อมูลแอปพลิเคชันของคุณ',
    importCSV: 'นำเข้าจาก CSV',
    importBtn: 'นำเข้า',
    backupJSON: 'สำรองข้อมูลเป็น JSON',
    uploading: 'กำลังอัปโหลด...',
    language: 'ภาษา',
    selectLanguage: 'เลือกภาษา',
    csvImportError: 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล โปรดตรวจสอบรูปแบบไฟล์แล้วลองอีกครั้ง',
    csvInvalidFormat: 'ไฟล์ CSV ไม่ถูกต้องหรือว่างเปล่า ต้องมีส่วนหัวและข้อมูลอย่างน้อยหนึ่งแถว',
    csvUnknownFormat: 'ไม่รู้จักรูปแบบ CSV ไม่สามารถระบุส่วนหัวที่จำเป็นสำหรับข้อมูลประเภทนี้ได้',
    importedSuccessfully: 'ถูกนำเข้าเรียบร้อยแล้ว',
    downloadTemplate: 'ดาวน์โหลดเทมเพลต',
    resetData: 'รีเซ็ตข้อมูลแอปพลิเคชัน',
    resetDataDesc: 'การดำเนินการนี้จะลบข้อมูลทั้งหมดของคุณและกู้คืนข้อมูลเริ่มต้น',
    resetBtn: 'รีเซ็ตข้อมูล',
    resetDataConfirmation: 'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลแอปพลิเคชันทั้งหมด? การกระทำนี้ไม่สามารถยกเลิกได้',

    // Chatbot
    aiAssistant: 'ผู้ช่วย AI',
    welcomeMessage: 'สวัสดีครับ ผมคือผู้ช่วย AI ของคุณ วันนี้มีอะไรให้ช่วยเกี่ยวกับข้อมูลคนขับบ้างครับ?',
    typeYourMessage: 'พิมพ์ข้อความของคุณ...',
  },
};

export type TranslationKey = keyof (typeof translations)['en'];

export const getTranslator = (lang: 'en' | 'th') => {
  return (key: TranslationKey): string => {
    return translations[lang][key] || translations['en'][key];
  };
};