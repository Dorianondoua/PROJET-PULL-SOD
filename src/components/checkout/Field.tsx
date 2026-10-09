import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";

type Base = {
  id: string;
  label: string;
  value: string;
  error?: string | null;
  onChange: (v: string) => void;
  onBlur?: () => void;
  optional?: boolean;
  /** Right-aligned extra inside the input (e.g. the detected card brand). */
  adornment?: ReactNode;
};

type TextProps = Base & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "onBlur">;

/* Label above, error below, both wired to the input for screen readers. */
export function TextField({ id, label, value, error, onChange, onBlur, optional, adornment, className = "", ...input }: TextProps) {
  const errId = `${id}-error`;
  return (
    <div className={`jm-field ${className}`} data-invalid={Boolean(error)}>
      <label htmlFor={id} className="jm-field__label">
        {label}
        {optional && <span className="jm-field__opt"> (optional)</span>}
      </label>
      <div className="jm-field__box">
        <input
          id={id}
          className="jm-field__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : undefined}
          {...input}
        />
        {adornment && <span className="jm-field__adorn">{adornment}</span>}
      </div>
      {error && (
        <p className="jm-field__error" id={errId}>
          {error}
        </p>
      )}
    </div>
  );
}

type SelectProps = Base & { options: string[]; autoComplete?: string; className?: string };

export function SelectField({ id, label, value, onChange, onBlur, options, autoComplete, className = "" }: SelectProps) {
  return (
    <div className={`jm-field ${className}`}>
      <label htmlFor={id} className="jm-field__label">
        {label}
      </label>
      <div className="jm-field__box">
        <select id={id} className="jm-field__input" value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} autoComplete={autoComplete}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="jm-field__chevron" size={14} strokeWidth={1.5} aria-hidden="true" />
      </div>
    </div>
  );
}
