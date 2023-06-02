import React from 'react';
import NewsHeader from '../news_header/news_header';
import NewsSection from '../news_section/news_section';

const NewsPageBody = () => {
  return (
    <div className="bg-gradient-to-r from-darkGray1/80 via-black to-black pt-40">
      <div className="mb-12">
        {' '}
        <NewsHeader />
      </div>
      <div className="">
        {' '}
        <NewsSection />
      </div>
    </div>
  );
};

export default NewsPageBody;
