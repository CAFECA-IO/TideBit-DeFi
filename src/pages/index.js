import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/layout/banner';
import Hero from '../components/layout/hero';
import NavBar from '../components/layout/nav_bar';
import StatisticBlock from '../components/layout/statistic';

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
							<Banner />
						</div>
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
