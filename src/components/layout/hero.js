import React from 'react';

const Hero = ({ heading, content }) => {
	return (
		<section className="text-gray-400 bg-black body-font">
			<div className="container px-5 py-24 mx-auto flex flex-wrap">
				<div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
					<div className="w-full sm:p-4 px-4 mb-6">
						<h1 className="title-font font-medium text-xl mb-2 text-white">
							{heading
								? heading
								: `
              Moon hashtag pop-up try-hard offal truffaut
              `}
						</h1>
						<div className="leading-relaxed">
							{content
								? content
								: `Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar
							neutra sustainable fingerstache kickstarter.`}
						</div>
					</div>
				</div>
				<div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
					<img
						className="object-cover object-center w-full h-full"
						src="https://dummyimage.com/600x300"
						alt="stats"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
