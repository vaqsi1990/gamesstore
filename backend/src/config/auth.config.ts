import { registerAs } from '@nestjs/config';

export type AuthConfig = {
  jwt: {
    secret: string;
    expiresIn: string;
  };
};

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET || 'change-me-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  }),
);
