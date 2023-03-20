import React, {useCallback, useState} from 'react';
import Image from 'next/image';

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

/* ToDo: (20230320 - Julian) props type */
const PopulateDates = (props: any) => {
  return props.daysInMonth.map((el: any) => {
    const date = el
      ? new Date(`${props.selectedYear}-${props.selectedMonth + 1}-${el.date}`)
      : null;

    const isSelected = date?.getTime() ? date.getTime() === props.selectedTime : false;
    return (
      <div
        className={`date-picker__day${
          // el?.date === props.selectedDate ? " selected" : ""
          isSelected ? ' selected' : ''
        }${el?.disable ? ' disabled' : ''}`}
        onClick={() => {
          if (el?.date && !el?.disable) props.selectDate(el);
        }}
      >{`${el?.date !== undefined ? el.date : ' '}`}</div>
    );
  });
};

const DatePicker = (props: any) => {
  const [selectedMonth, setSelectedMonth] = useState(props.date.getMonth()); // 0 (January) to 11 (December).
  const [selectedYear, setSelectedYear] = useState(props.date.getFullYear());
  const [openDates, setOpenDates] = useState(false);

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = (year: number, month: number) => {
    const minDate = props.minDate,
      maxDate = props.maxDate;
    const day = firstDayOfMonth(year, month);
    const dateLength = new Date(year, month + 1, 0).getDate();
    let dates = [];
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

  const formatDate = (obj: any) => {
    let day = obj.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let month = obj.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const year = obj.getFullYear();
    return year + '/' + month + '/' + day;
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
    (el: any) => {
      let newDate = new Date(el.time);
      newDate = new Date(
        `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()} 08:00:00`
      );
      //props.setDate(newDate);
      setOpenDates(false);
      // }
    },
    [props]
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
        <div className="mr-2 text-sm text-lightGray4">{formatDate(props.date)}</div>
        <Image src="/elements/date_icon.svg" alt="" width={20} height={20} />
      </button>

      <div
        className={`absolute top-10 h-auto w-320px flex-col bg-darkGray2 p-6 ${
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

        <div className="my-4 grid grid-cols-7 gap-4 text-xxs text-lightGray">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* ToDo: (20230320 - Julian) 補零 */}
        <div className="grid grid-cols-7 gap-4">
          <PopulateDates
            daysInMonth={daysInMonth(selectedYear, selectedMonth)}
            selectedTime={new Date(formatDate(props.date)).getTime()}
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
