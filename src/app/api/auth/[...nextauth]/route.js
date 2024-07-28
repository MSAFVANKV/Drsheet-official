import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "@/utils/db";
import User from "@/modals/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";

export const authOption = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID ?? "",
    //   clientSecret: process.env.GOOGLE_SECRET ?? "",
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(user, "user");
      console.log(account, "account");

      if (account?.provider === "credentials") {
        // For credentials provider, return the user and headers with cookie
        return true;
      }
      if (account?.provider === "github") {
        await connectDb();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if(!existingUser){
            const newUser = new User({
              email:user.email,
              usertype:'patient'
            });
            await newUser.save();
            return true;
          }
          return true;

        } catch (error) {
          console.log(error,'Error saving user ');
        }
      }
    },
    async session({ session, token, user }) {
      if (user) {
        session.user = user;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOption);
export { handler as GET, handler as POST };

// =========================
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDb } from "@/utils/db";
// import bcrypt from "bcrypt";
// import NextAuth from "next-auth/next";
// import jwt from "jsonwebtoken";
// import Cookies from "cookie";
// import User from "@/modals/User";

// export const authOption = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDb();
//         try {
//           const user = await User.findOne({ email: credentials.email });
//           if (user) {
//             const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
//             if (isPasswordCorrect) {
//               return user;
//             }
//           }
//         } catch (error) {
//           throw new Error(error);
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID ?? "",
//       clientSecret: process.env.GOOGLE_SECRET ?? "",
//       async profile(profile) {
//         await connectDb();
//         let user = await User.findOne({ email: profile.email });
//         if (!user) {
//           user = await User.create({
//             email: profile.email,
//             username: profile.name,
//             usertype: "Patient",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           });
//         }
//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       console.log(user,'user');
//       console.log(account,'account');
//       const token = jwt.sign({ userType: user.usertype }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       const cookieName = user.usertype === "Patient" ? "token-patient" : "token-doctor";
//       const cookie = Cookies.serialize(cookieName, token, { maxAge: 60 * 60, path: '/' });

//       if (account.type === "credentials") {
//         // For credentials provider, return the user and headers with cookie
//         return { user, headers: { 'Set-Cookie': cookie } };
//       } else {
//         // For Google provider, set the cookie in the response headers
//         const res = NextResponse.next();
//         res.headers.set('Set-Cookie', cookie);
//         return res;
//       }
//     },
//     async session({ session, token, user }) {
//       if (user) {
//         session.user = user;
//       }
//       return session;
//     },
//   },
// };

// export const handler = NextAuth(authOption);
// export { handler as GET, handler as POST };
