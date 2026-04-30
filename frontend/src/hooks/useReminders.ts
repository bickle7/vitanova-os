import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { getLongTermTasks, updateLongTermTask } from '../lib/todoStorage'

export function useReminders() {
  useEffect(() => {
    const check = () => {
      const now = new Date()
      const tasks = getLongTermTasks()
      tasks.forEach(task => {
        if (!task.reminderAt || task.completed) return
        const reminderDate = new Date(task.reminderAt)
        if (reminderDate <= now) {
          // Fire notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('VitaNovaOS Reminder', {
              body: task.title,
              icon: '/favicon.ico',
            })
          } else {
            toast(`⏰ Reminder: ${task.title}`, {
              duration: 8000,
              style: { background: '#151520', color: '#f2f0ea', border: '1px solid #d4a843' },
            })
          }
          // Clear the reminder so it doesn't fire again
          updateLongTermTask(task.id, { reminderAt: undefined })
          window.dispatchEvent(new CustomEvent('vitanova:longtermtasks:changed'))
        }
      })
    }

    check() // Check immediately on mount
    const interval = setInterval(check, 60_000) // Then every minute
    return () => clearInterval(interval)
  }, [])
}
