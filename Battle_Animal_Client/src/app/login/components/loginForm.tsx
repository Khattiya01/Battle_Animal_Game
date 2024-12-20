"use client";

import InputFormLogin from "@/app/login/components/inputFormLogin";
import { Box, Spinner, Text } from "@radix-ui/themes";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import InputFormPassword from "./inputFormPassword";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

import { signIn } from "next-auth/react";
import { loginType } from "@/types/requests/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginSchema } from "@/schemas/auth";

type LoginFormProps = {
  logoURL: string;
};
const LoginForm = (props: LoginFormProps) => {
  const { logoURL } = props;
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get("error");

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<loginType>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginType) => {
    setIsLoadingLogin(true);
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      callbackUrl: "/admin/manage-users",
    })
      .then(() => {
        setIsLoadingLogin(false);
      })
      .catch(() => {
        setIsLoadingLogin(false);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="  max-w-[406px] sm:mt-[80px] mt-[40px] rounded-lg  p-4"
      >
        <Box className="relative w-[120px] h-[80px] ">
          <Image
            src={logoURL}
            alt="logo-main-website"
            layout="fill"
            objectFit="cover"
            className="hover:cursor-pointer hover:opacity-60 opacity-100 transition ease-in-out duration-300 "
          />
        </Box>
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginTop: "16px",
          }}
        >
          เข้าสู่ระบบบัญชีของคุณ
        </Text>
        <Box
          style={{
            width: "100%",
            maxWidth: "406px",
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {search === "not-found-user" && (
            <Text
              style={{
                fontSize: "14px",
                color: "red",
              }}
            >
              ชื่อผู้ใช้ที่คุณป้อนไม่ถูกต้อง
            </Text>
          )}
          {search === "invalid-password" && (
            <Text
              style={{
                fontSize: "14px",
                color: "red",
              }}
            >
              รหัสผ่านที่คุณป้อนไม่ถูกต้อง
            </Text>
          )}
          {search === "permission-denied" && (
            <Text
              style={{
                fontSize: "14px",
                color: "red",
              }}
            >
              ผู้ใช้งานนี้ไม่มีสิทธิ์เข้าถึง
            </Text>
          )}
          <InputFormLogin
            placeholder="ชื่อผู้ใช้หรือที่อยู่อีเมล"
            iconLeft={
              <FaUserCircle size={"22px"} className=" text-[#00337d]" />
            }
            onChange={(value) => {
              setValue("username", value);
            }}
            value={watch("username")}
            errorMessage={errors.username?.message}
          />
          <InputFormPassword
            placeholder="รหัสผ่าน"
            onChange={(value) => {
              setValue("password", value);
            }}
            value={watch("password")}
            errorMessage={errors.password?.message}
          />
          {/* <Box className=" text-end">
            <Link href={"/forgot-password"}>
              <Text className=" text-sm ">ลืมรหัสผ่านของคุณ?</Text>
            </Link>
          </Box> */}

          <Box className=" mt-2">
            <Link href={"/"} className=" flex gap-2 items-center">
              <FaAngleLeft size={"12px"} />
              <Text className=" text-sm">กลับไปที่ เว็บไซต์หลักของคุณ</Text>
            </Link>
          </Box>

          <button
            disabled={isLoadingLogin}
            type="submit"
            className=" bg-[#3e63dd] hover:bg-[#3e63ddcf] text-white px-[12px] py-[8px] rounded-md cursor-pointer text-center mt-8 flex gap-2 justify-center items-center"
          >
            {isLoadingLogin && <Spinner />}
            <Text>เข้าสู่ระบบ</Text>
          </button>
        </Box>
      </form>
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Text>Version 1.00</Text>
        <Text>© Copyright 2024 by gang rook jiab</Text>
      </Box>
    </>
  );
};

export default LoginForm;
