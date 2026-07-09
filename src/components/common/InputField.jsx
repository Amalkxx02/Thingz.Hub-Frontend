import React from 'react';

export const InputField = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className = '',
}) => {

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`w-full px-5 py-4 bg-neutral-900 border-neutral-800 rounded-xl border-1 outline-none focus:border-emerald-500 text-sm`}
      />
    </div>
  );
};
