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

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center">
        <TestReserveRatio />
        {flowTest}
      </div>
    </>
  );
};

export default Trial;
