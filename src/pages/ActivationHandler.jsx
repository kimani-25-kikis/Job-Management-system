import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ActivationHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success') === 'true';
    const role = params.get('role');
    const message = params.get('message');

    if (success && role) {
      localStorage.setItem('role', role);
      toast.success(message || 'Account activated!');
      navigate('/signin');
    } else {
      toast.error(message || 'Activation failed.');
      navigate('/signup');
    }
  }, [location, navigate]);

  return <div>Activating...</div>;
};

export default ActivationHandler;