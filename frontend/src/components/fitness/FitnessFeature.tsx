import { useState } from 'react'
import type { FitnessTab, UserStats } from '../../types/fitness'
import { getUserStats } from '../../lib/fitnessStorage'
import OnboardingModal from './today/OnboardingModal'
import TodayTab from './today/TodayTab'
import ActivityTab from './activity/ActivityTab'
import ProgressTab from './progress/ProgressTab'

interface Props {
  activeTab: FitnessTab
}

export default function FitnessFeature({ activeTab }: Props) {
  const [stats, setStats] = useState<UserStats | null>(() => getUserStats())

  if (!stats) {
    return <OnboardingModal onComplete={setStats} />
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab === 'today'    && <TodayTab stats={stats} onEditStats={() => setStats(null)} />}
      {activeTab === 'activity' && <ActivityTab />}
      {activeTab === 'progress' && <ProgressTab stats={stats} />}
    </div>
  )
}
