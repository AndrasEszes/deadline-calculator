import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class CalculateDeadlineInput {
  @IsDate()
  @IsOptional()
  public submitted?: Date;

  @Min(1)
  @IsInt()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Field(() => Int)
  public turndown!: number;
}
