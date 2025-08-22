type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  variation?:
    | 'icon'
    | 'login'
    | 'logout'
    | 'post'
    | 'text'
    | 'editProfile'
    | 'save'
    | 'loadMore'
    | 'follow';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  iconEnd?: boolean;
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  small: 'text-sm px-2 py-1 font-semibold uppercase text-center',
  medium: 'text-md px-4 py-3 font-medium',
  large: 'text-2xl px-6 py-3 font-medium',
};

const variationClasses: Record<
  NonNullable<ButtonProps['variation']>,
  string
> = {
  icon: 'p-4 focus:outline-none',
  login:
    'rounded-md bg-[var(--color-brand-100)] text-white hover:text-brand-600',
  logout: 'rounded-md hover:text-brand-600',
  post: '!rounded-full bg-[var(--color-brand-100)]/80  text-white',
  text: 'bg-transparent !p-0 hover:underline !text-[var(--color-grey-800)]/50',
  editProfile:
    'bg-[var(--color-brand-100)] text-white hover:bg-[var(--color-brand-100)]/80 !rounded-full text-sm',
  save: '!bg-[var(--color-grey-800)] !text-[var(--color-grey-50)] !hover:bg-[var(--color-grey-100)] !rounded-full !text-sm !px-5 !py-2',
  loadMore:
    'bg-[var(--color-brand-100)]/80 text-white hover:bg-[var(--color-brand-100)]/80 !rounded-full !text-sm !px-5 !py-2 flex items-center justify-center',
  follow:
    'bg-[var(--color-brand-100)] text-white hover:bg-[var(--color-brand-100)]/80 !rounded-full !text-sm px-6',
};

function Button({
  type = 'button',
  size = 'medium',
  variation = 'icon',
  icon,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  className,
  iconEnd = false,
}: ButtonProps) {
  const baseClasses = `flex items-center gap-2 rounded-sm text-[var(--color-grey-800)] ${
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variationClasses[variation]} ${className}`}
    >
      {!iconEnd && icon}
      {children}
      {iconEnd && icon}
    </button>
  );
}

export default Button;
