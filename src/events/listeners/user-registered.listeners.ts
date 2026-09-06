import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { UserRegisteredEvent } from '../user-enents.service';

// event listeners -> respond to the events emitted by eventemitter

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent): void {
    const { user, timeStamp } = event;

    // real app -> mainly do action here
    // like: send an verigy email... etc.
    this.logger.log(
      `Welcome, ${user.email}! Your Account created at ${timeStamp.toISOString()}`,
    );
  }
}
