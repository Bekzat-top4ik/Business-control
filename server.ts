/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbManager, hashPassword } from './src/db/localDb.js';
import { UserRole, SystemHealthStatus } from './src/types.js';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- SECURE STANDARD JWT AUTH UTILS (Pure JS implementation, zero dependency) ---
const JWT_SECRET = process.env.JWT_SECRET || 'saas_management_suite_secret_2026';

function signToken(payload: { userId: string; username: string; email: string; role: string; companyId: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch (e) {
    return null;
  }
}

// Ensure database is initialized
dbManager.load();

// --- AUTHENTICATION MIDDLEWARES ---
interface AuthRequest extends express.Request {
  user?: {
    userId: string;
    username: string;
    email: string;
    role: UserRole;
    companyId: string;
  };
}

const optionalAuthenticate = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
};

const requireAuthenticate = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Access denied. Private session: token authentication required." });
    return;
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: "Invalid, expired, or corrupted login token." });
    return;
  }
  req.user = decoded;
  next();
};

// Role authorization interceptors
const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized session." });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Action restricted. Your role '${req.user.role}' lacks permissions for this operation.` });
      return;
    }
    next();
  };
};

// --- AUTH REST ENDPOINTS ---

// REGISTER API
app.post('/api/auth/register', (req, res) => {
  try {
    const { companyName, username, email, password } = req.body;
    if (!companyName || !username || !email || !password) {
      res.status(400).json({ error: "Missing required registration parameters." });
      return;
    }

    const existingUser = dbManager.getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "A user account with this email address already exists." });
      return;
    }

    // 1. Create company workspace
    const company = dbManager.registerCompany(companyName);

    // 2. Create Administrator account mapping
    const userObj = dbManager.createUser({
      username,
      email,
      passwordHash: hashPassword(password),
      role: UserRole.ADMINISTRATOR,
      companyId: company.id
    });

    // 3. Setup default audit action
    dbManager.createLog(company.id, userObj.id, username, "Company Created", `Tenant workspace initial setup for ${companyName}`);

    // Create a demo product to help them get started
    dbManager.createProduct({
      name: "Standard Package / Main Good",
      sku: "GOOD-01",
      category: "General",
      stockQuantity: 100,
      minStockAlert: 10,
      costPrice: 5.0,
      salePrice: 15.0,
      companyId: company.id
    });

    const token = signToken({
      userId: userObj.id,
      username: userObj.username,
      email: userObj.email,
      role: userObj.role,
      companyId: userObj.companyId
    });

    res.status(201).json({
      token,
      user: {
        userId: userObj.id,
        username: userObj.username,
        email: userObj.email,
        role: userObj.role,
        companyId: userObj.companyId,
        companyName: company.name
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN API
app.post('/api/auth/login', (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required credentials." });
      return;
    }
    email = email.trim();
    password = password.trim();

    const user = dbManager.getUserByEmail(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid email or matching password credentials." });
      return;
    }

    const company = dbManager.getCompany(user.companyId);
    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    });

    // Write audit activity logs
    dbManager.createLog(user.companyId, user.id, user.username, "Authentication", "Successfully authenticated terminal login session.");

    res.json({
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: company ? company.name : "Isolated Cloud"
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PROFILE STATUS
app.get('/api/auth/profile', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const decoded = req.user!;
    const user = dbManager.getUserById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "Authenticated user no longer on storage record." });
      return;
    }
    const company = dbManager.getCompany(user.companyId);
    res.json({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: company ? company.name : "Isolated Tenant Workspace"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PLATFORM SUPER ADMIN (SAAS OWNER) ARCHITECTURE ROUTING ---

const requireSuperAdmin = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  if (!req.user || req.user.role !== UserRole.SUPER_ADMIN) {
    res.status(403).json({ error: "Access denied. Restricted to the creator/owner of Business Control." });
    return;
  }
  next();
};

app.get('/api/superadmin/stats', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const stats = dbManager.superAdminGetStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/superadmin/companies', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const companies = dbManager.superAdminGetCompanies();
    res.json(companies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/superadmin/companies/:id/plan', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { subscriptionPlan, status, billingStatus } = req.body;
    if (!subscriptionPlan || !status || !billingStatus) {
      res.status(400).json({ error: "Missing subscriptionPlan, status, or billingStatus properties." });
      return;
    }
    const ok = dbManager.superAdminUpdateCompanyPlan(id, subscriptionPlan, status, billingStatus);
    if (!ok) {
      res.status(404).json({ error: "Target company not located." });
      return;
    }
    res.json({ success: true, message: "Subscription properties updated successfully on workspace." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/superadmin/companies/:id', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const ok = dbManager.superAdminDeleteCompany(id);
    if (!ok) {
      res.status(404).json({ error: "Company not found." });
      return;
    }
    res.json({ success: true, message: "Company workspace and associated users successfully deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/superadmin/tickets', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const tickets = dbManager.superAdminGetTickets();
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/superadmin/tickets/:id/reply', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Response feedback content cannot be empty." });
      return;
    }
    const ticket = dbManager.superAdminReplyTicket(id, "Bekzat (SuperAdmin)", text);
    if (!ticket) {
      res.status(404).json({ error: "Support ticket not found or closed." });
      return;
    }
    res.json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/superadmin/audit-logs', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const logs = dbManager.superAdminGetPlatformLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/superadmin/health', requireAuthenticate, requireSuperAdmin, (req: AuthRequest, res) => {
  try {
    const nodeV = process.version;
    const memUsage = process.memoryUsage();
    const rssMB = Math.round(memUsage.rss / (1024 * 1024));
    
    // File system DB size
    let dbSizeKB = 25;
    try {
      const DB_PATH = path.join(process.cwd(), 'local_saas_db.json');
      if (fs.existsSync(DB_PATH)) {
        dbSizeKB = Math.round(fs.statSync(DB_PATH).size / 1024);
      }
    } catch (_) {}

    const totalTickets = dbManager.superAdminGetTickets().length;
    const openTickets = dbManager.superAdminGetTickets().filter(t => t.status === 'Open').length;

    const health: SystemHealthStatus = {
      server: 'Online',
      database: 'Connected',
      storageUsage: `${dbSizeKB} KB`,
      cpuLoad: 2.1, // simulated background cpu load
      memoryUsage: rssMB, // RSS size MB
      errorRate: 0.0,
      uptime: `${Math.round(process.uptime() / 60)}m ${Math.round(process.uptime() % 60)}s`,
      apiPerformance: [
        { endpoint: 'GET /api/dashboard/summary', responseTime: 12, hits: 322 },
        { endpoint: 'POST /api/sales/checkout', responseTime: 21, hits: 145 },
        { endpoint: 'GET /api/superadmin/stats', responseTime: 18, hits: 60 },
        { endpoint: 'GET /api/support/tickets', responseTime: 8, hits: 24 }
      ]
    };
    res.json(health);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- STANDARD TENANT CLIENTS HELP CENTER INTEGRATIONS ---

app.post('/api/support/tickets', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const { companyId, username } = req.user!;
    const company = dbManager.getCompany(companyId);
    const companyName = company ? company.name : "Isolated Tenant Workspace";
    const { subject, description, category } = req.body;
    if (!subject || !description || !category) {
      res.status(400).json({ error: "Subject, description, and ticket category are mandatory fields." });
      return;
    }
    const ticket = dbManager.superAdminCreateTicket(companyId, companyName, username, category, subject, description);
    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/support/tickets', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const { companyId } = req.user!;
    const all = dbManager.superAdminGetTickets();
    const companyTickets = all.filter(t => t.companyId === companyId);
    res.json(companyTickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- DASHBOARD API Endpoint ---
app.get('/api/dashboard/summary', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const { companyId } = req.user!;
    const products = dbManager.getProducts(companyId);
    const expenses = dbManager.getExpenses(companyId);
    const sales = dbManager.getSales(companyId);
    const logs = dbManager.getLogs(companyId);
    const users = dbManager.getUsers(companyId);
    const customers = dbManager.getCustomers(companyId);

    // Aggregate statistics
    let revenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    sales.forEach(s => {
      revenue += s.totalAmount;
      totalCost += s.totalCost;
      totalProfit += s.totalProfit;
    });

    let totalExpenses = 0;
    expenses.forEach(e => {
      totalExpenses += e.amount;
    });

    const netProfit = totalProfit - totalExpenses;
    const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockAlert).length;

    // Attach readable labels to recent sales
    const recentSalesResolved = sales
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(s => {
        const customer = customers.find(c => c.id === s.customerId);
        const userStaff = users.find(u => u.id === s.employeeId);
        return {
          ...s,
          customerName: customer ? customer.name : 'Walk-in Client',
          employeeName: userStaff ? userStaff.username.split(' ')[0] : 'Terminal'
        };
      });

    res.json({
      revenue: Number(revenue.toFixed(2)),
      cost: Number(totalCost.toFixed(2)),
      profit: Number(totalProfit.toFixed(2)),
      expenses: Number(totalExpenses.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      lowStockCount,
      recentSales: recentSalesResolved,
      recentLogs: logs
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PRODUCTS CRUD APIs ---

app.get('/api/products', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const products = dbManager.getProducts(req.user!.companyId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER]), (req: AuthRequest, res) => {
  try {
    const { name, sku, category, stockQuantity, minStockAlert, costPrice, salePrice } = req.body;
    if (!name || !sku || !category || stockQuantity === undefined || minStockAlert === undefined || costPrice === undefined || salePrice === undefined) {
      res.status(400).json({ error: "Missing required fields to insert product." });
      return;
    }

    const { companyId, userId, username } = req.user!;
    
    // Check duplication SKU in this company
    const products = dbManager.getProducts(companyId);
    if (products.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
      res.status(400).json({ error: `SKU code '${sku}' is already assigned to a product in your workspace.` });
      return;
    }

    const newProduct = dbManager.createProduct({
      name,
      sku,
      category,
      stockQuantity: Number(stockQuantity),
      minStockAlert: Number(minStockAlert),
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      companyId
    });

    dbManager.createLog(companyId, userId, username, "Product Created", `Added unit [${sku}] ${name} with starting stock: ${stockQuantity}`);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER]), (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId, username } = req.user!;
    const updates = req.body;

    const updated = dbManager.updateProduct(id, companyId, {
      ...updates,
      ...(updates.stockQuantity !== undefined && { stockQuantity: Number(updates.stockQuantity) }),
      ...(updates.minStockAlert !== undefined && { minStockAlert: Number(updates.minStockAlert) }),
      ...(updates.costPrice !== undefined && { costPrice: Number(updates.costPrice) }),
      ...(updates.salePrice !== undefined && { salePrice: Number(updates.salePrice) })
    });

    if (!updated) {
      res.status(404).json({ error: "Product not found or access restricted." });
      return;
    }

    dbManager.createLog(companyId, userId, username, "Product Updated", `Modified records for SKU: ${updated.sku} (${updated.name})`);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER]), (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId, username } = req.user!;
    
    const prod = dbManager.getProductById(id, companyId);
    if (!prod) {
      res.status(404).json({ error: "Product not located on this company record." });
      return;
    }

    dbManager.deleteProduct(id, companyId);
    dbManager.createLog(companyId, userId, username, "Product Deleted", `Removed inventory record of ${prod.name} (SKU: ${prod.sku})`);
    res.json({ success: true, message: "Inventory record successfully deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- EXPENSES APIs ---

app.get('/api/expenses', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const expenses = dbManager.getExpenses(req.user!.companyId);
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER]), (req: AuthRequest, res) => {
  try {
    const { amount, category, description, date } = req.body;
    if (!amount || !category || !description || !date) {
      res.status(400).json({ error: "Missing numeric cost amounts, categories, descriptors or dates." });
      return;
    }

    const { companyId, userId, username } = req.user!;
    const expense = dbManager.createExpense({
      amount: Number(amount),
      category,
      description,
      date,
      companyId
    });

    dbManager.createLog(companyId, userId, username, "Expense Logged", `Recorded cost: $${amount} for ${category} (${description})`);
    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/expenses/:id', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER]), (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId, username } = req.user!;

    dbManager.deleteExpense(id, companyId);
    dbManager.createLog(companyId, userId, username, "Expense Deleted", `Removed expense line record of $${id} from company sheets.`);
    res.json({ success: true, message: "Expense record deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRM CUSTOMERS APIs ---

app.get('/api/customers', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const clients = dbManager.getCustomers(req.user!.companyId);
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: "Customer name and working telephone contact are required." });
      return;
    }

    const { companyId, userId, username } = req.user!;
    const customer = dbManager.createCustomer({
      name,
      email: email || '',
      phone,
      companyId
    });

    dbManager.createLog(companyId, userId, username, "Customer Added", `Enrolled client ${name} onto loyalty registry.`);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER]), (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId, username } = req.user!;

    dbManager.deleteCustomer(id, companyId);
    dbManager.createLog(companyId, userId, username, "Customer Removed", `Removed customer account [${id}] from CRM.`);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- EMPLOYEES ARCHITECTURE ---

app.get('/api/employees', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const staff = dbManager.getEmployees(req.user!.companyId);
    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR]), (req: AuthRequest, res) => {
  try {
    const { name, phone, baseSalary, rankingScore } = req.body;
    if (!name || !phone || !baseSalary) {
      res.status(400).json({ error: "Employee detail fields are incomplete." });
      return;
    }

    const { companyId, userId, username } = req.user!;
    const emp = dbManager.createEmployee({
      name,
      phone,
      baseSalary: Number(baseSalary),
      rankingScore: Number(rankingScore || 90),
      companyId
    });

    dbManager.createLog(companyId, userId, username, "Employee Recruited", `Added employee registry for ${name} at base monthly wage: $${baseSalary}`);
    res.status(201).json(emp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR]), (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId, username } = req.user!;

    dbManager.deleteEmployee(id, companyId);
    dbManager.createLog(companyId, userId, username, "Employee Offboarded", `Terminated employee record id: ${id}`);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- POS CHECKOUT TRANSACTION API ---

app.post('/api/sales/checkout', requireAuthenticate, requireRole([UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.CASHIER]), (req: AuthRequest, res) => {
  try {
    const { cart, customerId, paymentMethod } = req.body; // cart: Array<{ productId: string, quantity: number }>
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      res.status(400).json({ error: "POS basket cart items must be supplied for checkout." });
      return;
    }

    const { companyId, userId, username } = req.user!;

    // Perform relational checkout
    const checkoutResult = dbManager.processCheckout(
      companyId,
      userId,
      cart,
      customerId || null,
      paymentMethod || 'Cash'
    );

    if (!checkoutResult) {
      res.status(400).json({ error: "Checkout calculations failed during transactions processing." });
      return;
    }

    const parsedLogsMessage = `Processed sale [ID: ${checkoutResult.sale.id}] for: $${checkoutResult.sale.totalAmount}. Profit generated: $${checkoutResult.sale.totalProfit}`;
    dbManager.createLog(companyId, userId, username, "POS checkout", parsedLogsMessage);
    
    // Add audit details for each product item sold
    checkoutResult.items.forEach(item => {
      const prodObj = dbManager.getProductById(item.productId, companyId);
      if (prodObj && prodObj.stockQuantity <= prodObj.minStockAlert) {
        dbManager.createLog(companyId, "SYSTEM", "Automated System", "Stock Alert", `WARNING: Product '${prodObj.name}' is now at CRITICAL level (${prodObj.stockQuantity} units left)`);
      }
    });

    res.status(201).json(checkoutResult);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/sales', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const sales = dbManager.getSales(req.user!.companyId);
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- TELEGRAM SIMULATION TRIGGER ---
app.get('/api/telegram/status', requireAuthenticate, (req: AuthRequest, res) => {
  res.json({
    botUsername: "@SaaSOperationsAgentBot",
    connectedStatus: true,
    alertsConfig: {
      dailyRevenueReport: true,
      lowStockWarnings: true,
      excessiveCostsWarning: true
    }
  });
});

app.post('/api/telegram/trigger-report', requireAuthenticate, (req: AuthRequest, res) => {
  try {
    const { companyId } = req.user!;
    const lang = (req.query.lang as string) || 'en';
    const company = dbManager.getCompany(companyId);
    const prodList = dbManager.getProducts(companyId);
    const lowStock = prodList.filter(p => p.stockQuantity <= p.minStockAlert);
    const salesList = dbManager.getSales(companyId);

    const todayDate = new Date().toISOString().substring(0, 10);
    const todaySales = salesList.filter(s => s.date === todayDate);

    const totalRevToday = todaySales.reduce((acc, current) => acc + current.totalAmount, 0);
    const totalProfitToday = todaySales.reduce((acc, current) => acc + current.totalProfit, 0);

    let telegramMessage = '';

    if (lang === 'ru') {
      const dateString = new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      telegramMessage = `
🔔 *Telegram Отчет - Симуляция рассылки*
🏢 *Организация:* ${company ? company.name : 'Ваш Бизнес'}
📅 *Дата:* ${dateString}

💰 *Выручка за сегодня:* $${totalRevToday.toFixed(2)}
📈 *Ожидаемая прибыль сегодня:* $${totalProfitToday.toFixed(2)}
🛒 *Оформлено POS чеков за день:* ${todaySales.length}

⚠️ *Оповещения склада - Критический запас:*
${lowStock.length === 0 ? "✅ Все товары в достаточном объеме!" : 
  lowStock.map(p => `• 📦 *${p.name}* (SKU: ${p.sku}) | Остаток: *${p.stockQuantity}* (Минимум: ${p.minStockAlert})`).join('\n')
}

⚙️ _Симулированный отчет успешно отправлен по протоколу Telegram Webhook._
      `.trim();
    } else if (lang === 'ky') {
      const dateString = new Date().toLocaleDateString('ky-KG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      telegramMessage = `
🔔 *Telegram Отчет - Симуляциялык Берүү*
🏢 *Иш кана:* ${company ? company.name : 'Иш кана'}
📅 *Күнү:* ${dateString}

💰 *Бүгүнкү Киреше:* $${totalRevToday.toFixed(2)}
📈 *Бүгүнкү Болжолдуу Пайда:* $${totalProfitToday.toFixed(2)}
🛒 *Бүгүн Оформленген POS Чектер:* ${todaySales.length}

⚠️ *Запастарды толуктоо боюнча Эскертүү:*
${lowStock.length === 0 ? "✅ Бардык өнүмдөрдүн запасы жетиштүү!" : 
  lowStock.map(p => `• 📦 *${p.name}* (Бекемдөө: ${p.sku}) | Складда: *${p.stockQuantity}* (Минимум: ${p.minStockAlert})`).join('\n')
}

⚙️ _Эсептик отчет Telegram Webhook протоколу боюнча ийгиликтүү симуляцияланды._
      `.trim();
    } else {
      telegramMessage = `
🔔 *Telegram Daily Report - Simulated Broadcast*
🏢 *Workspace:* ${company ? company.name : 'Office'}
📅 *Date:* ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

💰 *Today's Revenue:* $${totalRevToday.toFixed(2)}
📈 *Today's Estimated Margin:* $${totalProfitToday.toFixed(2)}
🛒 *Checkout Transactions Completed:* ${todaySales.length}

⚠️ *Inventory Alert - Low Stock Units :*
${lowStock.length === 0 ? "✅ All products are adequately stocked!" : 
  lowStock.map(p => `• 📦 *${p.name}* (SKU: ${p.sku}) | Stock: *${p.stockQuantity}* (Min: ${p.minStockAlert})`).join('\n')
}

⚙️ _Simulated report transmitted successfully via Telegram Webhook protocols._
      `.trim();
    }

    dbManager.createLog(companyId, req.user!.userId, req.user!.username, "Telegram Trigger", "Fired automated sales and low-stock broadcast to Telegram.");
    res.json({ success: true, message: "Simulated Telegram notification sent successfully!", rawMarkdown: telegramMessage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GOOGLE GEMINI AI INSIGHTS ---
app.get('/api/ai/insights', requireAuthenticate, async (req: AuthRequest, res) => {
  try {
    const { companyId } = req.user!;
    const lang = (req.query.lang as string) || 'en';
    const company = dbManager.getCompany(companyId);
    const products = dbManager.getProducts(companyId);
    const expenses = dbManager.getExpenses(companyId);
    const sales = dbManager.getSales(companyId);

    // Filter low stock
    const lowStockDetails = products
      .filter(p => p.stockQuantity <= p.minStockAlert)
      .map(p => `Name: ${p.name}, Current Stock: ${p.stockQuantity} items (Minimum limit: ${p.minStockAlert}), Sale Price: $${p.salePrice}, Cost Price: $${p.costPrice}`);

    const bestSellers = [...products]
      .sort((a,b) => b.stockQuantity - a.stockQuantity)
      .slice(0, 3)
      .map(p => `Name: ${p.name}, Category: ${p.category}`);

    const expenseDetails = expenses
      .map(e => `Category: ${e.category}, Description: ${e.description}, Price: $${e.amount}, Date: ${e.date}`);

    const weeklyRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const weeklyProfit = sales.reduce((acc, s) => acc + s.totalProfit, 0);

    const dataContext = `
Workspace name: ${company ? company.name : 'My Shop'}
Total Products Active: ${products.length}
Low stock items currently: ${lowStockDetails.length}
Summary of critical stock:
${lowStockDetails.length > 0 ? lowStockDetails.join('\n') : "All items have excellent stock safety ranges."}

Best Selling items metadata (by holding catalog stock):
${bestSellers.join('\n')}

Operational expenses currently logged:
${expenseDetails.length > 0 ? expenseDetails.join('\n') : "No expenses recorded."}

Aggregate Revenue Metrics of sales:
Aggregate Sales Volume: $${weeklyRevenue.toFixed(2)}
Expected profit margins from POS sales: $${weeklyProfit.toFixed(2)}
    `.trim();

    // Check if the API key is valid / exists or user is larping on empty API keys
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      let defaultRecommendations = [];
      let fallbackSummary = '';

      if (lang === 'ru') {
        defaultRecommendations = [
          `🚨 **Настройте ключ Gemini**: Чтобы активировать живую генеративную аналитику, нажмите на панель **Настройки > Секреты** в верхнем правом углу и введите ваш \`GEMINI_API_KEY\`!`,
          `📦 **Предупреждение о закупках**: Срочно закупите товар **${lowStockDetails.length > 0 ? products.filter(p => p.stockQuantity <= p.minStockAlert)[0].name : "критические позиции"}**! Запасы ниже лимита безопасности.`,
          `📊 **Оптимизация наценки**: Наценка на ваши товары в среднем составляет **${products.length > 0 ? Math.round((products.reduce((acc, cur) => acc + (cur.salePrice - cur.costPrice)/cur.salePrice, 0) / products.length) * 100) : 40}%**. Сфокусируйте внимание на этих позициях.`,
          `📉 **Учет накладных расходов**: Вы добавили по компании **${expenses.length} записей расходов** на общую сумму **$${expenses.reduce((acc, cur) => acc + cur.amount, 0)}**. Аренда и коммуналка составляют основную массу расходов.`
        ];
        fallbackSummary = `### 🤖 Автоматический бизнес-анализ (Ожидание ключа Gemini)\n\nДобро пожаловать в SaaS Бизнес-Копилот. Обнаружено, что API-ключ Gemini не настроен (требуется прописать его в *Настройки > Секреты* для живой ИИ-диагностики).\n\nВаша моментальная сводка бизнес-аналитики по правилам:\n\n1. ${defaultRecommendations[0]}\n2. ${defaultRecommendations[1]}\n3. ${defaultRecommendations[2]}\n4. ${defaultRecommendations[3]}`;
      } else if (lang === 'ky') {
        defaultRecommendations = [
          `🚨 **Gemini ачкычыңызды орнотуңуз**: Реалдуу убакыттагы аналитиканы иштетүү үчүн, оң жактагы жогорку бурчта жайгашкан **Орнотуулар > Сыр ачкычтар** бөлүгүнө кирип, өзүңүздүн жеке \`GEMINI_API_KEY\` ачкычыңызды жазыңыз!`,
          `📦 **Запастарды толуктоо**: Шашылыш түрдө **${lowStockDetails.length > 0 ? products.filter(p => p.stockQuantity <= p.minStockAlert)[0].name : "критикалык товарларды"}** сатып алыңыз! Коопсуздук деңгээлинен төмөн.`,
          `📊 **Маржаны ирээттөө**: Товарларыңыздын орточо кошумча кошумча наркы болжол менен **${products.length > 0 ? Math.round((products.reduce((acc, cur) => acc + (cur.salePrice - cur.costPrice)/cur.salePrice, 0) / products.length) * 100) : 40}%** түзөт. Ушул багытка көңүл буруңуз.`,
          `📉 **Чыгымдардын аудити**: Сиз жалпы **${expenses.length} чыгым жазмаларын** киргиздиңиз, жалпы сумасы **$${expenses.reduce((acc, cur) => acc + cur.amount, 0)}**. Ижара акысы жана коммуналдык кызматтар негизги чыгымды түзөт.`
        ];
        fallbackSummary = `### 🤖 Автоматтык бизнес-анализ (Gemini ачкычы күтүлүүдө)\n\nSaaS Бизнес-Копилотко кош келиңиз. Сиздин тутумда Gemini API ачкычы жөндөлгөн эмес (жогорудагы *Орнотуулар > Сыр ачкычтар* палитрасынан киргизиңиз).\n\nСиздин автоматтык эрежелер боюнча отчетуңуз:\n\n1. ${defaultRecommendations[0]}\n2. ${defaultRecommendations[1]}\n3. ${defaultRecommendations[2]}\n4. ${defaultRecommendations[3]}`;
      } else {
        defaultRecommendations = [
          `🚨 **Configure Your Gemini Key**: To activate live generative analysis, please click on the **Settings > Secrets** panel in the upper-right corner and input your active \`GEMINI_API_KEY\`!`,
          `📦 **Restocking Alert**: Restock **${lowStockDetails.length > 0 ? products.filter(p => p.stockQuantity <= p.minStockAlert)[0].name : "any critical lines"}** immediately! Stocks are below margins.`,
          `📊 **Margin Optimizer**: Product profit margins are sitting at an estimated average of **${products.length > 0 ? Math.round((products.reduce((acc, cur) => acc + (cur.salePrice - cur.costPrice)/cur.salePrice, 0) / products.length) * 100) : 40}%** markup. Focus promotions on these items.`,
          `📉 **Expense Audit**: You logged **${expenses.length} expense entries** totaling **$${expenses.reduce((acc, cur) => acc + cur.amount, 0)}**. Rent & Utilities occupy the bulk of operational overheads. Restructure supply routes to lift net bottom-line performance.`
        ];
        fallbackSummary = `### 🤖 Rule-Based Business Intelligence (Gemini Key Standby)\n\nWelcome to your SaaS Business Copilot. The system detected that the **Gemini API Key** is running in sandbox default mode (needs to be configured in *Settings > Secrets* to trigger live live deep learning inference).\n\nBelow is your instant, automated, rule-based business intelligence summary:\n\n1. ${defaultRecommendations[0]}\n2. ${defaultRecommendations[1]}\n3. ${defaultRecommendations[2]}\n4. ${defaultRecommendations[3]}`;
      }

      res.json({
        usingFallback: true,
        summary: fallbackSummary
      });
      return;
    }

    // Initialize modern @google/genai SDK
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let languageRequirement = "Write your response in English language.";
    if (lang === 'ru') languageRequirement = "IMPORTANT: Write your complete analytical report in Russian language only (на русском языке).";
    if (lang === 'ky') languageRequirement = "IMPORTANT: Write your complete analytical report in Kyrgyz language only (кыргыз тилинде).";

    // Request text output content using recommended role instructions
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
You are a highly analytical business consultant and SaaS inventory strategist. Below is a data summary from a small/medium business multi-tenant database.
Analyze this data carefully and write a concise, highly professional, structured, executive business advisor brief.

In your report, deliver:
1. **Critical Inventory restock metrics**: specifically naming which stock lines need restocking immediately and what SKU risks they carry.
2. **Financial Profitability review**: detail the cash flow (Total Revenue vs Profit vs Operational Expenses) and identify whether the business is cash-flow positive or negative, highlighting margin leakages.
3. **Smart Strategic suggestions**: offer actionable rule-based steps to optimize sales, bundle slow-moving inventory, or restructure costs.

${languageRequirement}
Write in a warm, expert, encouraging, and clear markdown format. No fluff.

--- DETAILED LIVE BUSINESS DATABASE CONTEXT ---
${dataContext}
      `.trim()
    });

    const resultText = response.text || "Unable to extract text from AI generative responses.";
    res.json({
      usingFallback: false,
      summary: resultText
    });

  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ error: `AI Generation failed: ${error.message}` });
  }
});

// --- INTEGRATING VITE DEVELOPMENT MIDDLEWARES AND ASSET PIPELINE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets compiled inside dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express SaaS Server] running cleanly at http://0.0.0.0:${PORT}`);
  });
}

startServer();
