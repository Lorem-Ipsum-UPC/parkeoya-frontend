'use client'

import { PricingStep } from '@/components/steps/pricing-step'
import { useOnboarding } from '../layout'

export default function TarifasPage() {
  const onboardingProps = useOnboarding()
  return <PricingStep {...onboardingProps} onBack={onboardingProps.onPrevious} />
}
