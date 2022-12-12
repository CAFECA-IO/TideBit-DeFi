import {ExternalProvider} from 'ethers';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
