import { getCurrentUser } from '@/lib/session';
import { AccountForm } from './AccountForm';

export default async function Page() {
  const user = await getCurrentUser();

  return <AccountForm user={user} />;
}
