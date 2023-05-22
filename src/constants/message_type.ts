export type IMessageType = 'announcement' | 'notification';

export type IMessageTypeConstant = {
  ANNOUNCEMENT: IMessageType;
  NOTIFICATION: IMessageType;
};

export const MessageType: IMessageTypeConstant = {
  ANNOUNCEMENT: 'announcement',
  NOTIFICATION: 'notification',
};
