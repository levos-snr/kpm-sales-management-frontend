import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from  "../api/auth";

const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'An error occurred while logging in');
    },
  });


  return { login: mutate, isLoading };
};

export default useLogin;