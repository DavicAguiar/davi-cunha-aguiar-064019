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

export const FormField = React.memo<FormFieldProps>(
  ({ label, id, error, touched, used, max, children }) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[10px] font-black uppercase ml-1 tracking-widest text-[color:var(--modal-muted-2)]">
        {label}
      </label>

      {children}

      <div id={`${id}-meta`} className="flex items-center justify-between -mt-1">
        <span
          className={[
            "text-[10px] font-bold uppercase",
            touched && error ? "text-red-500" : "text-[color:var(--modal-muted-2)]",
          ].join(" ")}
        >
          {touched && error ? error : " "}
        </span>

        {typeof used === "number" && typeof max === "number" && (
          <span
            className={[
              "text-[10px] font-bold tabular-nums",
              used > max ? "text-red-500" : "text-[color:var(--modal-muted-2)]",
            ].join(" ")}
          >
            {used}/{max}
          </span>
        )}
      </div>
    </div>
  )
);

FormField.displayName = "FormField";