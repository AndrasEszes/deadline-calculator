import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { DeadlineService } from './deadline.service';

class MockDeadlineService extends DeadlineService {
  public dateIsOnWorkingHoursEnd = super.dateIsOnWorkingHoursEnd;
}

describe('DeadlineService', () => {
  let service: MockDeadlineService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: DeadlineService,
          useClass: MockDeadlineService,
        },
      ],
    }).compile();

    service = module.get<MockDeadlineService>(DeadlineService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dateIsInWorkingDays', () => {
    beforeEach(() => {
      // Working days: Thursday to Monday
      jest.spyOn(configService, 'workingDaysStart', 'get').mockImplementation(() => 4);
      jest.spyOn(configService, 'workingDaysEnd', 'get').mockImplementation(() => 1);
    });

    it('should return true when the given date is between working days', () => {
      const sunday = new Date('2023-08-27T12:00:00');
      const actual = service.dateIsInWorkingDays(sunday);

      expect(actual).toStrictEqual(true);
    });

    it('should return false when the given date is not between working days', () => {
      const wednesday = new Date('2023-08-30T12:00:00');
      const actual = service.dateIsInWorkingDays(wednesday);

      expect(actual).toStrictEqual(false);
    });
  });

  describe('dateIsInWorkingHours', () => {
    beforeEach(() => {
      // Working hours: 7:00 - 15:00
      jest.spyOn(configService, 'workingHoursStart', 'get').mockImplementation(() => 7);
      jest.spyOn(configService, 'workingHoursEnd', 'get').mockImplementation(() => 15);
    });

    it('should return true when the given time is in working hours', () => {
      const date = new Date('2023-08-29T14:59:59');
      const actual = service.dateIsInWorkingHours(date);

      expect(actual).toStrictEqual(true);
    });

    it('should return false when the given time is not in working hours', () => {
      const date = new Date('2023-08-29T15:00:00');
      const actual = service.dateIsInWorkingHours(date);

      expect(actual).toStrictEqual(false);
    });

    it('should return true when the given time is on the working time edge and interval is closed', () => {
      const date = new Date('2023-08-29T15:00:00');
      const actual = service.dateIsInWorkingHours(date, true);

      expect(actual).toStrictEqual(true);
    });
  });

  describe('calculateDeadline', () => {
    it('should calculate the proper deadline when teradown is fits in the current day', () => {
      const submitted = new Date('2023-08-29T14:45:00');
      const turndown = 2;

      const actual = service.calculateDeadline(submitted, turndown);
      const expected = new Date('2023-08-29T16:45:00');

      expect(actual).toStrictEqual(expected);
    });

    it('should calculate the proper deadline when turndown carries over to the next day', () => {
      const submitted = new Date('2023-08-29T14:45:00');
      const turndown = 4;

      const actual = service.calculateDeadline(submitted, turndown);
      const expected = new Date('2023-08-30T10:45:00');

      expect(actual).toStrictEqual(expected);
    });

    it('should calculate the proper deadline when turndown carries over to the next week', () => {
      const submitted = new Date('2023-08-31T14:45:00');
      const turndown = 12;

      const actual = service.calculateDeadline(submitted, turndown);
      const expected = new Date('2023-09-04T10:45:00');

      expect(actual).toStrictEqual(expected);
    });
  });
});
