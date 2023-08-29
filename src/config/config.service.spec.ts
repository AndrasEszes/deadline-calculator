import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { configValidationSchema } from './config.schema';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ validationSchema: configValidationSchema })],
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('has a port number property', () => {
    expect(service).toHaveProperty('port');
    expect(typeof service.port).toBe('number');
  });

  it('has a workingDaysStart number property', () => {
    expect(service).toHaveProperty('workingDaysStart');
    expect(typeof service.workingDaysStart).toBe('number');
  });

  it('has a workingDaysEnd number property', () => {
    expect(service).toHaveProperty('workingDaysEnd');
    expect(typeof service.workingDaysEnd).toBe('number');
  });

  it('has a workingHoursStart number property', () => {
    expect(service).toHaveProperty('workingHoursStart');
    expect(typeof service.workingHoursStart).toBe('number');
  });

  it('has a workingHoursEnd number property', () => {
    expect(service).toHaveProperty('workingHoursEnd');
    expect(typeof service.workingHoursEnd).toBe('number');
  });
});
