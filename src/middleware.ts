import { auth } from "@/auth";

export default auth((req) => {
  const isProtected = ["/files", "/reviews", "/upload"].some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );
  if (isProtected && !req.auth) {
    const url = new URL("/", req.nextUrl.origin);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/files/:path*", "/reviews/:path*", "/upload/:path*"],
};
