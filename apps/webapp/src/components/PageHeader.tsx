import BackButton from './BackButton';

function PageHeader({
  text,
  backTo = '/home',
}: {
  text: string | undefined | null;
  backTo?: string;
}) {
  return (
    <div className="flex items-center gap-2 py-4 sticky top-0 z-10 backdrop-blur-md bg-[var(--color-brand-100)]/40 text-[var(--color-grey-600)] shadow-2xl">
      <BackButton navigateTo={backTo} />
      {text && <span className="text-xl font-semibold">{text}</span>}
    </div>
  );
}

export default PageHeader;
