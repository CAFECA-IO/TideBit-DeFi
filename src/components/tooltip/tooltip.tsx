import {useState} from 'react';
import {AiOutlineQuestionCircle} from 'react-icons/ai';

interface ITooltipProps {
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({children, className}: ITooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const mouseEnterHandler = () => setShowTooltip(true);
  const mouseLeaveHandler = () => setShowTooltip(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className="opacity-70">
        <AiOutlineQuestionCircle size={16} />
      </div>
      {showTooltip ? (
        <div
          role="tooltip"
          className="absolute -right-0 bottom-6 z-20 w-fit rounded bg-darkGray8 p-4 shadow-lg shadow-black/80 transition duration-150 ease-in-out"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Tooltip;
