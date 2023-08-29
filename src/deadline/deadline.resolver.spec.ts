import { ValidationError } from '@nestjs/apollo';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '../config/config.module';
import { DeadlineResolver } from './deadline.resolver';
import { DeadlineService } from './deadline.service';
import { CalculateDeadlineModel } from './models/calculate-deadline.model';

class MockDeadlineResolver extends DeadlineResolver {
  public isSubmittedInWorkingTime = super.isSubmittedInWorkingTime;
}

describe('DeadlineResolver', () => {
  let resolver: MockDeadlineResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [DeadlineService, { provide: DeadlineResolver, useClass: MockDeadlineResolver }],
    }).compile();

    resolver = module.get<MockDeadlineResolver>(DeadlineResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('hello', () => {
    it('should be defined', () => {
      expect(resolver.hello).toBeDefined();
    });

    it('should return a string', () => {
      expect(typeof resolver.hello()).toStrictEqual('string');
    });
  });

  describe('calculateDeadline', () => {
    it('should be defined', () => {
      expect(resolver.calculateDeadline).toBeDefined();
    });

    it('should return CalculateDeadlineModel instance if it submitted in the working time', () => {
      const actual = resolver.calculateDeadline({ submitted: new Date('2023-08-29T12:00:00'), turndown: 2 });
      const expected = new CalculateDeadlineModel({ deadline: new Date('2023-08-29T14:00:00') });

      expect(actual).toStrictEqual(expected);
    });

    it('should throw ValidationError if it submitted out of the working time', () => {
      const actual = () => resolver.calculateDeadline({ submitted: new Date('2023-08-29T17:00:00'), turndown: 2 });

      expect(actual).toThrowError(ValidationError);
    });
  });

  describe('isSubmittedInWorkingTime', () => {
    it('should be defined', () => {
      expect(resolver.isSubmittedInWorkingTime).toBeDefined();
    });

    it('should return true when the given date is in the working time', () => {
      const actual = resolver.isSubmittedInWorkingTime(new Date('2023-08-29T16:59:59'));
      expect(actual).toStrictEqual(true);
    });

    it('should return false when the given date is out of the working time', () => {
      const actual = resolver.isSubmittedInWorkingTime(new Date('2023-08-29T17:00:00'));
      expect(actual).toStrictEqual(false);
    });
  });
});
