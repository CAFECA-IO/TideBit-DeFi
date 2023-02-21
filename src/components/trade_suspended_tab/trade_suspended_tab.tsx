import React from 'react';

const TradeSuspendedTab = () => {
  const tabBodyWidth = 'w-320px';

  const conesSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="81.657"
      height="95.538"
      viewBox="0 0 81.657 95.538"
    >
      <g data-name="Group 15196" transform="translate(-3560.025 -282.586)">
        <path
          fill="#2a3139"
          d="M3641.682 736.554c0 9.388-14.682 15.1-40.828 15.1-24.94 0-40.829-5.712-40.829-15.1 0-.992.089-4.3.089-4.3 4.053-5.9 21.24-8.761 40.74-8.761 19.433 0 36.612 3.307 40.735 8.828-.001.003.093 3.33.093 4.233z"
          data-name="Path 26352"
          transform="translate(0 -373.529)"
        ></path>
        <path
          fill="#1e2329"
          d="M3641.682 714.181c0 9.388-14.682 15.1-40.828 15.1-24.94 0-40.829-5.712-40.829-15.1 0-7.338 18.28-13.058 40.829-13.058s40.828 6.524 40.828 13.058z"
          data-name="Path 26353"
          transform="translate(0 -354.575)"
        ></path>
        <path
          fill="#404a55"
          d="M3668.118 286.826h-9.654l-24.739 75.5s5.229 8.246 28.56 8.246c26.146 0 30.571-8.246 30.571-8.246z"
          data-name="Path 26354"
          transform="translate(-62.438 -3.592)"
        ></path>
        <g fill="#2a3139" data-name="Group 15195" transform="translate(3571.288 283.234)">
          <path
            d="M3754.268 463.3l-2.775-8.469a89.616 89.616 0 01-14.246 1.015 75.448 75.448 0 01-12.267-.913l-2.77 8.455a69.924 69.924 0 0015.037 1.445 82.427 82.427 0 0017.021-1.533z"
            data-name="Path 26355"
            transform="translate(-3708.688 -429.16)"
          ></path>
          <path
            d="M3723.6 590.69l-3.253-9.929c-4.587 1.361-11.171 2.422-20.551 2.422a62.614 62.614 0 01-18.555-2.373l-3.237 9.88c4.334 1.857 11.2 3.558 21.792 3.558 11.881 0 19.274-1.701 23.804-3.558z"
            data-name="Path 26356"
            transform="translate(-3671.241 -535.841)"
          ></path>
          <path
            d="M3662.286 716.288c-13.8 0-21.265-2.885-25.063-5.242l-3.5 10.672s5.229 8.246 28.56 8.246c26.146 0 30.571-8.246 30.571-8.246l-3.48-10.621c-3.874 2.348-11.736 5.191-27.088 5.191z"
            data-name="Path 26357"
            transform="translate(-3633.726 -646.216)"
          ></path>
          <path
            d="M3772.9 301.851a98.826 98.826 0 0010.583-.525l-4.751-14.5h-9.654l-4.785 14.6a82.663 82.663 0 008.607.425z"
            data-name="Path 26358"
            transform="translate(-3744.341 -286.826)"
          ></path>
        </g>
        <path
          fill="#2a3139"
          d="M3580.2 786.579a21.809 21.809 0 0014.352 6.073c.72.022 1.646-.15 1.782-.858s-.663-1.214-1.345-1.449c-2.5-.859-5.181-1.107-7.629-2.093a8.833 8.833 0 01-3.859-2.856c-.885-1.217-.626-3.43-1.627-4.3a2.063 2.063 0 00-3.241.916c-.812 1.768.33 3.367 1.567 4.567z"
          data-name="Path 26359"
          transform="translate(-15.533 -421.911)"
        ></path>
        <path
          fill="#1e2329"
          d="M3805.156 283.234c0 .358-2.171.648-4.849.648s-4.849-.29-4.849-.648 2.171-.648 4.849-.648 4.849.29 4.849.648z"
          data-name="Path 26360"
          transform="translate(-199.454)"
        ></path>
      </g>
    </svg>
  );

  return (
    <>
      <div>
        {/* `overflow-y-scroll scroll-smooth` only show the scroll bar but no functionality */}
        <div
          className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
        >
          <div className="relative my-6 mx-auto w-auto max-w-xl">
            {' '}
            <div className={`relative`}>
              {/* ---sidebar self--- */}
              <div
                className={`pointer-events-auto ${tabBodyWidth} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
              >
                {/* <h1 className="pl-5 text-2xl font-bold">Start to trade</h1> */}

                <div className="h-full w-full flex-col justify-center pt-2/3">
                  <div className="">
                    <div className="px-1/3">{conesSvg}</div>

                    <div className="space-y-2 pt-3">
                      <h1 className="text-center text-xl tracking-normal text-lightWhite">
                        Stop Trading
                      </h1>
                      <p className="text-center text-xs tracking-wide text-lightGray">
                        {' '}
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                        eirmod tempor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {/* <span className="absolute top-420px my-auto h-px w-7/8 rounded bg-white/50"></span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeSuspendedTab;
