import { useForm } from 'react-hook-form';
import { SignupDataType } from '../../../lib/api/auth';
import useSignup from '../../../hooks/useSignup';
import FormRowVertical from '../../../components/FormRowVertical';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SpinnerMini from '../../../components/SpinnerMini';

function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<SignupDataType & { passwordConfirm: string }>();
  const { signup, isPending } = useSignup();

  function onSubmit({ email, username, password }: SignupDataType) {
    signup(
      { email, username, password },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label={'Email'} formError={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="email"
          disabled={isPending}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please provide a valid email address',
            },
          })}
        />
      </FormRowVertical>
      <FormRowVertical label={'Username'} formError={errors?.username?.message}>
        <Input
          type="username"
          id="username"
          // This makes this form better for password managers
          autoComplete="username"
          disabled={isPending}
          {...register('username', { required: 'This field is required' })}
        />
      </FormRowVertical>

      <FormRowVertical label={'Password'} formError={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isPending}
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRowVertical>
      <FormRowVertical
        label={'Confirm Password'}
        formError={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) =>
              value === getValues().password || 'Passwords need to match',
          })}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button type="submit" size="medium" variation="login">
          {isPending ? 'Sign up' : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </form>
  );
}

export default SignupForm;
