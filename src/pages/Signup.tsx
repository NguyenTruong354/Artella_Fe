import React from 'react';
import SignupForm from '../components/Login/SignupForm';
import LoginBackground from '../components/Login/LoginBackground';

const Signup: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Animated Background */}
      <LoginBackground />
      
      {/* Signup Form */}
      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
