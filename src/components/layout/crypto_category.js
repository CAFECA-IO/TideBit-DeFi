import CryptoCard from '../shared/card/crypto_card';

const CryptoCategory = () => {
	return (
		<div className="mt-20 container mx-auto flex flex-wrap justify-center px-20 space-y-1">
			<div className="flex flex-col text-center w-full mb-20">
				<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white items-center">
					<span className="hidden md:inline-block h-px xl:w-1/4 lg:w-1/5 md:w-1/6 rounded bg-white mx-2 mb-3"></span>
					<span className="text-blue-400">Popular</span> cryptocurrencies
					<span className="hidden md:inline-block h-px xl:w-1/4 lg:w-1/5 md:w-1/6 rounded bg-white mx-2 mb-3"></span>
				</h1>
				<p className="lg:w-2/3 mx-auto leading-relaxed text-base">some text</p>
			</div>
			<div className="flex flex-wrap xl:justify-between lg:justify-center justify-center">
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
