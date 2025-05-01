import { useState } from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  onClick,
  icon,
  size = 'md',
  loading = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseDown = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  };
  
  const handleMouseUp = () => {
    if (!disabled && !loading) {
      setIsPressed(false);
    }
  };
  
  const handleMouseEnter = () => {
    if (!disabled && !loading) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (isPressed) {
      setIsPressed(false);
    }
    setIsHovered(false);
  };
  
  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden btn-modern ripple';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  };
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500',
    outline: 'border border-indigo-500 text-indigo-500 hover:bg-indigo-50 focus:ring-indigo-500',
    glass: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 focus:ring-white/50',
    gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white focus:ring-indigo-500',
    vibrant: 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white focus:ring-violet-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
  };
  
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  const pressedClasses = isPressed ? 'transform scale-95' : '';
  const loadingClasses = loading ? 'relative text-transparent' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${disabled || loading ? disabledClasses : ''} ${pressedClasses} ${loadingClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Glow effect on hover */}
      {isHovered && !disabled && !loading && (
        <span className="absolute inset-0 w-full h-full blur-md opacity-30 bg-white rounded-lg"></span>
      )}
      
      {/* Shine effect */}
      <span 
        className={`absolute top-0 left-0 w-full h-full overflow-hidden ${isHovered && !disabled && !loading ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transition: 'opacity 0.3s ease'
        }}
      >
        <span 
          className="absolute top-0 -left-3/4 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12"
          style={{
            animation: isHovered && !disabled && !loading ? 'shine 1.5s infinite' : 'none'
          }}
        ></span>
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {icon && <span className={`mr-2 ${loading ? 'opacity-0' : ''}`}>{icon}</span>}
      {children}
      
      <style jsx>{`
        @keyframes shine {
          0% { left: -75%; }
          100% { left: 150%; }
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
      `}</style>
    </button>
  );
};

export default Button; 