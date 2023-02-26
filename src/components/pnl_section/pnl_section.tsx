import React from 'react';

const PnlSection = () => {
  const statisticContent = [
    {
      heading: '1',
      content: '11',
    },
    {
      heading: '2',
      content: '22',
    },
    {
      heading: '3',
      content: '33',
    },
  ];

  const statisticContentList = statisticContent.map(({heading, content}) => (
    <div key={heading} className="mb-6 flex w-screen justify-center p-4 lg:mb-0 lg:w-1/3">
      <div className="h-full text-center lg:text-start">
        <p className="text-lg leading-relaxed xl:text-xl">{heading}</p>
        <h2 className="text-3xl font-medium text-white md:text-4xl xl:text-5xl">{content}</h2>
      </div>
    </div>
  ));

  return (
    <section className={`bg-black text-gray-400`}>
      <div className="mx-auto">
        <div className="flex flex-wrap">{statisticContentList}</div>
      </div>
    </section>
  );
};

export default PnlSection;
