import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../components/customInput';
import CustomButton from '../components/customButton';
import CustomError from '../components/customError';
import CustomAlertInfo from '../components/customAlertInfo';
import { useGlobalContext } from '../context/context';
import userApi from '../api/userApi';

const Register = () => {
  const { error, setErrorMesage, setLoading, loading } = useGlobalContext();
  const [formFields, setFormFields] = useState({
    email: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    password: '',
    confirmPassword: '',
  });
  const [infoForUser, setInfoForUser] = useState(null);
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
    if (
      !formFields.email ||
      !formFields.password ||
      !formFields.firstName ||
      !formFields.lastName ||
      formFields.password !== formFields.confirmPassword
    ) {
      return setErrorMesage('Incorrect input value', 3000);
    }
    try {
      const userData = {
        email: formFields.email,
        firstName: formFields.firstName,
        lastName: formFields.lastName,
        password: formFields.password,
        organizationName: formFields.organizationName,
      };
      setLoading(true);
      const createdUser = await userApi.register(userData);
      if (createdUser.status === 201) {
        setInfoForUser('User created');
        setFormFields({
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          password: '',
          confirmPassword: '',
        });
        setLoading(false);
        return setTimeout(() => {
          setInfoForUser(null);
          setLoading(true);
          navigate('/login');
        }, 4000);
      }
    } catch (error) {
      setErrorMesage(error?.message || 'Server Error', 3000);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {infoForUser && (
        <CustomAlertInfo title={'Attention'} description={infoForUser}/>
      )}

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg space-y-8">
          <h2 className="text-center text-4xl font-bold text-white">
            Create New Account
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              {['email', 'firstName', 'lastName', 'organizationName'].map(
                (field, index) => (
                  <CustomInput
                    key={index}
                    type="text"
                    placeholder={field.replace(/([A-Z])/g, ' $1')}
                    value={formFields[field]}
                    disable={loading}
                    onChange={(e) => changeFormFields(e.target.value, field)}
                    className="w-full"
                  />
                )
              )}
              {['password', 'confirmPassword'].map((field, index) => (
                <CustomInput
                  key={index}
                  type="password"
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  value={formFields[field]}
                  disable={loading}
                  onChange={(e) => changeFormFields(e.target.value, field)}
                  className="w-full"
                />
              ))}
            </div>

            <CustomButton type="submit" className="w-full" disable={loading}>
              Sign Up
            </CustomButton>

            <div className="text-center text-white">
              Already have an account?{' '}
              <Link to={'/login'} className="underline hover:text-gray-300">
                Log In
              </Link>
            </div>
          </form>
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
                   animate-gradientBackground bg-[length:300%_300%] duration-[15s]">
      </div>
    </div>
  );
};

export default Register;
