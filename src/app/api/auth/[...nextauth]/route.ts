import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { env } from '@/env.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/db';

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
