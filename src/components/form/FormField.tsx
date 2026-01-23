import React from "react";

type FormFieldProps = {
  label: string;
  id: string;
  error?: string;
  touched?: boolean;
  used?: number;
  max?: number;
  children: React.ReactNode;
};

export const FormField = React.memo<FormFieldProps>(({ label, id, error, touched, used, max, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">
      {label}
    </label>

    {children}

    <div id={`${id}-meta`} className="flex items-center justify-between -mt-1">
      <span className={`text-[10px] font-bold uppercase ${touched && error ? "text-red-500" : "text-slate-400"}`}>
        {touched && error ? error : " "}
      </span>

      {typeof used === "number" && typeof max === "number" && (
        <span className={`text-[10px] font-bold tabular-nums ${used > max ? "text-red-500" : "text-slate-400"}`}>
          {used}/{max}
        </span>
      )}
    </div>
  </div>
));
FormField.displayName = "FormField";
