import { Link } from 'react-router-dom';

type LogoProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
};

function Logo({ size = 'lg' }: LogoProps) {
  const logo = {
    xs: '/logo-sm.svg',
    sm: '/logo-sm.svg',
    md: '/logo-md.svg',
    lg: '/logo-lg.svg',
  };

  const widthValues = {
    xs: 48, // 48px
    sm: 80, // 80px
    md: 112, // 112px
    lg: 192, // 152px
  };

  let src = logo[size] || logo.lg;
  const width = widthValues[size] || widthValues.lg;
  const height = width;
  src = '/logo2.svg';

  return (
    <div className="flex justify-center">
      <Link to="/">
        <img src={src} alt="Logo" width={width} height={height} />
      </Link>
    </div>
  );
}

export default Logo;
