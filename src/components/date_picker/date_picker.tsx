import React, {useCallback, useState} from 'react';
import Image from 'next/image';
import {MONTH_FULL_NAME_LIST, WEEK_LIST} from '../../constants/config';

type Dates = {
  date: number;
  time: number;
  disable: boolean;
};
interface IPopulateDatesParams {
  daysInMonth: Dates[];
  selectedTime: number;
  selectedYear: number;
  selectedMonth: number;
  selectDate: (date: Dates) => void;
}

interface IDatePickerProps {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  setDate: (date: Date) => void;
}

const formatGridStyle = 'grid grid-cols-7 gap-4';

const PopulateDates = ({
  daysInMonth,
  selectedTime,
  selectedYear,
  selectedMonth,
  selectDate,
}: IPopulateDatesParams) => {
  const formatDaysInMonth = daysInMonth.map((el: Dates) => {
    const date = el ? new Date(`${selectedYear}-${selectedMonth + 1}-${el.date}`) : null;
    const isSelected = date?.getTime() && el.date === selectedTime ? true : false;

    const formatDate = el?.date !== undefined ? (el.date < 10 ? `0${el.date}` : `${el.date}`) : ' ';

    const dateClickHandler = () => {
      if (el?.date && !el?.disable) selectDate(el);
    };

    return (
      <div
        key={formatDate}
        className={`whitespace-nowrap rounded-full text-center hover:cursor-pointer hover:bg-cuteBlue ${
          isSelected ? 'bg-tidebitTheme' : ''
        }${el?.disable ? 'text-lightGray' : ''}`}
        onClick={dateClickHandler}
      >
        {formatDate}
      </div>
    );
  });

  return <div className={formatGridStyle}>{formatDaysInMonth}</div>;
};

const DatePicker = ({date, minDate, maxDate, setDate}: IDatePickerProps) => {
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth()); // 0 (January) to 11 (December).
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [openDates, setOpenDates] = useState(false);

  const displayWeek = WEEK_LIST.map(v => {
    return <div key={v}>{v}</div>;
  });

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = (year: number, month: number) => {
    const day = firstDayOfMonth(year, month);
    const dateLength = new Date(year, month + 1, 0).getDate();
    let dates: Dates[] = [];
    for (let i = 0; i < dateLength; i++) {
      const dateTime = new Date(`${year}-${month + 1}-${i + 1}`).getTime();
      const date = {
        date: i + 1,
        time: dateTime,
        disable: minDate
          ? dateTime < minDate.getTime()
            ? true
            : maxDate
            ? dateTime > maxDate.getTime()
              ? true
              : false
            : false
          : maxDate
          ? dateTime > maxDate.getTime()
            ? true
            : false
          : false,
      };
      dates.push(date);
    }
    dates = Array(...Array(day)).concat(dates);
    return dates;
  };

  const formatDate = (obj: Date) => {
    const day = obj.getDate();
    const month = obj.getMonth() + 1;
    const formatDay = day < 10 ? '0' + day : `${day}`;
    const formatMonth = month < 10 ? '0' + month : `${month}`;
    const year = obj.getFullYear();
    return year + '-' + formatMonth + '-' + formatDay;
  };

  const goToNextMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const goToPrevMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const selectDate = useCallback(
    (el: Dates) => {
      let newDate = new Date(el.time);
      newDate = new Date(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`);
      setDate(newDate);
      setOpenDates(false);
    },
    [minDate, maxDate, selectedMonth, selectedYear, date]
  );

  const openDateHandler = () => {
    setOpenDates(!openDates);
  };

  return (
    <div
      className={`relative flex h-48px flex-col items-start justify-center transition-all duration-200 ease-in-out ${
        openDates ? 'bg-darkGray8' : 'bg-darkGray7'
      } hover:cursor-pointer`}
    >
      {/*       <button
        className="inline-flex w-140px items-center justify-between px-5 py-3"
        onClick={openDateHandler}
      >
        <div className="mr-2 whitespace-nowrap text-sm text-lightGray4">{formatDate(date)}</div>
        <Image src="/elements/date_icon.svg" alt="" width={20} height={20} />
      </button>

      <div 
        className={`absolute top-10 z-10 h-auto  w-320px flex-col bg-darkGray2 p-6 ${
          openDates ? 'flex' : 'hidden'
        }`}
      >
        <div className="flex items-center justify-between py-2">
          <div className="text-2xl">{`${MONTH_FULL_NAME_LIST[selectedMonth]} ${selectedYear}`}</div>
          <div className="flex">
            <div
              className="h-10px w-10px rotate-45 border-b-2 border-l-2 border-lightWhite"
              onClick={goToPrevMonth}
            ></div>
            <div
              className="ml-4 h-10px w-10px -rotate-45 border-b-2 border-r-2 border-lightWhite"
              onClick={goToNextMonth}
            ></div>
          </div>
        </div>

        <div className={`my-4 ${formatGridStyle} text-center text-xxs text-lightGray`}>
          {displayWeek}
        </div>

        <PopulateDates
          daysInMonth={daysInMonth(selectedYear, selectedMonth)}
          selectedTime={new Date(formatDate(date)).getDate()}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectDate={selectDate}
        />
      </div> */}
    </div>
  );
};

export default DatePicker;
