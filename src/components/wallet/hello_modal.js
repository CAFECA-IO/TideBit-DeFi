import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import Link from 'next/link';

const HelloModal = ({
  helloModalRef = null,
  helloModalVisible = false,
  helloClickHandler = () => {},
  ...otherProps
}) => {
  const isDisplayedHelloModal = helloModalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            ref={helloModalRef}
            className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={helloClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="flex flex-auto flex-col items-center pt-32">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="mx-auto flex flex-col items-center">
                  <Image
                    className="mt-10 w-100px"
                    src="/elements/path_25939.svg"
                    width={200}
                    height={200}
                    alt="Hello"
                  />
                  <div className="mt-8 mb-40 text-xl text-lightGray">
                    You can start using TideBit now.
                  </div>

                  <TideButton className="px-12" onClick={helloClickHandler}>
                    Done
                  </TideButton>
                  <Link
                    className="mt-3 text-base text-tidebitTheme underline underline-offset-4"
                    href="#"
                  >
                    Connect my TideBit HK
                  </Link>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedHelloModal}</div>;
};

export default HelloModal;
