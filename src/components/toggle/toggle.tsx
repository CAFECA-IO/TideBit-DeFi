import {useState} from 'react';

const Toggle = () => {
  const [toggle, setToggle] = useState(false);

  const toggleClickHandler = () => {
    setToggle(!toggle);
  };

  // TODO:[Notes] css solution: after, checked
  const blueStandardToggle = (
    <label className="relative right-5 mb-5 inline-flex cursor-pointer items-center">
      <input type="checkbox" value="" className="peer sr-only" />
      <div className="absolute h-5 w-9 rounded-full bg-gray-200 after:absolute after:top-2px after:left-2px after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-'' peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );

  const toggleSwitch = ' transform translate-x-6';

  const tidebitToggle = (
    // Toggle background
    <div
      onClick={toggleClickHandler}
      className="flex h-6 w-12 cursor-pointer items-center rounded-full bg-lightGray3 p-1 md:h-7 md:w-14"
    >
      {/* Switch */}
      <div
        className={`${
          toggle ? toggleSwitch : null
        } h-5 w-5 rounded-full bg-white shadow-md duration-300 ease-in-out md:h-6 md:w-6`}
      ></div>
    </div>
  );

  return <div>{tidebitToggle}</div>;
};

export default Toggle;
