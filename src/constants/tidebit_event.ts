export type ITideBitEvent = 'CONNECTED' | 'DISCONNECTED' | 'ACCOUNT_CHANGED';
export interface ITideBitEventConstant {
  CONNECTED: ITideBitEvent;
  DISCONNECTED: ITideBitEvent;
  ACCOUNT_CHANGED: ITideBitEvent;
}
export const TideBitEvent: ITideBitEventConstant = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
};
