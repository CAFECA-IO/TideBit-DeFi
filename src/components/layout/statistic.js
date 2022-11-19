const StatisticBlock = props => {
  const statisticContent = [
    {heading: '24h volumn on TideBit', content: '365 Billion'},
    {heading: 'Users on TideBit', content: '30 Billion+'},
    {heading: 'Lowest Fee', content: '<0.10 %'},
  ];

  const statisticContentList = statisticContent.map(({heading, content}) => (
    <div key={heading} className="mb-6 flex w-screen justify-center p-4 lg:mb-0 lg:w-1/3">
      <div className="ml-5 h-full text-center lg:text-start">
        <p className="text-lg leading-relaxed xl:text-xl">{heading}</p>
        <h2 className="text-3xl font-medium text-white md:text-4xl xl:text-5xl">{content}</h2>
      </div>
    </div>
  ));

  return (
    <section className={`bg-black text-gray-400 ${props?.className}`}>
      <div className="mx-auto px-5">
        <div className="-m-4 flex flex-wrap">{statisticContentList}</div>
      </div>
    </section>
  );
};

export default StatisticBlock;
