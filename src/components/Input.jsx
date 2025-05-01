const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-gray-200 font-medium mb-1.5 transition-colors duration-200"
        >
          {label} {required && <span className="text-pink-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-2.5 bg-gray-800/80 border rounded-lg focus:outline-none transition-all duration-300 
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500' 
            : 'border-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-indigo-400/50'
          }
          text-gray-100 placeholder-gray-500 backdrop-blur-sm`}
          {...props}
        />
        
        {/* Subtle spotlight effect on focus */}
        <div className="absolute inset-0 rounded-lg pointer-events-none spotlight"></div>
        
        {/* Animated border for focus state */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-focus-within:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"></div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-400 animate-fadeIn flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input; 