import { DefaultSession, NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/env.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      about: string;
      email: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    about: string;
    email: string;
    username: string;
    // ...other properties
    // role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    about: string;
    email: string;
    username: string;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await db.user.findUnique({
        where: { id: token.sub },
      });

      if (!dbUser) return token;

      token.token = dbUser;

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub ?? '';
      session.user.username = token.username;
      session.user.email = token.email;
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'password', type: 'password' },
        confirmPassword: { label: 'confirmPassword', type: 'password' },
        signUp: { label: 'sign up', type: 'button' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (credentials.signUp === 'true') {
          if (user) return null;

          // if (credentials.password !== credentials.confirmPassword) {
          //   throw new Error('Passwords do not match. Try again!');
          // }

          // const hashedPassword = hashPassword(credentials.password);

          const createNewUser = await db.user.create({
            data: {
              username: credentials.username,
              password: credentials.password,
            },
          });

          return createNewUser;
        } else {
          if (user) {
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;
          }

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
};
