import Cookies from 'js-cookie';
import axiosClient from '@/utils/axiosClient';

export const AuthService = {
  // Thêm Promise<any> vào đây để TypeScript biết hàm trả về dữ liệu động
  loginMock: async (username: string): Promise<any> => {
    try {
      // 1. axiosClient đã có sẵn BASE_URL, tự chuyển JSON nên code cực ngắn
      const response = await axiosClient.post('/api/Auth/login', {
        username: username,
        password: 'any_password' // Gửi password mặc định
      });

      // 2. Dữ liệu trả về đã được dịch sẵn JSON, chỉ việc lấy từ response.data
      const resData = response.data as any;
      const userData = resData.data || resData; // Tùy cấu trúc C#
      const userId = userData.id || userData.userId;

      // Lưu Token vào Cookie
      if (userData && userData.token) {
        Cookies.set('accessToken', userData.token, { expires: 1 });
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('currentUserId', userId.toString());
        
        return { success: true, data: userData };
      }
      
      return { success: false, message: "Không tìm thấy token" };

    } catch (error: any) {
      // 3. Nếu lỗi 400, 401, 500... axios sẽ nhảy thẳng vào đây. 
      // Do ta đã cấu hình file axiosClient.ts ở bước trước, error.message đã chứa sẵn lỗi tiếng Việt từ C#
      return { 
        success: false, 
        message: error.message || 'Tài khoản không tồn tại hoặc lỗi máy chủ' 
      };
    }
  },

  // Hàm đăng xuất không trả về gì nên để là void
  logout: (): void => {
    Cookies.remove('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId'); // Cũ của bạn quên xóa cái này, tôi bổ sung cho sạch nhé
  }
};