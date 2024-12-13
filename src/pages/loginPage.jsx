import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomInput from '../components/customInput';
import CustomButton from '../components/customButton';
import userApi from '../api/userApi';
import organizationApi from '../api/organizationApi';
import { useGlobalContext } from '../context/context';
import CustomError from '../components/customError';
import api from '../api';

const Login = () => {
  const { loading, setLoading, setErrorMesage, error, setUser, setTokens } =
    useGlobalContext();
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const changeFormFields = (value, fieldName) => {
    setFormFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formFields.email || !formFields.password) {
      return setErrorMesage('Incorrect input value', 3000);
    }
    try {
      setLoading(true);

      const loggedUser = await userApi.login(formFields.email, formFields.password);

      setTokens(loggedUser?.data?.tokens);
      const { accessToken } = loggedUser?.data?.tokens;
      const userOrganization = await organizationApi.getUserOrganization(accessToken);

      setUser({
        user: loggedUser.data.user,
        organizationId: userOrganization.data.data[0].organization.id,
      });

      setLoading(false);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      navigate('/');
    } catch (error) {
      setLoading(false);

      setErrorMesage(error.message, 3000);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg space-y-8">
          <h2 className="text-center text-4xl font-bold text-white">
            Sign in to your account
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <CustomInput
                type="email"
                placeholder="Email address"
                value={formFields.email}
                onChange={(e) => changeFormFields(e.target.value, 'email')}
                className="w-full"
              />
              <CustomInput
                type="password"
                placeholder="Password"
                value={formFields.password}
                onChange={(e) => changeFormFields(e.target.value, 'password')}
                className="w-full"
              />
            </div>

            <CustomButton type="submit" className="w-full" disable={loading}>
              Sign in
            </CustomButton>
          </form>

          <div className="text-center text-white">
            Don’t have an account yet?{' '}
            <Link to={'/register'} className="underline hover:text-gray-300">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-5xl font-semibold text-white">SWARM SIGN</h1>
      </div>

      {error && <CustomError/>}

      <style jsx>{`
          @keyframes gradientBackground {
              0% {
                  background-position: 0% 50%;
              }
              50% {
                  background-position: 100% 50%;
              }
              100% {
                  background-position: 0% 50%;
              }
          }
      `}</style>

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   animate-gradientBackground bg-[length:300%_300%] duration-[15s]"
      ></div>
    </div>
  );
};

export default Login;
