// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import jwt, { sign } from "jsonwebtoken";
// import { serialize } from "cookie";

// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDb } from "@/utils/db";
// import User from "@/modals/User";
// import bcrypt from "bcrypt";
// import NextAuth from "next-auth/next";

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
//             const isPasswordCorrect = await bcrypt.compare(
//               credentials.password,
//               user.password
//             );
//             if (isPasswordCorrect) {
//               return user;
//             }
//           }
//         } catch (error) {
//           throw new Error(error);
//         }
//       },
//     }),
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_ID ?? "",
//     //   clientSecret: process.env.GOOGLE_SECRET ?? "",
//     // }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       console.log(user, "user");
//       console.log(account, "account");

//       if (account?.provider === "credentials") {
//         // For credentials provider, return the user and headers with cookie
//         return true;
//       }
//       if (account?.provider === "github") {
//         await connectDb();
//         try {
//           const existingUser = await User.findOne({ email: user.email });
//           if (!existingUser) {
//             const newUser = new User({
//               email: user.email,
//               usertype: "patient",
//             });
//             await newUser.save();
//             return true;
//           }
//           return true;
//         } catch (error) {
//           console.log(error, "Error saving user ");
//         }
//       }
//     },
//     async session({ session, token, user }) {
//       console.log(session, "session from session");
//       console.log(user, "user from session");
//       console.log(token, "token from session");

//       if (token?.sub) {
//         await connectDb();
//         const fullUser = await User.findById(token.sub);
//         session.user = fullUser ? fullUser.toObject() : user;
//       }

//       return session;
//     },
//     async jwt({ token, user, account }) {
//       console.log(token, "token from jwt");
//       console.log(user, "user from jwt");

//       if (user) {
//         token.sub = user._id;
//       }
//       const secret = process.env.JWT_SECRET || "jwt";
//       if (account.provider === "credentials") {
//         if (user && user.usertype === "Patient") {
//           const username = user.username;
//           const token = sign({ username }, secret, { expiresIn: "1m" });
//           const serialized = serialize("token-patient", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 60 * 60 * 24 * 30,
//             path: "/",
//           });
//           const res = {
//             message: "authenticated",
//           };
//           return new Response(JSON.stringify(res), {
//             status: 200,
//             headers: { "set-Cookie": serialized },
//           });
//         }
//         if (user && user.usertype === "Doctor") {
//           const username = user.username;
//           const token = sign({ username }, secret, { expiresIn: "1m" });
//           const serialized = serialize("token-doctor", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 60 * 60 * 24 * 30,
//             path: "/",
//           });
//           const res = {
//             message: "authenticated",
//           };
//           return new Response(JSON.stringify(res), {
//             status: 200,
//             headers: { "set-Cookie": serialized },
//           });
//         }
//       }
//       if (account.provider === "github") {
//         const username = user.username;
//         const token = sign({ username }, secret, { expiresIn: "1m" });
//         const serialized = serialize("token-patient", token, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           maxAge: 60 * 60 * 24 * 30,
//           path: "/",
//         });
//         const res = {
//           message: "authenticated",
//         };
//         return new Response(JSON.stringify(res), {
//           status: 200,
//           headers: { "set-Cookie": serialized },
//         });
//       }

//       return token;
//     },
//   },
// };

// export const handler = NextAuth(authOption);
// export { handler as GET, handler as POST };

// =========================
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

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
        return true;
      }
      if (account?.provider === "github") {
        await connectDb();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              usertype: "patient",
            });
            await newUser.save();
          }
          return true;
        } catch (error) {
          console.log(error, "Error saving user ");
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log(session, "session from session");
      console.log(token, "token from session");

      if (token?.sub) {
        await connectDb();
        const fullUser = await User.findById(token.sub);
        session.user = fullUser ? fullUser.toObject() : session.user;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log(token, "token from jwt");
      console.log(user, "user from jwt");

      if (user) {
        token.sub = user._id;
      }
      
      const secret = process.env.JWT_SECRET || "jwt";
      let jwtToken;
      if (account && account.provider === "credentials") {
        const payload = { username: user.username };
        jwtToken = sign(payload, secret, { expiresIn: "1h" });
        token.jwt = jwtToken;
      } else if (account && account.provider === "github") {
        const payload = { username: user.username };
        jwtToken = sign(payload, secret, { expiresIn: "1h" });
        token.jwt = jwtToken;
      }

      return token;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (account.provider === "credentials") {
        const secret = process.env.JWT_SECRET || "jwt";
        const payload = { usertype: user.usertype, id: user._id };
        const jwtToken = sign(payload, secret, { expiresIn: "1h" });
        const cookieName = user.usertype === "Patient" ? "token-patient" : "token-doctor";
        const serialized = serialize(cookieName, jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
        return new Response(null, {
          status: 200,
          headers: { "set-Cookie": serialized },
        });
      }
    }
  }
};

export const handler = NextAuth(authOption);
export { handler as GET, handler as POST };

