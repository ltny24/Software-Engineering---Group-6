import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useAuth } from '../../auth';
import { useTheme } from '../../context/ThemeContext';
import { useChatbot } from '../chatbot/ChatbotContext';
import { FaStar, FaRobot, FaRotateRight } from 'react-icons/fa6';
import { ROUTES } from '../../utils/constants';
import './Layout.css';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PROFILE]: 'My Profile',
  [ROUTES.COURSES]: 'Course Catalog',
  [ROUTES.TIMETABLE]: 'Academic Timetable',
  [ROUTES.GRADES]: 'Grades & GPA',
  [ROUTES.TUITION]: 'Tuition & Fees',
  [ROUTES.APPEALS]: 'Grade Appeals',
  [ROUTES.SUPPORT]: 'Help & Support',
  [ROUTES.SUPPORT_FAQ]: 'FAQ',
  [ROUTES.SUPPORT_AI_CHATBOT]: 'AI Assistant',
  [ROUTES.ADMIN_STUDENTS]: 'Student Records',
  [ROUTES.ADMIN_IMPORT]: 'Reports',
  [ROUTES.ADMIN_TRANSFERS]: 'Class Transfers',
  [ROUTES.ADMIN_APPEALS]: 'Appeals',
};

// ============================================================
// ChatbotTopbarLeft — rendered inside topbar on chatbot page.
// Separate component so useChatbot hook is at top level.
// ============================================================
function ChatbotTopbarLeft() {
  const { clearMessages, setMessages } = useChatbot();

  const handleReset = () => {
    clearMessages();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant' as const,
        content:
          "Hello! I'm the HCMUS AI Learning Assistant. I can help you with:\n\n• Course Advising — suggest suitable courses for the next semester\n• Graduation Tracking — check your academic progress\n• Course Explanations — content, prerequisites, and applications\n• Tuition & Grades — payment information, GPA\n• Academic Policies — rules and procedures\n\nFeel free to ask me anything about studying at HCMUS!",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="topbar__chatbot-left">
      <span className="topbar__chatbot-icon">
        <FaRobot />
      </span>
      <div className="topbar__chatbot-info">
        <span className="topbar__chatbot-title">AI Academic Assistant</span>
        <span className="topbar__chatbot-status">Online — HCMUS Academic Advisor</span>
      </div>
      <button className="topbar__chatbot-reset" onClick={handleReset} title="Reset Chat">
        <FaRotateRight /> Reset Chat
      </button>
    </div>
  );
}

// ============================================================
// Layout
// ============================================================

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const subPath = location.pathname;
  const title = PAGE_TITLES[subPath] || 'Dashboard';
  const isChatbotPage = subPath === ROUTES.SUPPORT_AI_CHATBOT;

  const { mode, bgDensity, setBgDensity } = useTheme();
  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() ?? 'A';

  return (
    <div className={`layout ${isChatbotPage ? 'layout--chatbot' : ''}`}>
      <Sidebar />
      <div className="layout__main">
        <header className={`layout__topbar ${isChatbotPage ? 'layout__topbar--chatbot' : ''}`}>
          {/* Left side — title or chatbot header */}
          {isChatbotPage ? (
            <ChatbotTopbarLeft />
          ) : (
            <h1 className="layout__topbar-title">{title}</h1>
          )}

          {/* Right side — controls */}
          <div className="flex items-center gap-4 ml-auto mr-4">
            {mode === 'night' && (
              <div className="flex items-center gap-2 bg-surface-elevated/60 backdrop-blur rounded-full px-3 py-1 border border-border-card shadow-sm">
                <FaStar className="text-primary-container text-sm" />
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={bgDensity}
                  onChange={(e) => setBgDensity(Number(e.target.value))}
                  className="w-20 h-1.5 rounded-full accent-primary cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="topbar__actions">
            <Link to={ROUTES.PROFILE} className="topbar__user">
              <div className="topbar__user-avatar">{userInitial}</div>
              <div className="topbar__user-info">
                <span className="topbar__user-name">{user?.displayName}</span>
                <span className="topbar__user-role">{user?.role}</span>
              </div>
            </Link>
          </div>
        </header>
        <main
          id="main-content"
          className={`layout__content ${isChatbotPage ? 'layout__content--chatbot' : ''}`}
        >
          <div className={`layout__container ${isChatbotPage ? 'layout__container--chatbot' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
