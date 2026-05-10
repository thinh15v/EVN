// src/services/AuthService.ts
import Cookies from 'js-cookie';

export const AuthService = {
  // Hàm đăng nhập mô phỏng
  loginMock: async (username: string) => {
    try {
      const response = await fetch(`http://localhost:5048/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Gửi password mặc định vì Backend mock của bạn đang bỏ qua password
        body: JSON.stringify({ username: username, password: 'any_password' }) 
      });

      if (!response.ok) {
        throw new Error('Tài khoản không tồn tại hoặc lỗi máy chủ');
      }

      const resData = await response.json();
      const userData = resData.data || resData; // Tùy cấu trúc trả về của C#
      const userId = userData.id || userData.userId;

      // Lưu Token vào Cookie để các Service khác (như ReportService) tự động lấy dùng
      if (userData && userData.token) {
        Cookies.set('accessToken', userData.token, { expires: 1 }); // Hết hạn sau 1 ngày
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('currentUserId', userId.toString());
        return { success: true, data: userData };
        
      }
      
        
      
      return { success: false, message: "Không tìm thấy token" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Hàm đăng xuất
  logout: () => {
    Cookies.remove('accessToken');
    localStorage.removeItem('currentUser');
  }
};