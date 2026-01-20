import React, { type InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full px-4 py-3 
          bg-white border border-slate-300 rounded-lg 
          text-slate-700 placeholder-slate-400
          focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-emerald-50/30
          outline-none transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};