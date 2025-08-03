import { FormEvent, useState } from 'react';
import Input from '../../../components/Input';
import FormRowVertical from '../../../components/FormRowVertical';
import GoogleButton from './GoogleButton';
import GitHubButton from './GithubButton';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button';
import SpinnerMini from '../../../components/SpinnerMini';
import { useLogin } from '../../../hooks/useLogin';

function LoginForm() {
  // const { t } = useTranslation("auth");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isPending } = useLogin();
  // const { isDarkMode } = useDarkMode();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormRowVertical label={'Email'}>
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      <FormRowVertical label={'Password'}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>

      {/* <Link href="/forgotPassword">{"Forgot Password?"}</Link> */}

      <FormRowVertical>
        <GoogleButton />
        <GitHubButton />
      </FormRowVertical>

      <Link to="/signup">Don&apos;t have an account?</Link>
      <FormRowVertical>
        <Button type="submit" size="medium" variation="login">
          {!isPending ? (
            <span className="text-gray-200">{'Log In'}</span>
          ) : (
            <SpinnerMini />
          )}
        </Button>
      </FormRowVertical>
    </form>
  );
}

export default LoginForm;
