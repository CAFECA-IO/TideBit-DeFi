import React, {Dispatch, SetStateAction} from 'react';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const Pagination = ({activePage, setActivePage, totalPages}: IPagination) => {
  const arrowSize = 'h-6 w-6';
  const truncationLimit = 5;
  const surroundPage = Math.floor(truncationLimit / 2);

  const pagesNum = Array.from({length: totalPages}, (_, i) => i + 1);

  const isPageVisible = (page: number) => {
    if (page === 1 || page === totalPages) {
      return true;
    }

    if (activePage <= truncationLimit - 1 && page <= truncationLimit) {
      return true;
    } else if (
      activePage >= truncationLimit &&
      activePage <= totalPages - 1 &&
      page >= activePage - surroundPage &&
      page <= activePage + surroundPage
    ) {
      return true;
    } else if (activePage >= totalPages - 1 && page > totalPages - truncationLimit) {
      return true;
    }

    return false;
  };

  const pages = pagesNum.map((page, i, arr) => {
    const isPrevPageVisible = arr[i - 1] ? isPageVisible(arr[i - 1]) : false;
    const shouldTruncateBefore = page !== 1 && !isPrevPageVisible && isPageVisible(page);
    return (
      <>
        {shouldTruncateBefore && <li>...</li>}
        {isPageVisible(page) && (
          <li key={`page-section-${page}`}>
            <button
              onClick={() => setActivePage(page)}
              className={`block h-8 w-8 rounded bg-transparent text-center leading-8 text-white hover:cursor-pointer `}
            >
              {page}
            </button>
            <div
              className={`${activePage === page ? 'border-2 border-b border-tidebitTheme' : ''}`}
            ></div>
          </li>
        )}
      </>
    );
  });

  const isDisplayedNextPage = activePage === totalPages ? 'invisible' : 'inline-flex';
  const isDisplayedPrevPage = activePage === 1 ? 'invisible' : 'inline-flex';

  const pagination = (
    <>
      <li>
        <button
          onClick={() => setActivePage((prev: number) => Math.max(prev - 1, 1))}
          className={`${isDisplayedPrevPage} inline-flex h-8 w-8 items-center justify-center rounded bg-transparent text-white hover:cursor-pointer rtl:rotate-180`}
        >
          <span className="sr-only">Prev Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={arrowSize}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </li>

      {pages}
      <li>
        <button
          onClick={() => setActivePage((prev: number) => Math.min(prev + 1, totalPages))}
          className={`${isDisplayedNextPage} inline-flex h-8 w-8 items-center justify-center rounded bg-transparent text-white hover:cursor-pointer rtl:rotate-180`}
        >
          <span className="sr-only">Next Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={arrowSize}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </li>
    </>
  );

  return (
    <ol className="flex justify-center gap-1 text-sm font-medium lg:mr-20 lg:justify-end">
      {pagination}
    </ol>
  );
};

export default Pagination;
