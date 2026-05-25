import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TỰ ĐỘNG GẮN TOKEN VÀO MỌI REQUEST
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// TỰ ĐỘNG BẮT LỖI TỪ BACKEND C# VÀ ĐỊNH DẠNG LẠI
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu request thành công, chỉ lấy phần data
    return response;
  },
  (error) => {
    // Định dạng lại lỗi sao cho khớp với cách UI đang xử lý (error.message)
    const errorData = error.response?.data;
    let errorMessage = 'Lỗi từ máy chủ API C#';

    if (errorData) {
      if (errorData.errors) {
        // Gộp các lỗi validation từ C# (VD: thiếu tên, sai ngày...)
        errorMessage = Object.values(errorData.errors).flat().join(' | ');
      } else {
        errorMessage = errorData.message || errorData.title || errorMessage;
      }
    }

    // Ném ra một Error object chuẩn, để bên UI chỉ cần gọi error.message là lấy được
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;