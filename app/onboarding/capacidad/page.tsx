'use client'

import { CapacityStep } from '@/components/steps/capacity-step'
import { useOnboarding } from '../layout'

export default function CapacidadPage() {
  const onboardingProps = useOnboarding()
  return <CapacityStep {...onboardingProps} onBack={onboardingProps.onPrevious} />
}
