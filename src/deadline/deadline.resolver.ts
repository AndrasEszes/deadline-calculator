import { ValidationError } from '@nestjs/apollo';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { DeadlineService } from './deadline.service';
import { CalculateDeadlineInput } from './inputs/calculate-deadline.input';
import { CalculateDeadlineModel } from './models/calculate-deadline.model';

@Resolver()
export class DeadlineResolver {
  constructor(private readonly deadlineService: DeadlineService) {}

  @Query(() => String)
  public hello() {
    return "Just because Apollo throws an exception when the schema doesn't contains query!";
  }

  @Mutation(() => CalculateDeadlineModel)
  public calculateDeadline(@Args('input') input: CalculateDeadlineInput): CalculateDeadlineModel {
    const submitted = input.submitted ?? new Date();

    if (!this.isSubmittedInWorkingTime(submitted)) {
      throw new ValidationError('Task is submitted out of the working time');
    }

    return new CalculateDeadlineModel({
      deadline: this.deadlineService.calculateDeadline(submitted, input.turndown),
    });
  }

  protected isSubmittedInWorkingTime(submitted: Date) {
    return this.deadlineService.dateIsInWorkingDays(submitted) && this.deadlineService.dateIsInWorkingHours(submitted);
  }
}
