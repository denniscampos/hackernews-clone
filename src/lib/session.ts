import { getServerSession } from 'next-auth/next';
import { authOptions } from './authOptions';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  console.log({ session });
  return session?.user;
}
