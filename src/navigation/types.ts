// Navigation types for type-safe navigation

// Root Stack (包含 Tab Navigator 和獨立畫面)
export type RootStackParamList = {
  AdminTabs: undefined;
  ClientTabs: undefined;
  AddCustomer: undefined;
  AddContract: undefined;
  AddBooking: undefined;
  CustomerDetail: { customerId?: string };
};

// 管理者後台 Tabs
export type AdminTabParamList = {
  CustomerManagement: undefined;  // 客戶管理
  CourseManagement: undefined;    // 課程管理
  Notifications: undefined;       // 通知 (shared with User)
  Profile: undefined;             // 我的 (shared with User)
};

// 客戶端 Tabs (Client)
export type ClientTabParamList = {
  Home: undefined;                // 首頁
  Courses: undefined;             // 課程
  Notifications: undefined;       // 通知
  Profile: undefined;             // 我的
};
