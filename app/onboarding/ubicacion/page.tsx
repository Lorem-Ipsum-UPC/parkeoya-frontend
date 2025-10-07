'use client'

import { LocationStep } from '@/components/steps/location-step'
import { useOnboarding } from '../layout'

export default function UbicacionPage() {
  const onboardingProps = useOnboarding()
  return <LocationStep {...onboardingProps} onBack={onboardingProps.onPrevious} />
}
