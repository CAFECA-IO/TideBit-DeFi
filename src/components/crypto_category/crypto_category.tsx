import CryptoCard from '../card/crypto_card';

const CryptoCategory = ({...otherProps}) => {
  const customClassName = otherProps?.className;
  return (
    <div
      className={`${customClassName} container mx-auto flex shrink-0 flex-wrap justify-center space-y-1`}
    >
      <div className="mb-10 flex w-full flex-col text-center xl:mb-20">
        <div className="mb-0 items-center text-2xl font-medium text-white xs:text-3xl sm:text-4xl">
          <div className="flex items-center justify-center">
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2 xl:w-1/4"></span>
            <h1 className="mx-1 text-center xl:w-410px">
              <span className="text-tidebitTheme">Popular</span> cryptocurrencies
            </h1>
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2 xl:w-1/4"></span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="mb-5 grid grid-cols-2 space-y-4 space-x-4 lg:grid-cols-5">
          <CryptoCard
            className="mt-4 ml-4"
            chain="Ethereum"
            currency="ETH"
            price={1288.4}
            fluctuating={1.14}
            gradientColor="border-bluePurple/50 bg-black from-bluePurple/50 to-black"
            tokenComponent={<img src="/elements/group_2371.svg" alt="eth" width={40} height={40} />}
          />
          <CryptoCard
            chain="Bitcoin"
            currency="BTC"
            price={19848.8}
            gradientColor="border-lightOrange/50 bg-black from-lightOrange/50 to-black"
            fluctuating={3.46}
            tokenComponent={<img src="/elements/group_2372.svg" width={40} height={40} />}
          />
          <CryptoCard
            chain="Litecoin"
            currency="LTC"
            price={54.57}
            fluctuating={-3.46}
            gradientColor="border-lightGray2/50 bg-black from-lightGray2/50 to-black"
            tokenComponent={
              <img src="/elements/c5b7bda06ddfe2b3f59b37ed6bb65ab4.svg" alt="litecoin" />
            }
          />
          <CryptoCard
            chain="Polygon"
            currency="MATIC"
            price={0.82}
            fluctuating={-6.23}
            gradientColor="border-lightPurple/60 bg-black from-lightPurple/60 to-black"
            tokenComponent={
              <img src="/elements/9cc18b0cbe765b0a28791d253207f0c0.svg" alt="polygon" />
            }
          />
          <CryptoCard
            chain="BNB"
            currency="BNB"
            price={274.54}
            fluctuating={-6.23}
            gradientColor="border-lightYellow/60 bg-black from-lightYellow/50 to-black"
            tokenComponent={<img src="/elements/group_2374.svg" alt="bnb" />}
          />
          <CryptoCard
            chain="Solana"
            currency="SOL"
            price={28.41}
            fluctuating={1.14}
            gradientColor="border-lightPurple2/60 from-lightPurple2/60 to-black"
            tokenComponent={<img src="/elements/group_2378.svg" alt="solana" />}
          />
          <CryptoCard
            chain="Shiba Inu"
            currency="SHIB"
            price={0.0000099}
            fluctuating={-3.46}
            gradientColor="border-lightRed1/50 from-lightRed1/50 to-black"
            tokenComponent={<img src="/elements/group_2381.svg" alt="shiba inu" />}
          />
          <CryptoCard
            chain="Polkadot"
            currency="DOT"
            price={5.92}
            fluctuating={3.46}
            gradientColor="border-lightPink/60 from-lightPink/60 to-black"
            tokenComponent={<img src="/elements/group_2385.svg" alt="polkadot" />}
          />
          <CryptoCard
            chain="Cardano"
            currency="ADA"
            price={0.3611}
            fluctuating={1.14}
            gradientColor="border-lightGreen1/60 from-lightGreen1/60 to-black"
            tokenComponent={<img src="/elements/group_2388.svg" alt="cardano" />}
          />
          <CryptoCard
            chain="Avalanche"
            price={15.77}
            currency="AVAX"
            fluctuating={-6.23}
            gradientColor="border-lightRed2/50 from-lightRed2/50 to-black"
            tokenComponent={<img src="/elements/group_2391.svg" alt="avax" />}
          />

          {/* <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;
