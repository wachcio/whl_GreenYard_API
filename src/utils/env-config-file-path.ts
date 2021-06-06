import { ConfigModule } from '@nestjs/config';

export const envConfigFilePath = (): any => {
  return ConfigModule.forRoot({
    envFilePath:
      process.env.NODE_ENV == 'development'
        ? '.env.development'
        : '.env.production',
    isGlobal: true,
  });
};
