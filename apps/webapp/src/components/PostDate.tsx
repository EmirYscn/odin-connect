import { formatDate, formatTimeAgo } from '../lib/utils/formatDate';

type PostDateProps = {
  type?: 'relative' | 'full';
  date: string;
};

function PostDate({ type = 'relative', date }: PostDateProps) {
  const dateOutput =
    type === 'relative' ? formatTimeAgo(date) : formatDate(date);

  return <span>{dateOutput}</span>;
}

export default PostDate;
