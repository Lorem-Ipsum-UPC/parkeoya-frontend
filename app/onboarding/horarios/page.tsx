'use client'

import { ScheduleStep } from '@/components/steps/schedule-step'
import { useOnboarding } from '../layout'

export default function HorariosPage() {
  const onboardingProps = useOnboarding()
  return <ScheduleStep {...onboardingProps} onBack={onboardingProps.onPrevious} />
}
