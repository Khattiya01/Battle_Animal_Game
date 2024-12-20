import AdminLayout from "@/components/layouts/adminLayout";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AdminLayout>{children} </AdminLayout>;
};

export default Layout;
