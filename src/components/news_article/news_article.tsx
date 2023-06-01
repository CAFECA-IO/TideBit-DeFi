import Image from 'next/image';
import React from 'react';
import {BiArrowBack} from 'react-icons/bi';
import NavBar from '../nav_bar/nav_bar';
import {useRouter} from 'next/router';
import Link from 'next/link';

interface INewsArticle {
  img: string;

  article?: {
    newsId: string;
    img: string;
    date: number;
    title: string;
    content: string;
  };
  recommendation?: Array<{
    img: string;
    date: number;
    title: string;
    description: string;
  }>;
}

const NewsArticle = ({img, recommendation}: INewsArticle) => {
  return (
    <div className="bg-gradient-to-r from-darkGray1/80 via-black to-black">
      <div className="ml-5 h-10 w-6 pt-24 pb-14 transition-all duration-200 hover:opacity-70 lg:hidden">
        <Link href="/news">
          <BiArrowBack size={25} />
        </Link>{' '}
      </div>

      <div className="flex w-full justify-center lg:pt-36">
        <div className="hidden h-10 w-6 transition-all duration-200 hover:opacity-70 lg:-ml-20 lg:mr-20 lg:flex">
          <Link href="/news">
            <BiArrowBack size={25} />
          </Link>
        </div>
        <div className="w-600px px-5">
          <Image src={img} width={600} height={100} alt="image" />
          <div className="my-8 flex justify-between">
            {' '}
            <h1 className="text-xl font-normal leading-8 tracking-wider">Add news title here</h1>
            <p className="mt-2 mr-2 text-sm text-lightGray">2023/06/01</p>
          </div>
          <p className="text-base leading-10 tracking-normal text-lightGray1">
            Lorem ipsum dolor sit amet, consectetuer{' '}
            <span className="bg-blue-500">a over 5% depreciation</span> elit. Aenean commodo ligula
            eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
            sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec,
            vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
            Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus
            elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor
            eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis,
            feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum.
            Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
            Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam
            semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel,
            luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec
            vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget
            eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales
            sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
          </p>

          <div className="my-16 text-lightGray">
            <div className="mb-3">Share this on</div>
            <div className="flex justify-start space-x-5">
              <div className="">FB</div>
              <div className="">Twitter</div>
              <div className="">Reddit</div>
            </div>
          </div>
        </div>
      </div>
      {/* After divider */}

      {recommendation ? (
        <>
          <div className="mx-10 border-b border-dashed border-white/50"></div>

          <div className="text-base text-lightGray">You might also like ...</div>
          <div className="flex">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default NewsArticle;
