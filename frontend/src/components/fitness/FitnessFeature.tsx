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
  const [stats, setStats]         = useState<UserStats | null>(() => getUserStats())
  const [editingStats, setEditingStats] = useState(false)

  const handleStatsComplete = (newStats: UserStats) => {
    setStats(newStats)
    setEditingStats(false)
  }

  if (!stats || editingStats) {
    return <OnboardingModal onComplete={handleStatsComplete} existingStats={stats} />
  }

  return (
    <div className="flex flex-col h-full">
      {activeTab === 'today'    && <TodayTab stats={stats} onEditStats={() => setEditingStats(true)} />}
      {activeTab === 'activity' && <ActivityTab />}
      {activeTab === 'progress' && <ProgressTab stats={stats} onEditStats={() => setEditingStats(true)} />}
    </div>
  )
}
