// Navigation types for type-safe navigation

// Root Stack (包含 Tab Navigator 和獨立畫面)
export type RootStackParamList = {
  AdminTabs: undefined;
  AddCustomer: undefined;
  AddContract: undefined;
  CustomerDetail: { customerId?: string };
};

// 管理者後台 Tabs
export type AdminTabParamList = {
  CustomerManagement: undefined;  // 客戶管理
  CourseManagement: undefined;    // 課程管理
  Notifications: undefined;       // 通知 (shared with User)
  Profile: undefined;             // 我的 (shared with User)
};

// 使用者端 Tabs
export type UserTabParamList = {
  Home: undefined;                // 首頁
  Courses: undefined;             // 課程
  Shop: undefined;                // 商城
  Notifications: undefined;       // 通知 (shared with Admin)
  Profile: undefined;             // 我的 (shared with Admin)
};
