import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../api/auth';

const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || 'An error occurred while logging in';
      toast.error(errorMessage);
    },
  });

  return { login: mutate, isLoading };
};

export default useLogin;
