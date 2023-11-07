import Image from 'next/image';
import React from 'react';

interface Hero1Props {
  heading?: string | JSX.Element;
  content?: string;
  img?: string;
}

const Hero1 = ({heading, content, img}: Hero1Props) => {
  const displayedHeading = heading
    ? heading
    : `
Moon hashtag pop-up try-hard offal truffaut
`;

  const displayedContent = content
    ? content
    : `Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar
neutra sustainable fingerstache kickstarter.`;

  const displayedImg = img ? (
    <Image src={img} width={1364} height={820} alt="picture" />
  ) : (
    <Image
      className="h-full w-full object-cover object-center"
      src="https://dummyimage.com/600x300"
      alt="stats"
    />
  );

  const desktopVersionBreakpoint = 'hidden lg:flex';
  const mobileVersionBreakpoint = 'flex lg:hidden';

  return (
    <>
      {/* Info: Desktop (20230922 - Shirley) */}
      <section
        className={`${desktopVersionBreakpoint} container mx-auto flex w-screen justify-center bg-black text-gray-400`}
      >
        <div className="flex flex-col items-center pl-1/20 md:flex-row xl:pl-1/50">
          <div className="mt-1 flex max-w-xl flex-col items-center text-center sm:text-start md:mr-28 md:mt-10 md:w-2/5 md:items-start md:pl-16 md:text-left lg:mt-0 lg:pl-8 xl:mt-5 xl:ml-20">
            <h1 className="mb-8 text-3xl font-medium text-white sm:text-4xl md:text-center">
              {displayedHeading}
            </h1>
            <p className="mb-8 text-lg leading-10">{displayedContent}</p>
          </div>

          <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">{displayedImg}</div>
        </div>
      </section>

      {/* Info: Mobile (20230922 - Shirley) */}
      <section
        className={`${mobileVersionBreakpoint} container mx-auto w-screen justify-center bg-black text-gray-400`}
      >
        <div className="flex flex-col items-center">
          <div className="mb-10 w-5/6">{displayedImg}</div>

          <div className="mx-4 mt-0 flex max-w-lg flex-col items-center justify-center text-center align-baseline">
            <h1 className="mx-auto mb-5 text-center text-2xl font-medium text-white sm:text-4xl">
              {displayedHeading}
            </h1>
            <p className="mb-8 text-center text-sm leading-8 md:text-xl md:leading-10">
              {displayedContent}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero1;
