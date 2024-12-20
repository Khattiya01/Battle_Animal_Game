import LoginLayout from "@/components/layouts/loginLayout";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <LoginLayout>{children} </LoginLayout>;
};

export default Layout;
