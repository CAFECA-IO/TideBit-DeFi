const StatisticBlock = () => {
	const statisticContent = [
		{ heading: '24h volumn on TideBit', content: '365 Billion' },
		{ heading: 'Users on TideBit', content: '30 Billion+' },
		{ heading: 'Lowest Fee', content: '<0.10 %' },
	];
	return (
		<section className="text-gray-400 bg-black body-font">
			<div className="px-5 py-24 mx-auto">
				<div className="flex flex-wrap -m-4">
					{statisticContent.map(({ heading, content }) => (
						<div
							key={heading}
							className="lg:w-1/3 w-screen lg:mb-0 mb-6 p-4 flex justify-center"
						>
							<div className="h-full lg:text-start text-center">
								<p className="leading-relaxed text-lg">{heading}</p>
								<h2 className="title-font font-medium text-3xl text-white">
									{content}
								</h2>
							</div>
						</div>
					))}
					{/* <div className="lg:w-1/3 w-1/3 lg:mb-0 mb-6 p-4">
						<div className="h-full text-start">
							<p className="leading-relaxed text-lg">24h volumn on TideBit</p>
							<h2 className="title-font font-medium text-3xl text-white">
								365 Billion
							</h2>
						</div>
					</div>
					<div className="lg:w-1/3 w-1/3 lg:mb-0 mb-6 p-4">
						<div className="h-full text-start">
							<p className="leading-relaxed text-lg">Users on TideBit</p>

							<h2 className="title-font font-medium text-3xl text-white">
								30 Billion+
							</h2>
						</div>
					</div>
					<div className="lg:w-1/3 w-1/3 lg:mb-0 p-4">
						<div className="h-full text-start">
							<p className="leading-relaxed text-lg">Lowest Fee</p>

							<h2 className="title-font font-medium text-3xl text-white">
								{' '}
								{`< 0.10%`}
							</h2>
						</div>
					</div> */}
				</div>
			</div>
		</section>
	);
};

export default StatisticBlock;
