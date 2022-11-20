import CryptoCard from '../shared/card/crypto_card';

const CryptoCategory = ({...otherProps}) => {
  const customClassName = otherProps?.className;
  return (
    <div
      className={`${customClassName} container mx-auto mt-20 flex flex-wrap justify-center space-y-1`}
    >
      <div className="mb-20 flex w-full flex-col text-center">
        <div className="mb-4 items-center text-3xl font-medium text-white sm:text-4xl">
          <div className="flex items-center justify-center">
            <span className="my-auto hidden h-px rounded bg-white md:inline-block lg:w-1/5 xl:mx-2 xl:w-1/3"></span>
            <h1 className="mx-1 text-center xl:w-1/3">
              <span className="text-tidebitTheme">Popular</span> cryptocurrencies
            </h1>
            <span className="my-auto hidden h-px rounded bg-white md:inline-block lg:w-1/5 xl:mx-2 xl:w-1/3"></span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center space-x-3 lg:justify-center xl:justify-between xl:space-x-0">
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Ethereum"
            currency="ETH"
            price={1288.4}
            fluctuating={1.14}
            gradientColor="border-[#627EEA]/50 bg-black from-[#627eea]/60 via-zinc-900 to-black"
            tokenComponent=<img
              src="/elements/group_15143.svg"
              alt="eth"
              width={40}
              height={40}
              className="fill-red-500"
            />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Bitcoin"
            currency="BTC"
            price={19848.8}
            gradientColor="border-yellow-800 bg-white from-yellow-800 via-gray-900 to-black"
            fluctuating={3.46}
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Litecoin"
            currency="LTC"
            price={54.57}
            fluctuating={-3.46}
            gradientColor="border-zinc-800 bg-white from-zinc-500 via-zinc-800 to-black"
            tokenComponent=<img
              src="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg"
              alt="litecoin"
            />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Polygon"
            currency="MATIC"
            price={0.82}
            fluctuating={-6.23}
            gradientColor="border-purple-900 bg-white from-purple-900 via-gray-900 to-black"
            tokenComponent=<img
              src="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg"
              alt="polygon"
            />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="BNB"
            currency="BNB"
            price={274.54}
            fluctuating={-6.23}
            gradientColor="border-amber-800 bg-white from-amber-800 via-gray-900 to-black"
            tokenComponent=<img src="/elements/group_2374.svg" alt="bnb" />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Solana"
            currency="SOL"
            price={28.41}
            fluctuating={1.14}
            gradientColor="border-[#8578DB80] from-[#8578DB80] to-black"
            tokenComponent=<img src="/elements/group_2378.svg" alt="solana" />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Shiba Inu"
            currency="SHIB"
            price={0.0000099}
            fluctuating={-3.46}
            gradientColor="border-red-900 from-[#F3050480] via-zinc-900 to-black"
            tokenComponent=<img src="/elements/group_2381.svg" alt="shiba inu" />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Polkadot"
            currency="DOT"
            price={5.92}
            fluctuating={3.46}
            gradientColor="border-[#E60B7A] from-[#E60B7A80] via-zinc-900 to-transparent"
            tokenComponent=<img src="/elements/group_2385.svg" alt="polkadot" />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Cardano"
            currency="ADA"
            price={0.3611}
            fluctuating={1.14}
            gradientColor="border-[#3CC8C8] from-[#3CC8C880] via-zinc-900 to-black"
            tokenComponent=<img src="/elements/group_2388.svg" alt="cardano" />
          />
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          <CryptoCard
            chain="Avalanche"
            price={15.77}
            currency="AVAX"
            fluctuating={-6.23}
            gradientColor="border-red-900 from-[#F3050480] via-zinc-900 to-black"
            tokenComponent=<img src="/elements/group_2391.svg" alt="avax" />
          />
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;
