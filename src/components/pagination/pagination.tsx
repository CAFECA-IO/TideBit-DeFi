import React, {useState} from 'react';

const Pagination = () => {
  const [activePage, setActivePage] = useState(2); // Default page number is 2.
  const totalPages = 4; // The total number of pages. You should adjust this as needed.
  const arrowSize = 'h-6 w-6';

  const pagesNum = Array.from({length: totalPages}, (_, i) => i + 1);

  const pages = pagesNum.map(page => (
    <li key={page}>
      <a
        onClick={() => setActivePage(page)}
        className={`block h-8 w-8 rounded bg-transparent text-center leading-8 text-white hover:cursor-pointer `}
      >
        {page}
      </a>
      <div
        className={`${activePage === page ? 'border-2 border-b border-tidebitTheme' : ''}`}
      ></div>
    </li>
  ));

  const isDisplayedNextPage = activePage === totalPages ? 'invisible' : 'inline-flex';
  const isDisplayedPrevPage = activePage === 1 ? 'invisible' : 'inline-flex';

  const pagination = (
    <>
      <li>
        <a
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
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </li>

      {pages}
      {/* {activePage === totalPages ? null : ( */}
      <li>
        <a
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
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </li>
    </>
  );

  return (
    <ol className="mt-10 mb-20 mr-20 flex justify-end gap-1 text-sm font-medium">{pagination}</ol>
  );
};

export default Pagination;
