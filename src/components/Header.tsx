import React from 'react';
import { KartavyaLogo } from './KartavyaLogo';
import { USER_PROFILE } from '../data/civicData';

export type ActiveTab = 'home' | 'explore' | 'detail' | 'volunteer' | 'insights' | 'organizations' | 'dashboard' | 'login';

interface HeaderProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onOpenReportModal: () => void;
  currentUser?: { name: string; email: string; ledgerId: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenReportModal,
  currentUser,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Issues' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'insights', label: 'AI Insights' },
    { id: 'organizations', label: 'Organizations' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'login', label: currentUser ? 'My Account' : 'Sign In' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#047857]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Lockup */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left shrink-0 cursor-pointer focus:outline-hidden"
          >
            <KartavyaLogo size={38} showText={true} />
          </button>

          {/* Navigation items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive =
                activeTab === item.id || (item.id === 'explore' && activeTab === 'detail');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#047857] text-white shadow-xs'
                      : 'text-[#047857] hover:bg-[#047857]/8'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action and User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Report Civic Issue</span>
            </button>

            <button
              onClick={() => onNavigate('login')}
              title={currentUser ? `Logged in as ${currentUser.name} (${currentUser.email})` : 'Sign In to Citizen Portal'}
              className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#047857] cursor-pointer hover:ring-2 hover:ring-[#F97316] transition-all flex items-center justify-center bg-emerald-50"
            >
              <img
                src={USER_PROFILE.avatar}
                alt={currentUser?.name || USER_PROFILE.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-start gap-1 py-2 overflow-x-auto border-t border-[#047857]/10">
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id || (item.id === 'explore' && activeTab === 'detail');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-[#047857] text-white'
                    : 'text-[#047857] hover:bg-[#047857]/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
export default Header;
