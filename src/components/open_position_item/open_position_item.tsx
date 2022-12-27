import {useState} from 'react';

const OpenPositionItem = () => {
  const progressPercentage = 50;
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState('');
  // const style = {'--value': 70} as React.CSSProperties;

  // let progressValue = 0;
  // const progressEndValue = 100;
  // const speed = 50;
  // const progress = setInterval(() => {
  //   progressValue++;
  //   valueContainer.textContent = `${progressValue}%`;
  //   progressBar.style.background = `conic-gradient(
  //     #4d5bf9 ${progressValue * 3.6}deg,
  //     #cadcff ${progressValue * 3.6}deg
  // )`;
  //   if (progressValue == progressEndValue) {
  //     clearInterval(progress);
  //   }
  // }, speed);

  return (
    <div>
      {/* brief of this open position */}
      <div>
        {/* <div className="h-10 w-10 rounded-full pt-2 text-center text-lightRed ring-4 ring-lightGray3">
          11 H
        </div>
        <div className="h-10 w-10 rounded-full pt-2 text-center text-lightRed ring-4 ring-lightRed"></div> */}
        {/* custom radical progress */}
        {/* <div className="circular-progress">test</div> */}
        <div className="h-16 rounded-full bg-gray-300"></div>
        <div
          className="h-16 rounded-full bg-gray-300"
          style={{width: `${progressPercentage}%`}}
        ></div>

        <div className="relative h-16 rounded-full border-2 border-gray-600 bg-gray-300">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{clip: 'rect(0, 32px, 32px, 16px)'}}
          >
            <div className="h-full w-full bg-teal-500 text-center text-xs font-semibold leading-5 tracking-widest text-white">
              {label}
            </div>
          </div>
          <div
            className="relative h-full w-full rounded-full bg-gray-300"
            style={{clip: 'rect(0, 32px, 32px, 16px)', width: `${progress}%`}}
          ></div>
        </div>

        {/* 單純進度條 */}
        <div className="h-1 w-full bg-gray-300">
          <div
            style={{width: `${progressPercentage}%`}}
            className={`h-full ${progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'}`}
          ></div>
        </div>
      </div>

      {/* Line graph */}
      <div></div>
    </div>
  );
};

export default OpenPositionItem;
