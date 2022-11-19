import CryptoCard from '../shared/card/crypto_card';

const CryptoCategory = ({...otherProps}) => {
  const customClassName = otherProps?.className;
  return (
    <div
      className={`${customClassName} container mx-auto mt-20 flex flex-wrap justify-center space-y-1 px-20`}
    >
      <div className="mb-20 flex w-full flex-col text-center">
        <h1 className=" mb-4 items-center text-3xl font-medium text-white sm:text-4xl">
          <span className="mb-3 hidden h-px rounded bg-white md:inline-block lg:w-1/5 xl:mx-2 xl:w-1/4"></span>
          <span className="text-tidebitTheme">Popular</span> cryptocurrencies
          <span className="mb-3 hidden h-px rounded bg-white md:inline-block lg:w-1/5 xl:mx-2 xl:w-1/4"></span>
        </h1>
      </div>
      <div className="flex flex-wrap justify-center space-x-3 lg:justify-center xl:justify-between xl:space-x-0">
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            tokenComponent=<img
              src="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg"
              alt="polygon"
            />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard tokenComponent=<img src="/elements/group_2374.svg" alt="bnb" /> />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard tokenComponent=<img src="/elements/group_2378.svg" alt="solana" /> />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard tokenComponent=<img src="/elements/group_2381.svg" alt="shiba inu" /> />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard tokenComponent=<img src="/elements/group_2385.svg" alt="polkadot" /> />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard tokenComponent=<img src="/elements/group_2388.svg" alt="cardano" /> />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard tokenComponent=<img src="/elements/group_2391.svg" alt="avax" /> />
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;
