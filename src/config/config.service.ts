import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './config.schema';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService<EnvironmentVariables>) {}

  public get port(): number {
    return this.nestConfigService.getOrThrow('PORT', { infer: true });
  }

  public get workingDaysStart(): number {
    return this.nestConfigService.getOrThrow('WORKING_DAYS_START', { infer: true });
  }

  public get workingDaysEnd(): number {
    return this.nestConfigService.getOrThrow('WORKING_DAYS_END', { infer: true });
  }

  public get workingHoursStart(): number {
    return this.nestConfigService.getOrThrow('WORKING_HOURS_START', { infer: true });
  }

  public get workingHoursEnd(): number {
    return this.nestConfigService.getOrThrow('WORKING_HOURS_END', { infer: true });
  }
}
