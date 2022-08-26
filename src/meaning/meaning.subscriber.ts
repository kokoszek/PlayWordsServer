import { EntitySubscriberInterface, EventSubscriber, InsertEvent, TransactionCommitEvent, UpdateEvent } from 'typeorm';
import { MeaningEntity } from './meaning.entity';
import { TransactionStartEvent } from 'typeorm/subscriber/event/TransactionStartEvent';
import { Request } from 'express';
import { RequestContext } from 'nestjs-request-context';

@EventSubscriber()
export class MeaningSubscriber implements EntitySubscriberInterface<MeaningEntity> {

  listenTo() {
    return MeaningEntity;
  }

  async beforeInsert(event: InsertEvent<MeaningEntity>): Promise<void> {
    //console.log(`BEFORE POST INSERTED: `, event.entity)
  }

  async beforeUpdate(event: UpdateEvent<MeaningEntity>) {
    //console.log(`BEFORE ENTITY UPDATED: `, event.entity)
  }

  beforeTransactionStart?(event: TransactionStartEvent): Promise<any> | void {
    // const req: Request = RequestContext.currentContext.req;
    // req.wordIdsBeforeSave = [1,2];
    // console.log('beforeTransactionStart:' , req.wordIdsBeforeSave);
  }

  afterTransactionCommit(event: TransactionCommitEvent) {
    // const req: Request = RequestContext.currentContext.req;
    // console.log('AFTER TRANSACTION COMMITTED:' , req.wordIdsBeforeSave);
  }

}
