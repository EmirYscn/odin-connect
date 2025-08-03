function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="focus:outline-none bg-[var(--color-grey-0)]/30 rounded-sm px-4 py-2 shadow-sm"
      {...props}
    />
  );
}

export default Input;
