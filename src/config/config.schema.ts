import * as Joi from 'joi';

export type EnvironmentVariables = {
  PORT: number;
  WORKING_DAYS_START: number;
  WORKING_DAYS_END: number;
  WORKING_HOURS_START: number;
  WORKING_HOURS_END: number;
};

export const configValidationSchema = Joi.object<EnvironmentVariables>({
  PORT: Joi.number().default(3000),
  WORKING_DAYS_START: Joi.number().min(0).max(6).default(1),
  WORKING_DAYS_END: Joi.number().min(0).max(6).default(5),
  WORKING_HOURS_START: Joi.number().min(0).max(23).default(9),
  WORKING_HOURS_END: Joi.number().min(0).max(23).default(17),
});
