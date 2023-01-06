import Image from 'next/image';
import React from 'react';
import RippleButton from '../ripple_button/ripple_button';

const AppDowloadContainer = () => {
  // const containerDescription = `container mx-auto flex items-center md:flex-row flex-col`;

  const desktopVersionBreakpoint = 'hidden lg:flex';
  const mobileVersionBreakpoint = 'flex lg:hidden';

  return (
    <>
      {/* Desktop */}
      <div className={`${desktopVersionBreakpoint}`}>
        <section className={`bg-black py-24`}>
          <h1 className="flex shrink-0 items-center justify-center py-20 px-2 text-lg font-bold text-white sm:text-2xl md:px-20 md:text-3xl lg:text-4xl xl:text-6xl">
            Trade on&nbsp;<span className="text-cyan-400">TideBit</span>
            &nbsp;anywhere, anytime
          </h1>

          <div className="mx-auto flex flex-wrap items-center space-y-2 pb-24 md:flex-row">
            <div className="mx-auto mb-10 max-w-md md:mb-0 md:w-1/2 lg:max-w-sm 2xl:ml-1/8">
              <div className="flex justify-center">
                <Image
                  className="rounded object-cover object-center"
                  alt="QR Code"
                  src="/elements/tidebit_qrcode.png"
                  width={200}
                  height={200}
                />
              </div>

              <div className="mx-auto mt-10 flex shrink-0 flex-wrap items-center justify-center sm:space-x-4 md:ml-auto md:mr-0">
                <button type="button" className="hover:opacity-80">
                  <Image
                    src="/elements/app_store_badge@2x.png"
                    width={120}
                    height={40}
                    alt="app-store"
                  />
                </button>

                <button type="button" className="hover:opacity-80">
                  <Image
                    src={'/elements/google_play_badge@2x.png'}
                    width={155}
                    height={40}
                    alt="google play"
                  />
                </button>
              </div>
            </div>
            <div className="mx-auto flex w-full flex-col flex-wrap items-center justify-center pt-20 pl-1/10 md:w-3/5 lg:pl-0 lg:pt-0">
              <Image
                className="flex justify-center rounded object-contain"
                alt="hero"
                src="/elements/group_15202@2x.png"
                width={1364}
                height={792}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Mobile */}
      <div className={`${mobileVersionBreakpoint}`}>
        <section className={`bg-black`}>
          <div className="flex shrink-0 flex-col items-center justify-center space-y-2 px-2 pt-0 pb-10 text-2xl font-bold text-white sm:space-y-5 sm:text-3xl md:px-20 md:pb-20 md:text-4xl">
            <div>
              Trade on&nbsp;<span className="text-cyan-400">TideBit</span>
            </div>
            <div>anywhere, anytime</div>
          </div>

          <div className="mx-auto flex flex-wrap items-center space-y-2 pb-24 md:flex-row">
            <div className="mx-auto flex w-4/5 flex-col flex-wrap items-center justify-center py-5 pl-1/10 md:w-4/5">
              <Image
                className="flex justify-center rounded object-contain"
                alt="hero"
                src="/elements/group_15202@2x.png"
                width={1364}
                height={792}
              />
            </div>

            <div className="mx-auto mb-10 max-w-md md:mb-0 md:w-1/2 lg:max-w-sm 2xl:ml-1/8">
              {/* QR Code Size Automatic Toggle */}
              <div className="hidden justify-center md:flex">
                <Image
                  className="rounded object-cover object-center"
                  alt="QR Code"
                  src="/elements/tidebit_qrcode.png"
                  width={150}
                  height={150}
                />
              </div>

              <div className="flex justify-center md:hidden">
                <Image
                  className="rounded object-cover object-center"
                  alt="QR Code"
                  src="/elements/tidebit_qrcode.png"
                  width={100}
                  height={100}
                />
              </div>

              <div className="mx-auto mt-5 flex shrink-0 flex-wrap items-center justify-center space-x-3 sm:mt-10 sm:space-x-4 md:ml-auto md:mr-0">
                <button type="button" className="hover:opacity-80">
                  <Image
                    src="/elements/group_15225@2x.png"
                    width={134}
                    height={40}
                    alt="app-store"
                  />
                </button>

                <button type="button" className="hover:opacity-80">
                  <Image
                    src={'/elements/group_15232@2x.png'}
                    width={135}
                    height={40}
                    alt="google play"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AppDowloadContainer;
