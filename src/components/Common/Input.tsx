

interface InputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  prefix?: string;
}

export function Input({ id, label, value, onChange, type = 'text', placeholder, prefix }: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-raf-blue focus:border-transparent ${prefix ? 'pl-8' : ''}`}
          aria-label={label}
        />
      </div>
    </div>
  );
}
