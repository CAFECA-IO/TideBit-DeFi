import CryptoCard from '../shared/card/crypto_card';

const CryptoCategory = () => {
  return (
    <div className="mt-20 container mx-auto flex flex-wrap justify-center px-20 space-y-1">
      <div className="flex flex-col text-center w-full mb-20">
        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white items-center">
          <span className="hidden md:inline-block h-px xl:w-1/4 lg:w-1/5 rounded bg-white xl:mx-2 mb-3"></span>
          <span className="text-blue-400">Popular</span> cryptocurrencies
          <span className="hidden md:inline-block h-px xl:w-1/4 lg:w-1/5 rounded bg-white xl:mx-2 mb-3"></span>
        </h1>
      </div>
      <div className="flex flex-wrap space-x-3 xl:space-x-0 xl:justify-between lg:justify-center justify-center">
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
        <div className="flex xl:w-1/5 lg:w-1/4 flex-wrap justify-center my-5">
          <CryptoCard />
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;
