import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cookies from "cookie";

export function middleware(req) {
  const tokenPatient = req.cookies.get("token-patient");
  const tokenDoctor = req.cookies.get("token-doctor");

  if (tokenPatient) {
    try {
      jwt.verify(tokenPatient, process.env.JWT_SECRET);
      return NextResponse.redirect(new URL("/patient", req.url));
    } catch (err) {
      // Invalid token
    }
  } else if (tokenDoctor) {
    try {
      jwt.verify(tokenDoctor, process.env.JWT_SECRET);
      return NextResponse.redirect(new URL("/doctor", req.url));
    } catch (err) {
      // Invalid token
      console.log(err,'invalid token');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register", "/login"],
};
