import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../components/layout/nav_bar';

const Home = () => {
	return (
		<>
			<Head>
				<title>TideBit DeFi</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<NavBar />

			<div className="bg-black flex min-h-screen flex-col items-center justify-center py-24 overflow-hidden">
				{/* <header>
			<NavBar />
			</header> */}
			</div>
		</>
	);
};

export default Home;
