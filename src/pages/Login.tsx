import React from 'react';
import LoginForm from '../components/Login/LoginForm';
import LoginBackground from '../components/Login/LoginBackground';

const Login: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Animated Background */}
      <LoginBackground />
      
      {/* Login Form */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
