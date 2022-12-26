import TestReserveRatio from '../components/reserve_ratio/test_reserve_ratio';

const Trial = () => {
  const flowTest = (
    <>
      <button
        data-tooltip-target="tooltip-top"
        data-tooltip-placement="top"
        type="button"
        className="mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mb-0"
      >
        Tooltip top
      </button>
      <div
        id="tooltip-top"
        role="tooltip"
        className="invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm dark:bg-gray-700"
      >
        Tooltip on top
        <div className="" data-popper-arrow></div>
      </div>
    </>
  );

  const rippleEffect = (
    <div className="flex justify-center space-x-2">
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
      >
        Button
      </button>
    </div>
  );

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center">
        <TestReserveRatio />
        {rippleEffect}
      </div>
    </>
  );
};

export default Trial;
