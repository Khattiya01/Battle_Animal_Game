import {NextRequest, NextResponse} from "next/server";

// This function can be marked `async` if using `await` inside

export default async function middleware(req: NextRequest) {

    const res = NextResponse.next();
    // const url = process.env.NEXT_PUBLIC_BASE_URL || "*";
    // res.headers.append('Access-Control-Allow-Credentials', "true")
    // res.headers.append('Access-Control-Allow-Origin', url) // replace this your actual origin
    // res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    // res.headers.Authorization = `Bearer ${accessToken}`;

    // Check if the user is authenticated (has an access token)

    res.headers.append("Authorization", `Bearer ${localStorage.getItem("token") ?? ""}` || "");

    //   console.log("accessToken" , accessToken)
    // res.headers.append('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    return res;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/v1/:path*"],
};
