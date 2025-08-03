import { Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';

import { IoArrowBack } from 'react-icons/io5';
import Logo from '../../components/Logo';

export const metadata = { title: 'Sign Up' };

function Signup() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left solid color background */}
      <div className="hidden md:block w-1/3 bg-[var(--color-blue-300)]/40 backdrop-blur-md" />
      {/* Gradient blend divider */}
      <div className="hidden md:block w-4 bg-gradient-to-r from-[var(--color-blue-300)]/40 backdrop-blur-md to-[var(--color-grey-50)]/20" />
      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center bg-[var(--color-grey-50)]/20 backdrop-blur-md text-[var(--color-grey-700)]">
        <div className="flex flex-col gap-8 w-[25rem] sm:w-[30rem] lg:w-[40rem]">
          <Link
            to="/login"
            className="text-2xl text-[var(--color-grey-800)] hover:text-[var(--color-brand-100)] transition-colors"
          >
            <IoArrowBack />
          </Link>
          <Logo size="lg" />
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default Signup;
