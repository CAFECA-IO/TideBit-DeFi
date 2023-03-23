import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface IQrcodeModal {
  qrcodeModalRef?: React.RefObject<HTMLDivElement>;
  qrcodeModalVisible?: boolean;
  qrcodeClickHandler?: () => void;
}

const QrcodeModal = ({
  qrcodeModalRef,
  qrcodeModalVisible = false,
  qrcodeClickHandler,
}: IQrcodeModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const isDisaplayedQrcodeModal = qrcodeModalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            ref={qrcodeModalRef}
            className="relative flex h-600px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="ml-1/8 mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                {t('WALLET_PANEL.TITLE')}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={qrcodeClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto pt-1">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="flex-col justify-center text-center">
                  <Image
                    className="mx-auto mt-16 rounded object-cover object-center"
                    alt="QR Code"
                    src="/elements/tidebit_qrcode.png"
                    width={340}
                    height={340}
                  />{' '}
                  <div className="mt-10 text-lg">
                    {t('WALLET_PANEL.QR_CODE_DESCRIPTION_PART1')}{' '}
                    <span className="text-tidebitTheme">
                      <Link href="#">{t('WALLET_PANEL.QR_CODE_DESCRIPTION_HIGHLIGHT')}</Link>
                    </span>{' '}
                    {t('WALLET_PANEL.QR_CODE_DESCRIPTION_PART2')}
                  </div>
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

  return <div>{isDisaplayedQrcodeModal}</div>;
};

export default QrcodeModal;
