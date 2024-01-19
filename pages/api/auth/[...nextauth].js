import fetcher from "@/utils/fetcher";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, req) {
        const res = await fetcher.post("/auth/login", {
          username: credentials?.username,
          password: credentials?.password,
        });
        const data = res.data;
        if (data.responseSchema.status == "Error") {
          return null;
        } else {
          return {
            ...data.data.user,
            token: data.data.token,
          };
        }
      },
    }),
  ],

  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // expired 30 hari
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
