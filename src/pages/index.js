import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/layout/banner';
import Hero from '../components/layout/hero';
import NavBar from '../components/layout/nav_bar';
import StatisticBlock from '../components/layout/statistic';
import CryptoCategory from '../components/layout/crypto_category';
import HeroReverse from '../components/layout/hero_reverse';
import AppDowloadContainer from '../components/layout/app_download_container';

const Home = () => {
	return (
		<>
			<Head>
				<title>TideBit DeFi</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<NavBar />

			<div className="bg-black flex min-h-screen flex-col items-center justify-center py-24 overflow-hidden">
				<main>
					<div className="">
						<div className="overflow-y-auto">
							<Hero
								heading={`Trusted platform for Crypto investment`}
								content={`Start investing now. On TideBit you can learn, buy and sell cryptocurrency assets with the best quality. `}
							/>
							<StatisticBlock />
							<CryptoCategory />
							<Banner />
							<HeroReverse heading={`Web 3.0`} />
							<Hero heading={`Easy Trade`} />
							<HeroReverse heading={`Security System`} />
							<Hero heading={`Free Online Courses`} />

							<h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-lg md:px-20 py-20 flex-shrink-0 text-white flex justify-center items-center px-2 font-bold">
								Trade on&nbsp;<span className="text-cyan-400">TideBit</span>
								&nbsp;anywhere, anytime
							</h1>
							<AppDowloadContainer />
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
