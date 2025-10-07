import { Check } from '@/lib/icons'

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
          <div key={step.id} className="relative flex-1">
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  step.id < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.id === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background border-border text-muted-foreground'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="mt-2 hidden text-center md:block">
                <p
                  className={`text-sm font-medium ${step.id === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {step.title}
                </p>
                <p className="text-muted-foreground text-xs">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 -z-10 h-0.5 w-full transition-colors ${
                  step.id < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
