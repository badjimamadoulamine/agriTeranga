const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-center items-center gap-8 mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors ${
            currentStep === index + 1 
              ? 'bg-green-600 text-white' 
              : currentStep > index + 1
              ? 'bg-green-600 text-white'
              : 'bg-gray-300 text-gray-600'
          }`}>
            {index + 1}
          </div>
          <p className={`text-sm font-medium ${
            currentStep === index + 1 
              ? 'text-green-600' 
              : currentStep > index + 1
              ? 'text-green-600'
              : 'text-gray-500'
          }`}>
            {step}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StepIndicator