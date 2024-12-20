import { loginAction } from "@/actions/auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (credentials) {
          const fd = new FormData();
          fd.append("username", credentials.username);
          fd.append("password", credentials.password);
          const responseLogin = await loginAction(fd);
          const user = responseLogin.result?.user;
          const token = responseLogin.result?.token;
          if (responseLogin.success && user && token) {
            return {
              id: "1234",
              accessToken: token,
              refreshToken: token,
              expires_in:
                Math.floor(Date.now() / 1000) +
                60 * parseInt(process.env.ACCESS_EXPIRATION_MINUTES ?? "60"),
              userInfo: {
                role: user.role,
                term: user.term,
              },
            };
          } else {
            throw new Error(responseLogin.message);
          }
        } else {
          throw new Error("invalid-username-or-password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.NEXTAUTH_EXPIRATION_HOUR ?? "24") * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // added code
      if (trigger === "update" && session) {
        token = { ...token, userInfo: session.user };
        return token;
      }

      if (user && user.accessToken) {
        token.id = user.id;
        token.expired =
          Math.floor(Date.now() / 1000) +
          60 * 60 * parseInt(process.env.NEXTAUTH_EXPIRATION_HOUR ?? "24");
        token.userInfo = user.userInfo;
        token.accessToken = user.accessToken;
        return {
          ...token,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.userInfo; // เพิ่ม id ของผู้ใช้ใน session
      session.accessToken = token.accessToken; // เพิ่ม access token ลงใน session
      return session; // คืนค่า session
    },
  },
  pages: {
    error: "/login",
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge:
          parseInt(process.env.NEXTAUTH_EXPIRATION_HOUR ?? "24") * 60 * 60, // อายุของ cookies 1 วัน
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // ตั้ง secret key สำหรับเข้ารหัส
};
