import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";
import { ConfigProvider, theme } from "antd";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const themeConfig = useMemo(() => ({
    token: {
      colorPrimary: "#00529C", // Màu xanh chuẩn EVN
      borderRadius: 8,
      colorBgContainer: "#ffffff",
    },
    components: {
      Layout: {
        headerBg: "#00529C",
      },
      Table: {
        headerBg: "#00529C",
        headerColor: "#ffffff",
      }
    },
  }), []);

  return (
    <ConfigProvider locale={locale} theme={themeConfig}>
      {/* 
        SỬA TẠI ĐÂY: 
        Bạn phải bọc <Layout> bên ngoài <Component /> 
        thì trang web mới hiện ra Sidebar và Header.
      */}
      <Layout>
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
          <Component {...pageProps} />
        </div>
      </Layout>
    </ConfigProvider>
  );
}