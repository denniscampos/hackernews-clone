import { DefaultSession, NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
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
      username: string;
      about: string;
      // email: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
    about: string;
    // email: string;
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
  callbacks: {
    async session({ session, token, user }) {
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser) {
        throw new Error('User not found');
      }

      session.user.id = user.id;
      session.user.username = dbUser.username ?? '';
      session.user.email = user.email;
      session.user.about = dbUser.about ?? '';
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
