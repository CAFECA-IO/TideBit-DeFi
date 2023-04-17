import React, {useCallback, useState} from 'react';
import Image from 'next/image';

interface IPopulateDatesParams {
  daysInMonth: number[];
  selectedTime: number;
  selectedYear: number;
  selectedMonth: number;
  selectDate: (date: number) => void;
}

interface IDatePickerProps {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  setDate: (date: Date) => void;
}

type Dates = {
  date: number;
  time: number;
  disable: boolean;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/* ToDo: (20230320 - Julian)
 * 1. props type
 * 2. 選到的日期要有不同的顏色
 */
const PopulateDates = (props: any) => {
  return props.daysInMonth.map((el: Dates) => {
    const date = el
      ? new Date(`${props.selectedYear}-${props.selectedMonth + 1}-${el.date}`)
      : null;

    const isSelected = date?.getTime() ? date.getTime() === props.selectedTime : false;

    const formatDate = el?.date !== undefined ? (el.date < 10 ? `0${el.date}` : `${el.date}`) : ' ';
    return (
      <div
        className={`whitespace-nowrap rounded-full text-center hover:cursor-pointer ${
          isSelected ? 'bg-tidebitTheme' : ''
        }${el?.disable ? 'text-lightGray' : ''}`}
        onClick={() => {
          if (el?.date && !el?.disable) props.selectDate(el);
        }}
      >
        {formatDate}
      </div>
    );
  });
};

const DatePicker = ({date, setDate, minDate, maxDate}: IDatePickerProps) => {
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth()); // 0 (January) to 11 (December).
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [openDates, setOpenDates] = useState(false);

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
    // props.setDate(new Date(`${year}-${month}-${selectedDate}`));
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
    // props.setDate(new Date(`${year}-${month}-${selectedDate}`));
  }, [selectedMonth, selectedYear]);

  const selectDate = useCallback(
    (el: Dates) => {
      let newDate = new Date(el.time);
      newDate = new Date(
        `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()} 08:00:00`
      );
      setDate(newDate);
      setOpenDates(false);
    },
    [minDate, maxDate, selectedMonth, selectedYear, date]
  );

  return (
    <div
      className={`relative flex h-48px flex-col items-start justify-center transition-all duration-200 ease-in-out ${
        openDates ? 'bg-darkGray8' : 'bg-darkGray7'
      } hover:cursor-pointer`}
    >
      <button
        className="inline-flex w-140px items-center justify-between px-5 py-3"
        onClick={() => {
          setOpenDates(!openDates);
        }}
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
          <div className="text-2xl">{`${months[selectedMonth]} ${selectedYear}`}</div>
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

        <div className="my-4 grid grid-cols-7 gap-4 text-center text-xxs text-lightGray">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          <PopulateDates
            daysInMonth={daysInMonth(selectedYear, selectedMonth)}
            selectedTime={new Date(formatDate(date)).getTime()}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectDate={selectDate}
          />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
