import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Connect to database
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });

        // If no user found, throw error
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if password matches
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        // Return user object if everything is correct
        return { id: user._id, email: user.email, name: user.name };
      },
    }),
  ],

  session: {
    strategy: "jwt", // use JWT for sessions
  },

  pages: {
    signIn: "/login", // we'll create this page later
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };