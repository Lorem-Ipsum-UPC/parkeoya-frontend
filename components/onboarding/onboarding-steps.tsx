import { Check } from "@/lib/icons"

interface Step {
  id: number
  title: string
  description: string
}

interface OnboardingStepsProps {
  steps: Step[]
  currentStep: number
}

export function OnboardingSteps({ steps, currentStep }: OnboardingStepsProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 relative">
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.id < currentStep
                    ? "bg-blue-600 border-blue-600 text-white"
                    : step.id === currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-background border-border text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="mt-2 text-center hidden md:block">
                <p
                  className={`text-sm font-medium ${step.id === currentStep ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-colors ${
                  step.id < currentStep ? "bg-blue-600" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
