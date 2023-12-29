import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
};

const PROTECTED_ADMIN_ROUTES = [
  "/admin",
  "/ini-rahasia",
  "/hanya-admin-yang-tau",
  "/pageAdminOnly",
];
const PROTECTED_USER_ROUTES = ["/profile", "/userOnly"];

const PROTECTED_MANAGER_ROUTES = ["/profile", "/userOnly"];

/*
  /places -> bisa diakses admin & user yg penting sudah login
  /admin -> hanya admin sudah login
  /profile -> hanya user sudah login
*/

export default withAuth(
  function middleware(request) {
    console.log(request.nextUrl.pathname);
    console.log(request.nextauth.token);
    console.log(request.nextauth.token.user, "USERRRR");

    if (
      PROTECTED_ADMIN_ROUTES.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      ) &&
      request.nextauth.token.user.role != ROLE.ADMIN
    ) {
      return NextResponse.rewrite("/unauthorized", request.url);
    }

    if (
      PROTECTED_USER_ROUTES.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      ) &&
      request.nextauth.token.user.role != ROLE.USER
    ) {
      return NextResponse.rewrite("/unauthorized", request.url);
    }

    if (
      PROTECTED_MANAGER_ROUTES.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      ) &&
      request.nextauth.token.user.role != ROLE.MANAGER
    ) {
      return NextResponse.rewrite("/unauthorized", request.url);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Tambahin route yang dimana user harus sudah login untuk mengaskses route tersebut
// cth: matcher: ["/profile/:path*"] -> artinya semua route yang DIMULAI dengan /profile/ (atau /profile/id/ atau /profile/sebuah-halaman) akan di cek apakah user sudah login atau belum
export const config = {
  matcher: [
    "/places/:path*",
    "/pageBaru",
    // ...PROTECTED_ADMIN_ROUTES,
    // ...PROTECTED_USER_ROUTES,
  ],
};
