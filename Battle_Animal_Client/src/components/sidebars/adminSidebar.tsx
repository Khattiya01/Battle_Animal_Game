"use client";

import { SidebarItem } from "./sidebarItem";
import { SidebarItemLogout } from "./sidebarItemLogout";
import { HiOutlineUsers } from "react-icons/hi2";

const AdminSidebar = () => {
  // states
  const ListSidebarItems: {
    icon: JSX.Element;
    name: string;
    path: string;
    disabled?: boolean;
  }[] = [
    {
      icon: <HiOutlineUsers style={{ width: "24px", height: "24px" }} />,
      name: "จัดการผู้ใช้",
      path: `/admin/manage-users`,
    },
    {
      icon: <HiOutlineUsers style={{ width: "24px", height: "24px" }} />,
      name: "จัดการเกมส์",
      path: `/admin/manage-games`,
    },
  ];

  return (
    <section
      style={{ boxShadow: "4px 2px 12px 0px #0A0A100F" }}
      className=" sm:w-[256px] w-[64px] h-[calc(100vh-48px)] relative z-10 "
    >
      <div className=" sm:w-[260px] w-[64px] h-[calc(100vh-126px)] overflow-y-auto">
        {ListSidebarItems.map((item) => {
          return (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              path={item.path}
              disabled={item.disabled}
            />
          );
        })}
      </div>

      <div className=" fixed bottom-4 ">
        <SidebarItemLogout />
      </div>
    </section>
  );
};

export default AdminSidebar;
