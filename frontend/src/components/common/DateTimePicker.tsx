import React from 'react';
import DatePicker from 'react-datepicker';

interface DateTimePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  required?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange, minDate, required }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="yyyy-MM-dd HH:mm"
        minDate={minDate}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        placeholderText="Selecione data e hora"
        required={required}
      />
    </div>
  );
};

export default DateTimePicker;
