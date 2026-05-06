import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";
import { ConfigProvider } from "antd";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import Layout from "@/components/Layout";
import { RoleProvider } from '@/context/RoleContext';

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
        headerBg: "#f8fafc", // Nên để nền sáng cho header table để nổi bật text
        headerColor: "#475569",
        headerFontWeight: 700,
      }
    },
  }), []);

  return (
    <ConfigProvider locale={locale} theme={themeConfig}>
      {/* 
        BƯỚC QUAN TRỌNG: 
        RoleProvider phải bọc ngoài cùng (hoặc ngay dưới ConfigProvider)
        để cả Layout và Component bên trong đều dùng chung một "kho" dữ liệu.
      */}
      <RoleProvider> 
        <Layout>
          <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            <Component {...pageProps} />
          </div>
        </Layout>
      </RoleProvider>
    </ConfigProvider>
  );
}