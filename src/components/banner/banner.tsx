import Image from 'next/image';

const Banner = () => {
  return (
    <>
      <div className="">
        <section className="">
          <div className="">
            <div className="w-full bg-black">
              <a href="https://www.isun1.com/" target="_blank">
                <Image
                  className=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{width: '100%', height: 'auto'}}
                  alt="isunone"
                  src="/elements/isunone_banner.png"
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Banner;
