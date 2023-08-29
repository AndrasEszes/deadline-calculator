import { Module } from '@nestjs/common';

import { DeadlineResolver } from './deadline.resolver';
import { DeadlineService } from './deadline.service';
import { DateScalar } from './scalars/date.scalar';

@Module({
  providers: [DeadlineService, DeadlineResolver, DateScalar],
})
export class DeadlineModule {}
