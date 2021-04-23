import React from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
//import '../styles/date-picker.css';

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  disabled = false,
  ...props
}) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      disabled={disabled}
      {...props}
    />
  );
};

export default DatePicker;
