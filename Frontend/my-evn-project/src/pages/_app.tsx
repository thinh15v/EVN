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
      colorPrimary: "#00529C",
      borderRadius: 8,
      colorBgContainer: "#ffffff",
    },
    components: {
      Layout: {
        headerBg: "#ffffff", // Màu Header trắng đồng bộ thiết kế
      },
      Table: {
        headerBg: "#f8fafc",
        headerColor: "#475569",
        headerFontWeight: 700,
      }
    },
  }), []);

  return (
    <ConfigProvider locale={locale} theme={themeConfig}>
      <RoleProvider> 
        <Layout>
          {/* QUAN TRỌNG: Xóa bỏ thẻ div bọc ngoài Component cũ */}
          <Component {...pageProps} />
        </Layout>
      </RoleProvider>
    </ConfigProvider>
  );
}