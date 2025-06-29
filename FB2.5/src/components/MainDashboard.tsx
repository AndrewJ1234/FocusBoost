import React from 'react';
import { motion } from 'framer-motion';
import ProductivityOverview from './dashboard/ProductivityOverview';
import LiveActivityFeed from './dashboard/LiveActivityFeed';
import CategoryBreakdown from './dashboard/CategoryBreakdown';
import GoalsProgress from './dashboard/GoalsProgress';
import WellnessWidget from './dashboard/WellnessWidget';
import AvatarCottage from './dashboard/AvatarCottage';
import StatsCard from './dashboard/StatsCard';
import CurrentFocusSession from './dashboard/CurrentFocusSession';
import FlashcardQuickAccess from './dashboard/FlashcardQuickAccess';
import TodaysSummary from './dashboard/TodaysSummary';
import UpcomingGoals from './dashboard/UpcomingGoals';
import QuickInsights from './dashboard/QuickInsights';

const MainDashboard: React.FC = () => {
  const statsData = [
    {
      title: "Productivity Score",
      value: "87%",
      change: "+12%",
      trend: "up" as const,
      icon: "📈",
      gradient: "from-emerald-500 to-emerald-600",
      subtitle: "vs. last week"
    },
    {
      title: "Deep Focus Today", 
      value: "6.2h",
      change: "+45min",
      trend: "up" as const,
      icon: "⏱️",
      gradient: "from-blue-500 to-blue-600",
      subtitle: "vs. yesterday"
    },
    {
      title: "Global Rank",
      value: "#247",
      change: "↑23",
      trend: "up" as const,
      icon: "🏆",
      gradient: "from-purple-500 to-purple-600",
      subtitle: "Top 2.5%"
    },
    {
      title: "Focus Streak",
      value: "18 days",
      change: "+1",
      trend: "up" as const,
      icon: "🔥",
      gradient: "from-orange-500 to-orange-600",
      subtitle: "Personal best!"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          
          {/* Hero Stats - Professional Achievement Display */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <StatsCard {...stat} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Current Focus Session - Redesigned for Professional Appeal */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CurrentFocusSession />
              </motion.div>
            </div>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <QuickInsights />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <FlashcardQuickAccess />
              </motion.div>
            </div>
          </section>

          {/* Quick Analytics Preview - Minimal, Professional */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <TodaysSummary />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <UpcomingGoals />
            </motion.div>
          </section>

          {/* Secondary Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <LiveActivityFeed />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <WellnessWidget />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <AvatarCottage />
            </motion.div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default MainDashboard;