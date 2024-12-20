import Image from "next/image"; // Import Image from next/image
import React from "react";

const LoginLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen h-screen flex">
      <div className="  sm:w-[50%] w-0 relative"> 
        <Image
          src="/images/login-game.webp"
          alt="background_login"
          layout="fill" 
          objectFit="cover" 
          quality={100} 
        />
      </div>
      <div className="bg-white w-[100%] sm:w-[50%] px-[32px] py-[40px]  overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
