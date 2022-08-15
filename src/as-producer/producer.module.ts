import { Module } from '@nestjs/common';
import { ProducerResolver } from './producer.resolver';

@Module({
  providers: [ProducerResolver],
})
export class ProducerModule {}
