'use client'

import { BasicInfoStep } from '@/components/steps/basic-info-step'
import { useOnboarding } from '../layout'

export default function InformacionBasicaPage() {
  const onboardingProps = useOnboarding()
  return <BasicInfoStep {...onboardingProps} />
}
