import {useState} from 'react';

interface IToggleProps {
  // toggle: boolean;
  // toggleClickHandler: () => void;
  getToggledState: (props: boolean) => void;
}

const Toggle = ({getToggledState}: IToggleProps) => {
  const [toggle, setToggle] = useState(false);

  // function to handle pass the `toggle` state to parent component
  const passToggledStateHandler = (data: boolean) => {
    getToggledState(data);
  };

  // function to handle toggle state
  const toggleClickHandler = () => {
    setToggle(!toggle);
    passToggledStateHandler(!toggle);
  };

  // TODO:[Notes] css solution: after, checked
  const blueStandardToggle = (
    <label className="relative right-5 mb-5 inline-flex cursor-pointer items-center">
      <input type="checkbox" value="" className="peer sr-only" />
      <div className="absolute h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-2px after:left-2px after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-'' peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );

  //TODO: bg-tidebitTheme [#29C1E1]
  const toggleSwitchStyle = toggle ? 'transform translate-x-full' : null;
  const toggleBackgroundStyle = toggle ? 'bg-[#29C1E1]' : null;

  const tidebitToggle = (
    // Toggle background
    <div
      onClick={toggleClickHandler}
      className={`${toggleBackgroundStyle} flex h-2 w-8 cursor-pointer items-center rounded-full bg-lightGray3 duration-300 ease-in-out`}
    >
      {/* Switch */}
      <div
        className={`${toggleSwitchStyle} h-4 w-4 rounded-full bg-white shadow-md duration-300 ease-in-out`}
      ></div>
    </div>
  );

  return <div>{tidebitToggle}</div>;
};

export default Toggle;
