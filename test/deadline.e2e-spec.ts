import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { ConfigModule } from '../src/config/config.module';
import { DeadlineModule } from '../src/deadline/deadline.module';
import { CalculateDeadlineInput } from '../src/deadline/inputs/calculate-deadline.input';

function calculateDeadline(app: INestApplication, variables: CalculateDeadlineInput) {
  const query = /* GraphQL */ `
    mutation CalculateDeadline($submitted: Date, $turndown: Int!) {
      calculateDeadline(input: { submitted: $submitted, turndown: $turndown }) {
        deadline
      }
    }
  `;

  return request(app.getHttpServer()).post('/graphql').send({ query, variables });
}

describe('calculate deadline E2E tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
        ConfigModule,
        DeadlineModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should calculate deadline if it submitted in the working time', async () => {
    const submitted = new Date('2023-08-29T12:00:00');
    const turndown = 2;

    return calculateDeadline(app, { submitted, turndown })
      .expect(200)
      .then((res) => {
        const actual = res.body.data.calculateDeadline.deadline;
        const expected = '2023-08-29T14:00:00+02:00';

        expect(actual).toStrictEqual(expected);
      });
  });

  it('should throw a ValidationError if it submitted out of the working time', async () => {
    const submitted = new Date('2023-08-29T17:00:00');
    const turndown = 2;

    return calculateDeadline(app, { submitted, turndown })
      .expect(200)
      .then((res) => {
        const actual = res.body.errors[0].message;
        const expected = 'Task is submitted out of the working time';

        expect(actual).toStrictEqual(expected);
      });
  });
});
