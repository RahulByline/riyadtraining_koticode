@@ .. @@
 import { CourseDetailsModal } from '../CourseDetailsModal';
 import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
+import { UserManagement } from './UserManagement';
 
 interface AdminStats {
@@ .. @@
     { id: 'collaboration-engagement', icon: MessageSquare, label: 'Collaboration Engagement', labelAr: 'مشاركة التعاون' },
     { id: 'work-satisfaction', icon: Briefcase, label: 'Work Satisfaction', labelAr: 'رضا العمل' },
     { id: 'platform-adoption', icon: Smartphone, label: 'Platform Adoption', labelAr: 'اعتماد المنصة' },
-    { id: 'ai-analytics', icon: Brain, label: 'AI Analytics Dashboard', labelAr: 'لوحة تحكم الذكاء الاصطناعي' }
+    { id: 'ai-analytics', icon: Brain, label: 'AI Analytics Dashboard', labelAr: 'لوحة تحكم الذكاء الاصطناعي' },
+    { id: 'user-management', icon: Users, label: 'User Management', labelAr: 'إدارة المستخدمين' }
   ];
 
@@ .. @@
           </div>
         );
       default:
+        if (activeSection === 'user-management') {
+          return <UserManagement />;
+        }
         return (
           <div className="bg-white rounded-xl shadow-lg p-6">
             <h2 className="text-xl font-bold text-gray-900 mb-4">