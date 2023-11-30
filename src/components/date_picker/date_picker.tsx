import React, {useCallback, useState} from 'react';
import Image from 'next/image';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {MONTH_FULL_NAME_LIST, WEEK_LIST} from '../../constants/config';
import {timestampToString} from '../../lib/common';

type Dates = {
  date: number;
  time: number;
  disable: boolean;
};
interface IPopulateDatesParams {
  id: string;
  daysInMonth: Dates[];
  selectedTime: number;
  selectedYear: number;
  selectedMonth: number;
  selectDate: (date: Dates) => void;
}

interface IDatePickerProps {
  id: string;
  date: number;
  minDate?: number;
  maxDate?: number;
  setDate: (date: number) => void;
}

const formatGridStyle = 'grid grid-cols-7 gap-4';

/* Info:(20230530 - Julian) Safari 只接受 YYYY/MM/DD 格式的日期 */
const PopulateDates = ({
  id,
  daysInMonth,
  selectedTime,
  selectedYear,
  selectedMonth,
  selectDate,
}: IPopulateDatesParams) => {
  const formatDaysInMonth = daysInMonth.map((el: Dates, index) => {
    const date = el ? new Date(`${selectedYear}/${selectedMonth}/${el.date}`) : null;
    const isSelected = el?.date && date?.getTime() === selectedTime * 1000 ? true : false;

    const formatDate = el?.date ? (el.date < 10 ? `0${el.date}` : `${el.date}`) : ' ';

    const dateClickHandler = () => {
      if (el?.date && !el?.disable) selectDate(el);
    };

    return (
      <button
        key={index}
        id={`${id}${formatDate}`}
        className={`whitespace-nowrap rounded-full text-center ${
          isSelected ? 'bg-tidebitTheme hover:bg-tidebitTheme' : ''
        }${el?.disable ? 'text-lightGray' : 'hover:bg-cuteBlue hover:cursor-pointer'}`}
        onClick={dateClickHandler}
      >
        {formatDate}
      </button>
    );
  });

  return <div className={formatGridStyle}>{formatDaysInMonth}</div>;
};

const DatePicker = ({id, date, minDate, maxDate, setDate}: IDatePickerProps) => {
  const [selectedMonth, setSelectedMonth] = useState(+timestampToString(date).month);
  const [selectedYear, setSelectedYear] = useState(+timestampToString(date).year);
  const {targetRef, componentVisible, setComponentVisible} = useOuterClick<HTMLDivElement>(false);

  const displayWeek = WEEK_LIST.map(v => <div key={v}>{v}</div>);

  const openDateHandler = () => setComponentVisible(!componentVisible);

  // Info: (20230601 - Julian) 取得該月份第一天是星期幾
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(`${year}/${month}/01`).getDay();
  };

  const daysInMonth = (year: number, month: number) => {
    const day = firstDayOfMonth(year, month);
    const dateLength = new Date(year, month, 0).getDate();
    let dates: Dates[] = [];
    for (let i = 0; i < dateLength; i++) {
      const dateTime = new Date(`${year}/${month}/${i + 1}`).getTime() / 1000;

      const isEarlyThanMinDate = minDate ? dateTime < minDate : false;
      const isLaterThanMaxDate = maxDate ? dateTime > maxDate : false;

      const date: Dates = {
        date: i + 1,
        time: dateTime,
        disable: isEarlyThanMinDate || isLaterThanMaxDate,
      };
      dates.push(date);
    }
    dates = Array(...Array(day)).concat(dates);
    return dates;
  };

  const goToNextMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const goToPrevMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const selectDate = useCallback(
    (el: Dates) => {
      setDate(el.time);
      setComponentVisible(false);
    },
    [minDate, maxDate, selectedMonth, selectedYear, date]
  );

  return (
    <div
      className={`relative flex h-48px flex-col items-start justify-center ${
        componentVisible ? 'bg-darkGray8' : 'bg-darkGray7'
      } transition-all duration-200 ease-in-out`}
    >
      <button
        id={id}
        className="inline-flex w-140px items-center justify-between px-5 py-3"
        onClick={openDateHandler}
      >
        <div className="mr-2 whitespace-nowrap text-sm text-lightGray4">
          {timestampToString(date).date}
        </div>
        <Image src="/elements/date_icon.svg" alt="date_icon" width={20} height={20} />
      </button>

      <div
        ref={targetRef}
        className={`absolute top-12 z-10 flex h-auto w-320px flex-col bg-darkGray2 p-6 ${
          componentVisible ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between py-2">
          <div className="text-2xl">{`${
            MONTH_FULL_NAME_LIST[selectedMonth - 1]
          } ${selectedYear}`}</div>
          <div className="flex items-center space-x-4">
            <button
              className="h-10px w-10px rotate-45 border-b-2 border-l-2 border-lightWhite hover:opacity-50"
              onClick={goToPrevMonth}
            ></button>
            <button
              className="h-10px w-10px -rotate-45 border-b-2 border-r-2 border-lightWhite hover:opacity-50"
              onClick={goToNextMonth}
            ></button>
          </div>
        </div>
        <div className={`my-4 ${formatGridStyle} text-center text-xxs text-lightGray`}>
          {displayWeek}
        </div>

        <PopulateDates
          id={id}
          daysInMonth={daysInMonth(selectedYear, selectedMonth)}
          selectedTime={date}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectDate={selectDate}
        />
      </div>
    </div>
  );
};

export default DatePicker;
