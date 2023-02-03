import {Dispatch, SetStateAction, useState} from 'react';

interface IToggleProps {
  // toggle: boolean;
  // toggleClickHandler: () => void;
  lockedToOpen?: boolean;
  initialToggleState?: boolean;
  getToggledState?: (props: boolean) => void;
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
    if (getToggledState) {
      getToggledState(data);
    }
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

  //TODO: bg-tidebitTheme [#29C1E1]
  const toggleSwitchStyle =
    toggle && lockedToOpen
      ? 'transform translate-x-full bg-lightGray shadow-lg shadow-black/80'
      : toggle
      ? 'transform translate-x-full bg-white'
      : 'bg-white';
  const toggleBackgroundStyle = lockedToOpen ? 'bg-[#8B8E91]' : toggle ? 'bg-[#29C1E1]' : null;

  const tidebitToggle = (
    // Toggle background
    <div
      onClick={toggleClickHandler}
      className={`${toggleBackgroundStyle} flex h-2 w-8 cursor-pointer items-center rounded-full bg-lightGray3 duration-300 ease-in-out`}
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
