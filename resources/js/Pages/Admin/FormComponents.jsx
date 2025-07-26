export function Input({ label, name, value, onChange, error, type = "text", ...props }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`form-input mt-1 block w-full rounded-md border px-3 py-2
          dark:bg-zinc-700 dark:text-white dark:border-zinc-600
          ${error ? "border-red-500" : "border-gray-300"}
          focus:border-blue-500 focus:ring focus:ring-blue-200`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, name, value, onChange, error, rows = 3 }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`form-textarea mt-1 block w-full rounded-md border px-3 py-2
          dark:bg-zinc-700 dark:text-white dark:border-zinc-600
          ${error ? "border-red-500" : "border-gray-300"}
          focus:border-blue-500 focus:ring focus:ring-blue-200`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
