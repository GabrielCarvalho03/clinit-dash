interface StepsProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepsProgress = ({
  currentStep,
  onStepClick,
}: StepsProgressProps) => {
  const steps = [
    { number: 1, label: "Paciente" },
    { number: 2, label: "Tratamento" },
    { number: 3, label: "Condições" },
    { number: 4, label: "Finalização" },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-center"
            onClick={() => {
              if (step.number < currentStep) {
                onStepClick(step.number);
              }
            }}
          >
            <div
              className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  ${
                    step.number === currentStep
                      ? "bg-primary text-white"
                      : step.number < currentStep
                      ? "bg-primary/20 text-primary cursor-pointer"
                      : "bg-muted text-muted-foreground"
                  }
                `}
            >
              {step.number}
            </div>
            <div className="ml-2">
              <p
                className={`text-sm font-medium ${
                  step.number === currentStep
                    ? "text-primary"
                    : step.number < currentStep
                    ? "text-primary/80"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
            </div>
            {step.number < 4 && (
              <div
                className={`
                    h-[2px] w-12 mx-2
                    ${step.number < currentStep ? "bg-primary" : "bg-muted"}
                  `}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
