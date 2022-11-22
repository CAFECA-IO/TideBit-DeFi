import useOuterClick from '../../hooks/lib/useOuterClick';
import Image from 'next/image';

export default function Notification({ref, componentVisible, setComponentVisible}) {
  // const {ref, componentVisible, setComponentVisible} = useOuterClick(false);

  const sidebarOpenHandler = () => {
    // setSidebarOpen(!sidebarOpen);
    setComponentVisible(!componentVisible);
    // console.log('sidebarOpenHandler clicked, componentVisible: ', componentVisible);
  };

  const isDisplayedNotificationSidebarSection = (
    <>
      {/* sidebar section */}
      <div
        className={`pointer-events-none fixed right-1 top-44px ${
          componentVisible ? 'z-30' : 'z-30'
        } flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              ref={ref}
              className={`pointer-events-auto ${'w-479px'} h-screen ${
                componentVisible ? 'translate-x-0' : 'translate-x-full'
              } bg-darkGray/90 p-5 pt-8 text-white transition-all duration-300`}
            >
              <h1 className="pl-5 text-2xl font-bold">Notification</h1>
              <div className="fixed right-30px text-sm text-tidebitTheme underline hover:cursor-pointer">
                Clear All
              </div>
              <div className="-mb-28px mt-83px flex">
                <span className="mx-2 inline-block h-158px w-5px shrink-0 bg-tidebitTheme"></span>
                <div className="-mt-130px flex items-center">
                  <Image
                    className="ml-8px -mt-10px flex shrink-0"
                    src="/elements/megaphone.svg"
                    width={30}
                    height={26}
                    alt="icon"
                  />
                  <div className="relative mt-88px ml-3 text-start">
                    <div className="">
                      <div className="absolute top-40px text-2xl text-lightWhite">
                        Happy Birthday to TideBit
                      </div>
                      <div className="right-20px pl-300px pt-42px pb-50px text-end text-xs text-lightGray">
                        <div>2022-10-05</div>
                        <div>14:28:38</div>
                      </div>
                    </div>

                    <div className="mb-23px -mt-30px flex flex-wrap text-xs text-lightGray">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
                      kasd gubergren, no sea takimata sanctus est Lorem
                    </div>
                  </div>
                </div>
              </div>
              <span className="ml-2 inline-block h-1px w-438px shrink-0 bg-lightGray"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const isDisplayedNotificationSidebarCover = componentVisible ? (
    <>
      {/* cover for NavBar ***Bell Icon*** */}
      <div
        className={`${
          componentVisible ? 'visible animate-fade duration-700 ease-in-out' : 'invisible'
        } invisible fixed z-50 flex h-16 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none lg:visible lg:right-52 lg:top-6 lg:h-8 lg:w-8`}
      >
        {' '}
      </div>

      {/* cover for Main, Footer */}
      <div
        className={`${
          componentVisible ? 'transition-opacity duration-700 ease-in-out' : 'invisible'
        } fixed inset-0 z-30 flex items-center justify-center overflow-x-hidden overflow-y-hidden bg-darkGray/10 outline-none backdrop-blur-sm focus:outline-none`}
      >
        {' '}
      </div>
    </>
  ) : null;

  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`${
        componentVisible ? 'visible' : 'invisible'
      } fixed top-52 left-24 z-50 flex h-10 w-8 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none`}
    >
      {' '}
    </div>
  );

  return (
    <div>
      {/* Notification Sidebar */}
      {isDisplayedNotificationSidebarCover}
      {isDisplayedNotificationSidebarSection}
    </div>
  );
}
