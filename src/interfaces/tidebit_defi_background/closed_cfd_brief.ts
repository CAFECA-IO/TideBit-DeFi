import {ICFDBrief} from './cfd_brief';

export interface IClosedCFDBrief extends ICFDBrief {
  closedTimestamp: number;
  closedValue: number;
}

export const dummyClosedCFDBriefs: IClosedCFDBrief[] = [];
