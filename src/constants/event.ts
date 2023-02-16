export type IEvent = 'CONNECTED' | 'DISCONNECTED' | 'ACCOUNT_CHANGED';
export interface IEventConstant {
  CONNECTED: IEvent;
  DISCONNECTED: IEvent;
  ACCOUNT_CHANGED: IEvent;
}
export const Event: IEventConstant = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
};
