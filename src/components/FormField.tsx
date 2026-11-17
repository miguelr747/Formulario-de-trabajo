import React from 'react';
import { Bookmark, Check } from 'lucide-react';

interface FieldWrapperProps {
  id: string;
  label: string;
  hint?: string;
  fieldKey?: string;
  isFlagged?: boolean;
  onToggleFlag?: (key: string) => void;
  children: React.ReactNode;
}

export function FieldWrapper({
  id,
  label,
  hint,
  fieldKey,
  isFlagged,
  onToggleFlag,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-800 leading-snug">
          {label}
        </label>
        {fieldKey && onToggleFlag && (
          <button
            type="button"
            onClick={() => onToggleFlag(fieldKey)}
            title={isFlagged ? 'Quitar marca de seguimiento' : 'Marcar para validar luego'}
            className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap shrink-0 py-0.5 px-1.5 rounded transition-colors cursor-pointer ${
              isFlagged
                ? 'text-amber-800 bg-amber-50 border border-amber-200'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span>{isFlagged ? 'Pendiente' : 'Marcar'}</span>
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500 leading-relaxed">{hint}</p>}
      <div>{children}</div>
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export function TextInput({ className = '', ...props }: TextInputProps) {
  return (
    <input
      {...props}
      className={`w-full min-h-[40px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors ${className}`}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
}

export function TextArea({ className = '', rows = 3, ...props }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors leading-relaxed ${className}`}
    />
  );
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
}

export function SelectInput({ className = '', children, ...props }: SelectInputProps) {
  return (
    <select
      {...props}
      className={`w-full min-h-[40px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors ${className}`}
    >
      {children}
    </select>
  );
}

interface CheckboxOptionGridProps {
  options: string[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
}

export function CheckboxOptionGrid({
  options,
  selected,
  onChange,
}: CheckboxOptionGridProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            aria-pressed={checked}
            className={`min-h-[42px] px-3 py-2 text-left text-sm rounded-md border flex items-center gap-2.5 transition-colors cursor-pointer ${
              checked
                ? 'bg-blue-50/70 border-blue-600 text-slate-900 font-medium'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                checked
                  ? 'bg-blue-700 border-blue-700 text-white'
                  : 'bg-white border-slate-300'
              }`}
            >
              {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
            </span>
            <span className="leading-snug">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
