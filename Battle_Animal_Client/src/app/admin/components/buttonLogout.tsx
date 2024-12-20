"use client";

import { signOut } from "next-auth/react";
import React from "react";

const ButtonLogout = () => {
  const handleLogout = async () => {
    await signOut();
  };
  return <button onClick={handleLogout}>ออกจากระบบ</button>;
};

export default ButtonLogout;
