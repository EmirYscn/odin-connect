import Logo from '../../components/Logo';
import LoginForm from './components/LoginForm';

export const metadata = { title: 'Log In' };

function Login() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left solid color background */}
      <div className="hidden md:block w-1/3 bg-[var(--color-blue-300)]/40 backdrop-blur-md" />
      {/* Gradient blend divider */}
      <div className="hidden md:block w-4 bg-gradient-to-r from-[var(--color-blue-300)]/40 backdrop-blur-md to-[var(--color-grey-50)]/20" />
      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center bg-[var(--color-grey-50)]/20 backdrop-blur-md text-[var(--color-grey-700)]">
        <div className="flex flex-col gap-8 w-[25rem] sm:w-[30rem] lg:w-[40rem]">
          <Logo size="lg" />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
