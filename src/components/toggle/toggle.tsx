import React, {Dispatch, SetStateAction, useState} from 'react';

interface IToggleProps {
  id: string;
  lockedToOpen?: boolean;
  initialToggleState?: boolean;
  getToggledState: (props: boolean) => void;
  toggleStateFromParent?: boolean;
  setToggleStateFromParent?: Dispatch<SetStateAction<boolean>>;
}

const Toggle = ({
  id,
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

  const passToggledStateHandler = (data: boolean) => {
    getToggledState(data);
  };

  const toggleClickHandler = () => {
    if (lockedToOpen) return;
    setToggle(!toggle);
    passToggledStateHandler(!toggle);
  };

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
    <div
      id={id}
      onClick={toggleClickHandler}
      className={`${toggleBackgroundStyle} flex h-2 w-8 cursor-pointer items-center rounded-full duration-300 ease-in-out`}
    >
      <div
        className={`${toggleSwitchStyle} h-4 w-4 rounded-full shadow-md duration-300 ease-in-out`}
      ></div>
    </div>
  );

  return <>{tidebitToggle}</>;
};

export default Toggle;
