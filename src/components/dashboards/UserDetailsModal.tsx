import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  Shield,
  Clock,
  Edit,
  Key,
  UserX
} from 'lucide-react';
import { Button } from '../ui/Button';

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

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.fullname}</h2>
                    <p className="text-blue-100">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Username</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Email</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Phone</div>
                          <div className="font-medium text-gray-900 dark:text-white">{user.phone}</div>
                        </div>
                      </div>
                    )}

                    {(user.city || user.country) && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Location</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {[user.city, user.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role & Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Role & Status
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Role</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">School</div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.school}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Status</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {user.department && (
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Department</div>
                          <div className="font-medium text-gray-900 dark:text-white">{user.department}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Information */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Activity Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.firstaccess && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">First Access</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(user.firstaccess * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {user.lastaccess && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Last Access</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(user.lastaccess * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4" />
                  Edit User
                </Button>
                <Button variant="outline">
                  <Key className="w-4 h-4" />
                  Reset Password
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                  <UserX className="w-4 h-4" />
                  Suspend User
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};