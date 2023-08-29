import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { configValidationSchema } from './config.schema';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ validationSchema: configValidationSchema })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
