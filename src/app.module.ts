import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import * as Joi from 'joi';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        WORKING_DAYS_START: Joi.number().min(0).max(6).default(1),
        WORKING_DAYS_END: Joi.number().min(0).max(6).default(5),
        WORKING_HOURS_START: Joi.number().min(0).max(23).default(9),
        WORKING_HOURS_END: Joi.number().min(0).max(23).default(17),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
    }),
  ],
})
export class AppModule {}
