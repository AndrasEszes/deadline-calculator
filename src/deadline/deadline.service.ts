import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class DeadlineService {
  constructor(private readonly configService: ConfigService) {}

  public calculateDeadline(submitted: Date, turndown: number): Date {
    if (turndown === 0) {
      return submitted;
    }

    const deadline = new Date(submitted);
    deadline.setHours(deadline.getHours() + 1);

    if (this.dateIsInWorkingDays(deadline) && this.dateIsInWorkingHours(deadline, true)) {
      const isTheLastTurndownHour = turndown === 1;

      if (!isTheLastTurndownHour && this.dateIsOnWorkingHoursEnd(deadline)) {
        return this.calculateDeadline(deadline, turndown);
      }

      return this.calculateDeadline(deadline, turndown - 1);
    }

    return this.calculateDeadline(deadline, turndown);
  }

  public dateIsInWorkingDays(date: Date): boolean {
    const days = [0, 1, 2, 3, 4, 5, 6];

    // Rotate days array until the first element is equal to the start day. It's guaranteed that the start day of
    // the working days is always at the 0th index.
    while (days.findIndex((v) => v === this.configService.workingDaysStart) > 0) {
      days.unshift(days.pop()!);
    }

    const indexOfTheGivenDay = days.findIndex((v) => v === date.getDay());
    const indexOfTheWorkingDaysEnd = days.findIndex((v) => v === this.configService.workingDaysEnd);

    return indexOfTheGivenDay <= indexOfTheWorkingDaysEnd;
  }

  public dateIsInWorkingHours(date: Date, closedInterval = false): boolean {
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    // Rotate hours until the first element is equal to the start hour. It's guaranteed that the start hour of the
    // working time is always at the 0th index.
    while (hours.findIndex((v) => v === this.configService.workingHoursStart) > 0) {
      hours.unshift(hours.pop()!);
    }

    const indexOfTheGivenHour = hours.findIndex((v) => v === date.getHours());
    const indexOfTheWorkingTimeEnd = hours.findIndex((v) => v === this.configService.workingHoursEnd);

    if (closedInterval && this.dateIsOnWorkingHoursEnd(date)) {
      return indexOfTheGivenHour <= indexOfTheWorkingTimeEnd;
    }

    return indexOfTheGivenHour < indexOfTheWorkingTimeEnd;
  }

  protected dateIsOnWorkingHoursEnd(date: Date): boolean {
    return date.getHours() === this.configService.workingHoursEnd && date.getMinutes() === 0 && date.getSeconds() === 0;
  }
}
