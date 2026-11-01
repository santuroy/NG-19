import { User } from '../users/models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    role: 'Admin',
    status: 'Active',
    phone: '9876543210',
    createdAt: '2026-01-10'
  },
  {
    id: 2,
    name: 'Amit Roy',
    email: 'amit@gmail.com',
    role: 'User',
    status: 'Active',
    phone: '9876543211',
    createdAt: '2026-02-15'
  },
  {
    id: 3,
    name: 'Priya Das',
    email: 'priya@gmail.com',
    role: 'Editor',
    status: 'Inactive',
    phone: '9876543212',
    createdAt: '2026-03-20'
  },
  {
    id: 4,
    name: 'Sourav Sen',
    email: 'sourav@gmail.com',
    role: 'User',
    status: 'Active',
    phone: '9876543213',
    createdAt: '2026-04-05'
  },
  {
    id: 5,
    name: 'Ananya Roy',
    email: 'ananya@gmail.com',
    role: 'Admin',
    status: 'Active',
    phone: '9876543214',
    createdAt: '2026-05-12'
  }
];