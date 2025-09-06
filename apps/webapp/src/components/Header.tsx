import Logo from './Logo';

function Header() {
  return (
    <div className="flex items-center px-4 py-2 gap-10 bg-[var(--color-grey-0)]/20">
      <div className="flex justify-center flex-1">
        <Logo size="xs" />
      </div>
    </div>
  );
}

export default Header;
