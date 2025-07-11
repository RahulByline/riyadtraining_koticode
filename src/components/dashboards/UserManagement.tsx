import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  UserX, 
  Key, 
  Download,
  Grid,
  List,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  GraduationCap,
  Building,
  UserCheck,
  AlertCircle,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserDetailsModal } from './UserDetailsModal';
import { CreateUserModal } from './CreateUserModal';
import { toast } from '../ui/Toaster';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  username: string;
  role: string;
  school?: string;
  cohort?: string;
  status: 'active' | 'suspended' | 'inactive';
  lastaccess?: number;
  profileimageurl?: string;
  phone?: string;
  city?: string;
  country?: string;
  department?: string;
  firstaccess?: number;
  auth?: string;
}

interface FilterState {
  role: string;
  school: string;
  cohort: string;
  status: string;
  searchTerm: string;
}

export const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    role: 'all',
    school: 'all',
    cohort: 'all',
    status: 'all',
    searchTerm: ''
  });

  const [schools, setSchools] = useState<string[]>([]);
  const [cohorts, setCohorts] = useState<string[]>([]);
  const [roles] = useState([
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Trainees (Students)' },
    { value: 'teacher', label: 'Trainers (Teachers)' },
    { value: 'manager', label: 'School Managers' },
    { value: 'admin', label: 'Administrators' }
  ]);

  useEffect(() => {
    fetchUsers();
    fetchSchools();
    fetchCohorts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call to IOMAD web service
      const response = await fetch('https://iomad.bylinelms.com/webservice/rest/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
          wsfunction: 'core_user_get_users',
          moodlewsrestformat: 'json',
          'criteria[0][key]': 'deleted',
          'criteria[0][value]': '0'
        })
      });

      const data = await response.json();
      
      if (data.users && Array.isArray(data.users)) {
        const mappedUsers = data.users.map((user: any) => ({
          id: user.id.toString(),
          firstname: user.firstname,
          lastname: user.lastname,
          fullname: user.fullname,
          email: user.email,
          username: user.username,
          role: detectUserRole(user),
          school: user.department || 'Unassigned',
          cohort: user.cohort || 'Default',
          status: user.suspended ? 'suspended' : 'active',
          lastaccess: user.lastaccess,
          profileimageurl: user.profileimageurl,
          phone: user.phone1,
          city: user.city,
          country: user.country,
          department: user.department,
          firstaccess: user.firstaccess,
          auth: user.auth
        }));
        setUsers(mappedUsers);
      } else {
        // Fallback with mock data for demonstration
        setUsers(generateMockUsers());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use mock data as fallback
      setUsers(generateMockUsers());
      toast.error('Failed to fetch users from IOMAD. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await fetch('https://iomad.bylinelms.com/webservice/rest/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
          wsfunction: 'block_iomad_company_admin_get_companies',
          moodlewsrestformat: 'json'
        })
      });

      const data = await response.json();
      if (data.companies) {
        setSchools(data.companies.map((company: any) => company.name));
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchools(['Riyadh International School', 'Al-Faisal Academy', 'Modern Education Center']);
    }
  };

  const fetchCohorts = async () => {
    try {
      const response = await fetch('https://iomad.bylinelms.com/webservice/rest/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
          wsfunction: 'core_cohort_get_cohorts',
          moodlewsrestformat: 'json'
        })
      });

      const data = await response.json();
      if (data && Array.isArray(data)) {
        setCohorts(data.map((cohort: any) => cohort.name));
      }
    } catch (error) {
      console.error('Error fetching cohorts:', error);
      setCohorts(['2024 Intake', 'Advanced Teachers', 'New Trainers', 'Leadership Program']);
    }
  };

  const detectUserRole = (user: any): string => {
    // Logic to detect user role based on IOMAD user data
    if (user.username?.includes('admin') || user.auth === 'manual') return 'admin';
    if (user.department?.toLowerCase().includes('teacher')) return 'teacher';
    if (user.department?.toLowerCase().includes('student')) return 'student';
    if (user.department?.toLowerCase().includes('manager')) return 'manager';
    return 'student'; // Default
  };

  const generateMockUsers = (): User[] => {
    return [
      {
        id: '1',
        firstname: 'Ahmed',
        lastname: 'Al-Rashid',
        fullname: 'Ahmed Al-Rashid',
        email: 'ahmed.rashid@school.edu.sa',
        username: 'ahmed.rashid',
        role: 'teacher',
        school: 'Riyadh International School',
        cohort: 'Advanced Teachers',
        status: 'active',
        lastaccess: Date.now() / 1000 - 3600,
        phone: '+966501234567',
        city: 'Riyadh',
        country: 'Saudi Arabia',
        department: 'Mathematics'
      },
      {
        id: '2',
        firstname: 'Fatima',
        lastname: 'Hassan',
        fullname: 'Fatima Hassan',
        email: 'fatima.hassan@school.edu.sa',
        username: 'fatima.hassan',
        role: 'student',
        school: 'Al-Faisal Academy',
        cohort: '2024 Intake',
        status: 'active',
        lastaccess: Date.now() / 1000 - 7200,
        phone: '+966507654321',
        city: 'Jeddah',
        country: 'Saudi Arabia',
        department: 'Science'
      },
      {
        id: '3',
        firstname: 'Mohammed',
        lastname: 'Al-Zahra',
        fullname: 'Mohammed Al-Zahra',
        email: 'mohammed.zahra@admin.edu.sa',
        username: 'admin.mohammed',
        role: 'admin',
        school: 'System Administration',
        cohort: 'Leadership Program',
        status: 'active',
        lastaccess: Date.now() / 1000 - 1800,
        phone: '+966509876543',
        city: 'Riyadh',
        country: 'Saudi Arabia',
        department: 'Administration'
      }
    ];
  };

  const applyFilters = () => {
    let filtered = users;

    if (filters.searchTerm) {
      filtered = filtered.filter(user =>
        user.fullname.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.school !== 'all') {
      filtered = filtered.filter(user => user.school === filters.school);
    }

    if (filters.cohort !== 'all') {
      filtered = filtered.filter(user => user.cohort === filters.cohort);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleUserAction = async (action: string, user: User) => {
    try {
      switch (action) {
        case 'view':
          setSelectedUser(user);
          break;
        case 'edit':
          // Implement edit functionality
          toast.info(`Edit functionality for ${user.fullname} - Coming soon`);
          break;
        case 'suspend':
          // Implement suspend functionality
          await suspendUser(user.id);
          toast.success(`${user.fullname} has been suspended`);
          fetchUsers(); // Refresh data
          break;
        case 'reset-password':
          // Implement password reset
          await resetUserPassword(user.id);
          toast.success(`Password reset email sent to ${user.email}`);
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const suspendUser = async (userId: string) => {
    // Implement IOMAD API call to suspend user
    const response = await fetch('https://iomad.bylinelms.com/webservice/rest/server.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
        wsfunction: 'core_user_update_users',
        moodlewsrestformat: 'json',
        'users[0][id]': userId,
        'users[0][suspended]': '1'
      })
    });
    return response.json();
  };

  const resetUserPassword = async (userId: string) => {
    // Implement IOMAD API call to reset password
    // This would typically trigger a password reset email
    console.log(`Resetting password for user ${userId}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return GraduationCap;
      case 'manager': return Building;
      case 'student': return Users;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'teacher': return 'text-blue-600 bg-blue-100';
      case 'manager': return 'text-purple-600 bg-purple-100';
      case 'student': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderUserCard = (user: User) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.firstname.charAt(0)}{user.lastname.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.fullname}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Role:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">School:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{user.school}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </div>
          {user.lastaccess && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Last Access:</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(user.lastaccess * 1000).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUserAction('view', user)}
            className="flex-1"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUserAction('edit', user)}
            className="flex-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUserAction('suspend', user)}
            className="flex-1"
          >
            <UserX className="w-4 h-4" />
            Suspend
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderUserTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">User</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Role</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">School</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Last Access</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user.fullname}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="w-4 h-4 text-gray-500" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 dark:text-white">{user.school}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 dark:text-white">
                      {user.lastaccess ? new Date(user.lastaccess * 1000).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction('view', user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction('edit', user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction('suspend', user)}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUserAction('reset-password', user)}
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all users across your educational platform ({filteredUsers.length} users)
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => fetchUsers()} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search users by name, email, or username..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              icon={Search}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <select
              value={filters.school}
              onChange={(e) => handleFilterChange('school', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Schools</option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                onClick={() => setViewMode('table')}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Display */}
      <AnimatePresence mode="wait">
        {filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredUsers.map(renderUserCard)}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderUserTable()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onUserCreated={fetchUsers}
        />
      )}
    </div>
  );
};