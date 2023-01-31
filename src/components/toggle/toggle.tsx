import {useState} from 'react';

interface IToggleProps {
  // toggle: boolean;
  // toggleClickHandler: () => void;
  disabled?: boolean;
  initialToggleState?: boolean;
  // toggleStateFromParent?: boolean;
  getToggledState: (props: boolean) => void;
  // getToggleFunction?: (props: () => void) => void;
}

const Toggle = ({
  initialToggleState = false,
  getToggledState,
  disabled,
}: // getToggleFunction,
IToggleProps) => {
  const [toggle, setToggle] = useState(initialToggleState);

  // function to handle pass the `toggle` state to parent component
  const passToggledStateHandler = (data: boolean) => {
    getToggledState(data);
  };

  // function to handle toggle state
  const toggleClickHandler = () => {
    if (disabled) return;
    setToggle(!toggle);
    passToggledStateHandler(!toggle);

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
  // FIXME: `disabled` changed to `lockedToOpen`
  const toggleSwitchStyle = toggle || disabled ? 'transform translate-x-full' : null;
  const toggleBackgroundStyle = disabled ? 'bg-[#8B8E91]' : toggle ? 'bg-[#29C1E1]' : null;

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
