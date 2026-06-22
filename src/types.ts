/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = "SuperAdmin",
  ADMINISTRATOR = "Administrator",
  MANAGER = "Manager",
  CASHIER = "Cashier",
  EMPLOYEE = "Employee"
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  subscriptionPlan?: 'Free' | 'Business' | 'Premium';
  status?: 'Active' | 'Suspended';
  billingStatus?: 'Paid' | 'Unpaid' | 'Trial';
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  lastActive?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stockQuantity: number;
  minStockAlert: number;
  costPrice: number;
  salePrice: number;
  companyId: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  isVip: boolean;
  companyId: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  baseSalary: number;
  rankingScore: number;
  companyId: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  customerId: string | null;
  employeeId: string; // Cashier id who processed it
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  paymentMethod: 'Cash' | 'Card' | 'Mobile';
  companyId: string;
  createdAt: string;
  date: string; // YYYY-MM-DD
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
  profit: number;
  companyId: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  companyId: string;
  createdAt: string;
}

// Session formats
export interface AuthUserSession {
  userId: string;
  username: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
}

export interface DashboardSummary {
  revenue: number;
  cost: number;
  profit: number;
  expenses: number;
  netProfit: number;
  lowStockCount: number;
  recentSales: (Sale & { customerName?: string; employeeName?: string })[];
  recentLogs: AuditLog[];
}

export interface SupportTicket {
  id: string;
  companyId: string;
  companyName: string;
  username: string;
  subject: string;
  description: string;
  category: 'Bug' | 'Feature Request' | 'Billing' | 'General';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  replies: { sender: string; text: string; createdAt: string }[];
}

export interface SystemHealthStatus {
  server: string; // 'Online' | 'Offline'
  database: string; // 'Connected' | 'Degraded'
  storageUsage: string; // '45 KB' or MB
  cpuLoad: number; // percentage
  memoryUsage: number; // percentage or MB
  errorRate: number; // percentage
  uptime: string;
  apiPerformance: { endpoint: string; responseTime: number; hits: number }[];
}

export interface PlatformAuditLog {
  id: string;
  action: string;
  details: string;
  adminEmail: string;
  createdAt: string;
}

export interface SuperAdminCompanyData {
  id: string;
  name: string;
  createdAt: string;
  subscriptionPlan: 'Free' | 'Business' | 'Premium';
  status: 'Active' | 'Suspended';
  billingStatus: 'Paid' | 'Unpaid' | 'Trial';
  usersCount: number;
  productsCount: number;
  salesCount: number;
  lastActivityDate: string;
  ownerName: string;
  ownerEmail: string;
}

export interface SuperAdminStats {
  totalCompanies: number;
  activeCompanies: number;
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  monthlyRecurringRevenue: number;
  newRegistrationsThisMonth: number;
  subscriptionDistribution: { plan: string; count: number }[];
}
