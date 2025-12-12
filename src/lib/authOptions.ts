/* eslint-disable arrow-body-style */
import { compare, hash } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import config from '../../config/settings.development.json';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@foo.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error('[AUTH] Missing email or password');
          return null;
        }

        try {
          console.log('[AUTH] Looking up user:', credentials.email);
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            const defaultAccount = config.defaultAccounts?.find(
              (account) => account.email === credentials.email,
            );

            if (
              defaultAccount &&
              credentials.password === defaultAccount.password
            ) {
              console.log(`[AUTH] Seeding missing default account: ${credentials.email}`);
              const hashedPassword = await hash(defaultAccount.password, 10);
              const newUser = await prisma.user.create({
                data: {
                  email: defaultAccount.email,
                  password: hashedPassword,
                  role: (defaultAccount.role as Role) || Role.USER,
                },
              });

              return {
                id: `${newUser.id}`,
                email: newUser.email,
                randomKey: newUser.role,
              };
            }

            console.error('[AUTH] User not found:', credentials.email);
            return null;
          }

          console.log('[AUTH] User found, checking password...');
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.error('[AUTH] Invalid password for user:', credentials.email);
            return null;
          }

          console.log('[AUTH] Password valid, login successful');
          return {
            id: `${user.id}`,
            email: user.email,
            randomKey: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    //   error: '/auth/error',
    //   verifyRequest: '/auth/verify-request',
    //   newUser: '/auth/new-user'
  },
  callbacks: {
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as { id?: string; randomKey?: string };
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
