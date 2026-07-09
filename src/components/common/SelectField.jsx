import React from 'react';

export const SelectField = ({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
}) => {

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-5 py-4 bg-neutral-900 border-neutral-800 rounded-xl border-1 outline-none focus:border-emerald-500 text-sm appearance-none cursor-pointer`}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option, index) => {
          const isString = typeof option === 'string';
          const optValue = isString ? option : option.value;
          const optLabel = isString ? option : option.label;
          return (
            <option key={index} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};
