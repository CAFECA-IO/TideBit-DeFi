import {ICFDBrief} from './cfd_brief';

/** Extended by
 * @interface IOpenCFDDetails
 * @interface ICloseCFDDetails
 */
export interface ICFDDetails extends ICFDBrief {
  freezed?: boolean;
}
