import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Thêm đoạn này để tự động chuyển hướng từ "/" sang "/report"
  async redirects() {
    return [
      {
        source: '/',           // Trang gốc
        destination: '/report', // Trang đích
        permanent: true,       // Trình duyệt sẽ nhớ lựa chọn này (301 redirect)
      },
    ];
  },
};

export default nextConfig;