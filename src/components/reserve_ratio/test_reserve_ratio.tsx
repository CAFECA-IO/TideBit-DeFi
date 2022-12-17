import Image from 'next/image';

const TestReserveRatio = () => {
  // const bgNextTailwindImage = (
  //   <div className="h-96 bg-slate-700 bg-[url('/public/elements/2634.png')] bg-scroll"></div>
  // );

  const test2BgImage = (
    <div
      className="bg-scroll"
      style={{backgroundImage: `url('/elements/group_15244.svg')`, height: '200px'}}
    ></div>
  );

  const fixedBgImage = (
    <>
      <div
        style={{
          zIndex: -1,
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
        className="bg-scroll"
      >
        <Image
          src="/elements/group_15244.svg"
          alt="Mountains with snow"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1
        style={{
          paddingTop: '30vh',
          fontFamily: 'monospace',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Next.js Background Image Tutorial
      </h1>
      <div className="flex w-full justify-center">
        <div className="w-278px p-4 md:right-250px md:w-400px lg:right-1/3 xl:right-2/5">
          <div className="flex h-full flex-col rounded-lg bg-darkGray4 p-8">
            <div className="mb-3 flex items-center">
              <div className="mr-3 inline-flex shrink-0 items-center justify-center rounded-full text-lightWhite">
                {/* <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                className="h-5 w-5"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg> */}
                <Image
                  src="/elements/tether-seeklogo.com.svg"
                  width={50}
                  height={50}
                  alt="tether-seeklogo.com.svg"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-3xl font-medium text-lightGreen2">USDT</h2>
                <p className="-my-1 mb-1">reserve ratio</p>
              </div>
            </div>

            <div className="grow">
              <p className="font-bold">
                <span className="pr-2 text-6xl font-bold leading-relaxed">120</span> %
              </p>
              <label className="ml-52 rounded-full bg-lightGray3 px-3 py-1 text-sm">
                Blockchain
              </label>
              <span className="my-auto h-px w-full rounded bg-lightGray1/30 xs:inline-block"></span>

              {/* <a className="mt-3 inline-flex items-center text-indigo-400">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a> */}
              <div className="mb-5 flex flex-col space-y-2">
                <div className="text-base text-lightGray">TideBit user asset holdings</div>
                <div>3,016,827,845</div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="text-base text-lightGray">TideBit wallet assets</div>
                <div>3,061,068,937</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <>{test2BgImage}</>;
};

export default TestReserveRatio;
