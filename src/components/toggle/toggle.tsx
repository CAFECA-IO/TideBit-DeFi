import {Dispatch, SetStateAction, useState} from 'react';

interface IToggleProps {
  // toggle: boolean;
  // toggleClickHandler: () => void;
  lockedToOpen?: boolean;
  initialToggleState?: boolean;
  getToggledState: (props: boolean) => void;
  // getToggleFunction?: (props: () => void) => void;
  toggleStateFromParent?: boolean;
  setToggleStateFromParent?: Dispatch<SetStateAction<boolean>>;
}

const Toggle = ({
  initialToggleState = false,
  getToggledState,
  lockedToOpen: lockedToOpen,
  toggleStateFromParent,
  setToggleStateFromParent,
}: IToggleProps) => {
  const [toggle, setToggle] =
    toggleStateFromParent && setToggleStateFromParent
      ? [toggleStateFromParent, setToggleStateFromParent]
      : useState(initialToggleState);

  // function to handle pass the `toggle` state to parent component
  const passToggledStateHandler = (data: boolean) => {
    getToggledState(data);
  };

  // function to handle toggle state
  const toggleClickHandler = () => {
    if (lockedToOpen) return;
    setToggle(!toggle);
    passToggledStateHandler(!toggle);

    // console.log('toggle state from toggle: ', toggle);
    // passToggleFunction(toggleClickHandler);
  };

  // const passToggleFunction = () => {
  //   if (getToggleFunction) {
  //     getToggleFunction(toggleClickHandler);
  //     // console.log('pass function from children component');
  //   }
  //   // toggleClickHandler();
  // };

  const toggleSwitchStyle = lockedToOpen
    ? 'transform translate-x-full bg-lightGray shadow-lg shadow-black/80'
    : toggle
    ? 'transform translate-x-full bg-white'
    : 'bg-white';
  const toggleBackgroundStyle = lockedToOpen
    ? 'bg-lightGray'
    : toggle
    ? 'bg-tidebitTheme'
    : 'bg-lightGray3';

  const tidebitToggle = (
    // Toggle background
    <div
      onClick={toggleClickHandler}
      className={`${toggleBackgroundStyle} flex h-2 w-8 cursor-pointer items-center rounded-full duration-300 ease-in-out`}
    >
      {/* Switch */}
      <div
        className={`${toggleSwitchStyle} h-4 w-4 rounded-full shadow-md duration-300 ease-in-out`}
      ></div>
    </div>
  );

  return <div>{tidebitToggle}</div>;
};

export default Toggle;
