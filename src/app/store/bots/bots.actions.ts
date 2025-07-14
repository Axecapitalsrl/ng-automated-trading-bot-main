import { ICreateBotRequest, IUpdateBotRequest } from '../../core/interfaces/bot.interface';

export class GetBotsByUserId {
  static readonly type = '[Bots] Get Bots By User ID';
  constructor(public userId: string) {}
}

export class ClearBots {
  static readonly type = '[Bots] Clear Bots';
}

export class CreateBot {
  static readonly type = '[Bots] Create Bot';
  constructor(public bot: ICreateBotRequest) {}
}

export class ClearSuccessCreateBot {
  static readonly type = '[Bots] Clear Success Create Bot';
}

export class UpdateBot {
  static readonly type = '[Bots] Update Bot';
  constructor(public bot: IUpdateBotRequest) {}
}

export class DeleteBot {
  static readonly type = '[Bots] Delete Bot';
  constructor(public botId: string) {}
}
