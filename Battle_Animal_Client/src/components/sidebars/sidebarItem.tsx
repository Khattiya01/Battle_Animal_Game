'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type SidebarItemProps = {
  icon: ReactNode;
  name: string;
  path: string;
  disabled?: boolean;
};

export const SidebarItem = (props: SidebarItemProps) => {
  const pathName = usePathname();
  const pathWithIndex = pathName.split('/')[2];
  const path = props.path.replace('/', '');
  const isActivePath = path.includes(pathWithIndex);

  const activeClassName = isActivePath ? 'text-text_main_blue border-l-[#074E9F] bg-bg_main' : 'border-l-white';

  return (
    <Link
      href={props.path}
      className={twMerge(
        `sm:w-[256px] w-[60px] h-[64px] p-4 flex gap-2  border-l-[4px]  hover:bg-bg_main  active:text-text_main_blue cursor-pointer ${
          props.disabled ? 'pointer-events-none bg-stone-50' : ''
        }`,
        activeClassName
      )}
    >
      {props.icon}
      <div className=" text-4 leading-6 font-normal hidden sm:block">{props.name}</div>
    </Link>
  );
};
