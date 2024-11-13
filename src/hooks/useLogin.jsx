import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../api/auth';
import useStore from '../store';

const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setRefreshToken } = useStore();

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'An error occurred while logging in');
    },
  });

  return { login: mutate, isLoading };
};

export default useLogin;