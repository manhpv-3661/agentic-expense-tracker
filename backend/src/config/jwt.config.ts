import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => {
  const secret = configService.get<string>('jwt.secret');

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in configuration');
  }

  return {
    secret,
    signOptions: {
      expiresIn: configService.get('jwt.expiresIn') || '7d',
    },
  };
};
