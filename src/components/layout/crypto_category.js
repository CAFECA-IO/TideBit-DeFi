import CryptoCard from '../shared/card/crypto_card';

const CryptoCategory = ({img = '', chain = '', currency = '', star = ''}) => {
  return (
    <div className="container mx-auto mt-20 flex flex-wrap justify-center space-y-1 px-20">
      <div className="mb-20 flex w-full flex-col text-center">
        <h1 className=" mb-4 items-center text-3xl font-medium text-white sm:text-4xl">
          <span className="mb-3 hidden h-px rounded bg-white md:inline-block lg:w-1/5 xl:mx-2 xl:w-1/4"></span>
          <span className="text-blue-400">Popular</span> cryptocurrencies
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
          <CryptoCard />
        </div>
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
          <CryptoCard />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard />
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;
