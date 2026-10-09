import { useState } from "react";

export type Rules<T> = Partial<Record<keyof T, (value: string, all: T) => string | null>>;

/**
 * Tiny controlled-form helper for the checkout mock. Errors show once a field
 * has been left (blur) or after a submit attempt, never while typing the first time.
 */
export function useForm<T extends Record<string, string>>(initial: T, rules: Rules<T>) {
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const errorOf = (k: keyof T) => rules[k]?.(values[k], values) ?? null;

  const field = (k: keyof T) => ({
    value: values[k],
    error: touched[k] ? errorOf(k) : null,
    onChange: (v: string) => setValues((s) => ({ ...s, [k]: v })),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
  });

  /** Marks every ruled field as touched; returns the first invalid key, or null when the form is valid. */
  const validate = (): keyof T | null => {
    const keys = Object.keys(rules) as (keyof T)[];
    setTouched((t) => ({ ...t, ...Object.fromEntries(keys.map((k) => [k, true])) }));
    return keys.find((k) => errorOf(k)) ?? null;
  };

  return { values, setValues, field, validate };
}
