import { FaArrowLeft } from 'react-icons/fa';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function BackButton({ navigateTo }: { navigateTo?: string }) {
  const navigate = useNavigate();

  const handleRouting = () => {
    if (navigateTo) {
      navigate(navigateTo);
    } else {
      navigate(-1); // Go back in history
    }
  };
  return <Button icon={<FaArrowLeft />} onClick={handleRouting} />;
}

export default BackButton;
