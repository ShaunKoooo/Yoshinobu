// Navigation types for type-safe navigation

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
