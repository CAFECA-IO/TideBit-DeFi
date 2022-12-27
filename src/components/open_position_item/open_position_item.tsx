import {useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';

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
        <div>
          <CircularProgressBar />
        </div>
      </div>

      {/* Line graph */}
      <div></div>
    </div>
  );
};

export default OpenPositionItem;
