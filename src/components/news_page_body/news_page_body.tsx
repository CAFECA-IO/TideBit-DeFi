import React from 'react';
import NewsHeader from '../news_header/news_header';
import NewsSection from '../news_section/news_section';

const NewsPageBody = () => {
  return (
    <div className="">
      <div className="mb-16">
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
