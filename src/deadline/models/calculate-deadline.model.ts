import { ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@ObjectType()
export class CalculateDeadlineModel {
  constructor(params: CalculateDeadlineModel) {
    this.deadline = params.deadline;
  }

  @IsDate()
  public deadline!: Date;
}
