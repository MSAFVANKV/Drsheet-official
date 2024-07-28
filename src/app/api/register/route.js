// api/register/route.js

import { connectDb } from "@/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/modals/User";

export const POST = async (req, res) => {
  try {
    const { email, password, phone, usertype,username } = await req.json();
    await connectDb();

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return new NextResponse("Email is already taken", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      phone,
      usertype,
    });

    await newUser.save();
    return new NextResponse("User successfully created", { status: 200 });
  } catch (error) {
    console.error('Error in /api/register:', error);
    return new NextResponse(error.message || 'Internal Server Error', {
      status: 500,
    });
  }
};
