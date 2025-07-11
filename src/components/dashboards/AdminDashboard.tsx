import { 
  Home,
  TrendingUp,
  Users,
  FileText,
  Target,
  MessageSquare,
  Briefcase,
  Smartphone,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import { CourseDetailsModal } from '../CourseDetailsModal';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { UserManagement } from './UserManagement';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  completionRate: number;
}

interface Course {
  id: string;
  title: string;
  titleAr: string;
  instructor: string;
  instructorAr: string;
  students: number;
  completion: number;
  rating: number;
  category: string;
  categoryAr: string;
}

interface AdminDashboardProps {
  stats: AdminStats;
  courses: Course[];
  isRTL: boolean;
}

export function AdminDashboard({ stats, courses, isRTL }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const sections = [
    { id: 'overview', icon: Home, label: 'Overview', labelAr: 'نظرة عامة' },
    { id: 'user-growth', icon: TrendingUp, label: 'User Growth', labelAr: 'نمو المستخدمين' },
    { id: 'course-performance', icon: FileText, label: 'Course Performance', labelAr: 'أداء الدورات' },
    { id: 'learning-outcomes', icon: Target, label: 'Learning Outcomes', labelAr: 'نتائج التعلم' },
    { id: 'collaboration-engagement', icon: MessageSquare, label: 'Collaboration Engagement', labelAr: 'مشاركة التعاون' },
    { id: 'work-satisfaction', icon: Briefcase, label: 'Work Satisfaction', labelAr: 'رضا العمل' },
    { id: 'platform-adoption', icon: Smartphone, label: 'Platform Adoption', labelAr: 'اعتماد المنصة' },
    { id: 'ai-analytics', icon: Brain, label: 'AI Analytics Dashboard', labelAr: 'لوحة تحكم الذكاء الاصطناعي' },
    { id: 'user-management', icon: Users, label: 'User Management', labelAr: 'إدارة المستخدمين' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'ai-analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isRTL ? 'لوحة تحكم الذكاء الاصطناعي' : 'AI Analytics Dashboard'}
              </h2>
              <AIAnalyticsDashboard isRTL={isRTL} />
            </div>
          </div>
        );
      default:
        if (activeSection === 'user-management') {
          return <UserManagement />;
        }
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isRTL ? 'قريباً' : 'Coming Soon'}
            </h2>
            <p className="text-gray-600">
              {isRTL 
                ? 'هذا القسم قيد التطوير وسيكون متاحاً قريباً.'
                : 'This section is under development and will be available soon.'
              }
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">
              {isRTL ? 'لوحة الإدارة' : 'Admin Dashboard'}
            </h1>
          </div>
          <nav className="mt-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{isRTL ? section.labelAr : section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={true}
          onClose={() => setSelectedCourse(null)}
          isRTL={isRTL}
        />
      )}
    </div>
  );
}