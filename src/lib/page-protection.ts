import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

type Session =
  | {
      user: { email: string; id: string; randomKey: string };
    }
  | null;

const buildSignInRedirect = (callbackUrl: string) =>
  `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl || '/')}`;

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: Session, callbackUrl = '/') => {
  if (!session) {
    redirect(buildSignInRedirect(callbackUrl));
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: Session, callbackUrl = '/admin') => {
  loggedInProtectedPage(session, callbackUrl);
  if (session && session.user.randomKey !== Role.ADMIN) {
    redirect('/not-authorized');
  }
};
