import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaRegUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BsPersonPlus } from 'react-icons/bs';
import { MdAddAPhoto } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const { signInWithGoogle, createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImageUrl: ''
    }
  });

  const password = watch("password");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      await createUser(data.email, data.password);
      await updateUserProfile(data.fullName, data.profileImageUrl);
      console.log("Registered with email:", data.email, "name:", data.fullName, "profile image:", data.profileImageUrl);
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setAuthError('Failed to register. This email may already be in use.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      console.log("Registered with Google");
      const user = await signInWithGoogle();
      console.log(user);
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setAuthError('Failed to register with Google.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-blue-50">
      <div className="w-full max-w-xl relative py-20">
        
        <Card className="shadow-xl border border-gray-200">
          <CardHeader
            className="h-56 w-full bg-gradient-to-br from-blue-600 to-indigo-600 m-0 grid place-items-center shadow-lg rounded-b-none text-white"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
              <BsPersonPlus className="text-blue-600 text-4xl" />
            </div>
            <Typography color="white" className="font-bold text-3xl">
              Task Master
            </Typography>
            <Typography color="white" className="opacity-80">
              Create your account
            </Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-5 px-8 pt-8">
           
            {authError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-2 border border-red-100 flex items-center">
                <span className="bg-red-100 p-1 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </span>
                {authError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-gray-500">
                    <FaRegUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    className={`w-full px-10 py-3 rounded-lg border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                    placeholder="Full Name"
                    {...register("fullName", { 
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName.message}</p>
                )}
              </div>
              
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-gray-500">
                    <HiOutlineMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    className={`w-full px-10 py-3 rounded-lg border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                    placeholder="Email address"
                    {...register("email", { 
                      required: "Email is required", 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Profile Image URL Field */}
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-gray-500">
                    <MdAddAPhoto className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    className={`w-full px-10 py-3 rounded-lg border ${errors.profileImageUrl ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                    placeholder="Profile Image URL"
                    {...register("profileImageUrl", { 
                      required: "Profile Image is required",
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: "Invalid URL format"
                      }
                    })}
                  />
                </div>
                {errors.profileImageUrl && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.profileImageUrl.message}</p>
                )}
              </div>
              
              {/* Password Field with Toggle */}
              <div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-gray-500">
                    <RiLockPasswordLine className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-10 py-3 rounded-lg border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                    placeholder="Password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                        message: "Password must include uppercase, lowercase, number and special character"
                      }
                    })}
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? 
                      <FaEyeSlash className="w-5 h-5" /> : 
                      <FaEye className="w-5 h-5" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1 ml-1">
                  Password must contain at least 6 characters, including uppercase, lowercase, number and special character.
                </p>
              </div>
              
              <div className="flex items-center mt-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  {...register("terms", { required: "You must accept terms and conditions" })}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                  I agree to the <a href="#terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs -mt-3 ml-1">{errors.terms.message}</p>
              )}
              
              <Button 
                type="submit"
                className="mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : "Create Account"}
              </Button>
            </form>
            
            <div className="flex items-center gap-2 my-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <Typography color="gray" className="text-sm font-medium">
                OR SIGN UP WITH
              </Typography>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <FcGoogle size={20} />
              <span className="text-gray-700 font-medium">Google</span>
            </Button>
          </CardBody>

          <CardFooter className="pt-0 px-8 pb-8">
            <Typography variant="small" className="mt-4 text-center font-normal text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 transition-colors hover:text-blue-800">
                Sign in
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;