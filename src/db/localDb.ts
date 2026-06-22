/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Company, User, Product, Expense, Customer, Employee, Sale, SaleItem, AuditLog, UserRole, SupportTicket, PlatformAuditLog, SuperAdminStats, SuperAdminCompanyData
} from '../types.js';

interface DbSchema {
  companies: Company[];
  users: User[];
  products: Product[];
  expenses: Expense[];
  customers: Customer[];
  employees: Employee[];
  sales: Sale[];
  salesItems: SaleItem[];
  auditLogs: AuditLog[];
  tickets: SupportTicket[];
  platformAuditLogs: PlatformAuditLog[];
}

const DB_FILE = path.join(process.cwd(), 'local_saas_db.json');

// Helper to hash passwords using SHA256 with simple salt
export function hashPassword(password: string): string {
  const salt = 'saas_salt_2026';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Initial seed data
const DEFAULT_DB: DbSchema = {
  companies: [
    { id: "comp-cafe", name: "Central Cafe & Roastery", createdAt: "2026-05-01T08:00:00Z", subscriptionPlan: "Business", status: "Active", billingStatus: "Paid" },
    { id: "comp-pharma", name: "Altyn Pharmacy", createdAt: "2026-05-10T09:00:00Z", subscriptionPlan: "Premium", status: "Active", billingStatus: "Paid" },
    { id: "comp-platform-hq", name: "HQ Platform Operations", createdAt: "2026-05-01T08:00:00Z", subscriptionPlan: "Premium", status: "Active", billingStatus: "Paid" }
  ],
  users: [
    // Cafe Users
    {
      id: "usr-cafe-admin",
      username: "Alikhan (Admin)",
      email: "cafe_admin@example.com",
      passwordHash: hashPassword("cafe123"),
      role: UserRole.ADMINISTRATOR,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T08:30:00Z"
    },
    {
      id: "usr-cafe-manager",
      username: "Dana (Manager)",
      email: "cafe_manager@example.com",
      passwordHash: hashPassword("cafe123"),
      role: UserRole.MANAGER,
      companyId: "comp-cafe",
      createdAt: "2026-05-02T09:00:00Z"
    },
    {
      id: "usr-cafe-cashier",
      username: "Zarina (Cashier)",
      email: "cafe_cashier@example.com",
      passwordHash: hashPassword("cafe123"),
      role: UserRole.CASHIER,
      companyId: "comp-cafe",
      createdAt: "2026-05-03T10:00:00Z"
    },
    {
      id: "usr-cafe-staff",
      username: "Temir (Employee)",
      email: "cafe_staff@example.com",
      passwordHash: hashPassword("cafe123"),
      role: UserRole.EMPLOYEE,
      companyId: "comp-cafe",
      createdAt: "2026-05-04T10:00:00Z"
    },
    // Pharmacy Users
    {
      id: "usr-pharma-admin",
      username: "Sultan (Admin)",
      email: "pharma_admin@example.com",
      passwordHash: hashPassword("pharma123"),
      role: UserRole.ADMINISTRATOR,
      companyId: "comp-pharma",
      createdAt: "2026-05-10T10:00:00Z"
    },
    {
      id: "usr-pharma-manager",
      username: "Aigerim (Manager)",
      email: "pharma_manager@example.com",
      passwordHash: hashPassword("pharma123"),
      role: UserRole.MANAGER,
      companyId: "comp-pharma",
      createdAt: "2026-05-11T11:00:00Z"
    },
    {
      id: "usr-superadmin",
      username: "Bekzat (Owner)",
      email: "admin@gmail.com",
      passwordHash: hashPassword("super123"),
      role: UserRole.SUPER_ADMIN,
      companyId: "comp-platform-hq",
      createdAt: "2026-05-01T08:00:00Z"
    }
  ],
  products: [
    // Cafe Products
    {
      id: "prod-c1",
      name: "Specialty Roasted Beans (250g)",
      sku: "CF-BEANS-01",
      category: "Coffee Beans",
      stockQuantity: 45,
      minStockAlert: 10,
      costPrice: 8.5,
      salePrice: 18.0,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T09:00:00Z"
    },
    {
      id: "prod-c2",
      name: "Single-Origin Espresso Shot",
      sku: "CF-ESP-02",
      category: "Beverages",
      stockQuantity: 300,
      minStockAlert: 30,
      costPrice: 0.5,
      salePrice: 3.5,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T09:10:00Z"
    },
    {
      id: "prod-c3",
      name: "Caramel Macchiato XL",
      sku: "CF-MAC-03",
      category: "Beverages",
      stockQuantity: 150,
      minStockAlert: 20,
      costPrice: 0.9,
      salePrice: 5.5,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T09:15:00Z"
    },
    {
      id: "prod-c4",
      name: "Belgian Chocolate Croissant",
      sku: "CF-CRO-04",
      category: "Bakery",
      stockQuantity: 4, // Trigger Low Stock Alert!
      minStockAlert: 15,
      costPrice: 1.2,
      salePrice: 4.0,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T09:20:00Z"
    },
    {
      id: "prod-c5",
      name: "Matcha Latte Organic",
      sku: "CF-MAT-05",
      category: "Beverages",
      stockQuantity: 8, // Low stock!
      minStockAlert: 15,
      costPrice: 1.5,
      salePrice: 6.0,
      companyId: "comp-cafe",
      createdAt: "2026-05-02T10:00:00Z"
    },
    {
      id: "prod-c6",
      name: "NYC Baked Cheesecake",
      sku: "CF-CAKE-06",
      category: "Bakery",
      stockQuantity: 18,
      minStockAlert: 8,
      costPrice: 1.8,
      salePrice: 5.0,
      companyId: "comp-cafe",
      createdAt: "2026-05-02T10:30:00Z"
    },

    // Pharmacy Products
    {
      id: "prod-p1",
      name: "Aspirin Pain Relief 81mg (100 Tabs)",
      sku: "PH-ASP-01",
      category: "Painkillers",
      stockQuantity: 120,
      minStockAlert: 20,
      costPrice: 2.1,
      salePrice: 6.5,
      companyId: "comp-pharma",
      createdAt: "2026-05-10T11:00:00Z"
    },
    {
      id: "prod-p2",
      name: "Amoxicillin Antibiotical 500mg",
      sku: "PH-AMX-02",
      category: "Prescription",
      stockQuantity: 12, // Low stock!
      minStockAlert: 25,
      costPrice: 4.5,
      salePrice: 15.0,
      companyId: "comp-pharma",
      createdAt: "2026-05-10T11:15:00Z"
    },
    {
      id: "prod-p3",
      name: "Multivitamin Active Complex (90 Caps)",
      sku: "PH-VIT-03",
      category: "Supplements",
      stockQuantity: 85,
      minStockAlert: 15,
      costPrice: 6.8,
      salePrice: 22.0,
      companyId: "comp-pharma",
      createdAt: "2026-05-10T11:20:00Z"
    },
    {
      id: "prod-p4",
      name: "Medical Protection Masks 50-Pack",
      sku: "PH-MSK-04",
      category: "Disposable",
      stockQuantity: 8, // Low Stock!
      minStockAlert: 30,
      costPrice: 1.5,
      salePrice: 4.99,
      companyId: "comp-pharma",
      createdAt: "2026-05-10T11:30:00Z"
    },
    {
      id: "prod-p5",
      name: "Antistress Herbs Syrup (200ml)",
      sku: "PH-HRB-05",
      category: "Supplements",
      stockQuantity: 40,
      minStockAlert: 10,
      costPrice: 3.2,
      salePrice: 9.8,
      companyId: "comp-pharma",
      createdAt: "2026-05-11T09:00:00Z"
    }
  ],
  expenses: [
    // Cafe Expenses
    {
      id: "exp-c1",
      amount: 450,
      category: "Rent",
      description: "Cozy Corner Premises Monthly Rent",
      companyId: "comp-cafe",
      date: "2026-05-28",
      createdAt: "2026-05-28T18:00:00Z"
    },
    {
      id: "exp-c2",
      amount: 120,
      category: "Utilities",
      description: "Electric grill & Espresso Machine Power",
      companyId: "comp-cafe",
      date: "2026-06-01",
      createdAt: "2026-06-01T12:00:00Z"
    },
    {
      id: "exp-c3",
      amount: 80,
      category: "Supplies",
      description: "Organic Milk purchase batch",
      companyId: "comp-cafe",
      date: "2026-06-05",
      createdAt: "2026-06-05T14:30:00Z"
    },

    // Pharmacy Expenses
    {
      id: "exp-p1",
      amount: 800,
      category: "Rent",
      description: "Main Avenue Shop Rental Fee",
      companyId: "comp-pharma",
      date: "2026-05-28",
      createdAt: "2026-05-28T18:00:00Z"
    },
    {
      id: "exp-p2",
      amount: 250,
      category: "Supplies",
      description: "Imported vitamins bulk delivery duty",
      companyId: "comp-pharma",
      date: "2026-06-03",
      createdAt: "2026-06-03T10:00:00Z"
    }
  ],
  customers: [
    // Cafe Customers (CRM)
    {
      id: "cust-c1",
      name: "Daniyar K.",
      email: "daniyar@example.com",
      phone: "+7 701 445 9931",
      loyaltyPoints: 125, // VIP (>100)
      isVip: true,
      companyId: "comp-cafe",
      createdAt: "2026-05-02T11:00:00Z"
    },
    {
      id: "cust-c2",
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      phone: "+1 202 555 0148",
      loyaltyPoints: 60,
      isVip: false,
      companyId: "comp-cafe",
      createdAt: "2026-05-03T16:00:00Z"
    },
    {
      id: "cust-c3",
      name: "Assel Sh.",
      email: "assel.sh@example.com",
      phone: "+7 775 112 0045",
      loyaltyPoints: 12,
      isVip: false,
      companyId: "comp-cafe",
      createdAt: "2026-05-15T14:00:00Z"
    },

    // Pharmacy Customers
    {
      id: "cust-p1",
      name: "Elena Petrova",
      email: "elena@example.com",
      phone: "+7 701 556 2211",
      loyaltyPoints: 210, // VIP
      isVip: true,
      companyId: "comp-pharma",
      createdAt: "2026-05-11T12:00:00Z"
    },
    {
      id: "cust-p2",
      name: "Marat Sagiyev",
      email: "marat.s@example.com",
      phone: "+7 702 333 4455",
      loyaltyPoints: 45,
      isVip: false,
      companyId: "comp-pharma",
      createdAt: "2026-05-12T15:00:00Z"
    }
  ],
  employees: [
    // Cafe Employees
    {
      id: "emp-c1",
      name: "Aidar (Barista Head)",
      phone: "+7 701 889 4411",
      baseSalary: 650,
      rankingScore: 92,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T09:00:00Z"
    },
    {
      id: "emp-c2",
      name: "Alima (Pastry Chef)",
      phone: "+7 747 556 8822",
      baseSalary: 720,
      rankingScore: 88,
      companyId: "comp-cafe",
      createdAt: "2026-05-01T09:00:00Z"
    },
    {
      id: "emp-c3",
      name: "Zarina (Lead Cashier)",
      phone: "+7 702 339 5555",
      baseSalary: 550,
      rankingScore: 95,
      companyId: "comp-cafe",
      createdAt: "2026-05-03T10:00:00Z"
    },

    // Pharmacy Employees
    {
      id: "emp-p1",
      name: "Dr. Saniya (Pharmacist)",
      phone: "+7 701 777 9900",
      baseSalary: 1100,
      rankingScore: 96,
      companyId: "comp-pharma",
      createdAt: "2026-05-10T10:00:00Z"
    },
    {
      id: "emp-p2",
      name: "Temir (Storage Assistant)",
      phone: "+7 775 444 1122",
      baseSalary: 600,
      rankingScore: 85,
      companyId: "comp-pharma",
      createdAt: "2026-05-12T09:00:00Z"
    }
  ],
  sales: [
    // Cafe Sales
    {
      id: "sale-c1",
      customerId: "cust-c1",
      employeeId: "usr-cafe-cashier",
      totalAmount: 39.5, // 2 Beans + 1 Caramel
      totalCost: 17.9,
      totalProfit: 21.6,
      paymentMethod: "Card",
      companyId: "comp-cafe",
      createdAt: "2026-06-03T11:00:00Z",
      date: "2026-06-03"
    },
    {
      id: "sale-c2",
      customerId: "cust-c2",
      employeeId: "usr-cafe-cashier",
      totalAmount: 11.0, // 2 Esp + 1 Croissant
      totalCost: 2.2,
      totalProfit: 8.8,
      paymentMethod: "Cash",
      companyId: "comp-cafe",
      createdAt: "2026-06-05T14:20:00Z",
      date: "2026-06-05"
    },
    {
      id: "sale-c3",
      customerId: null,
      employeeId: "usr-cafe-cashier",
      totalAmount: 22.0, // 4 Caramel Macchiatos
      totalCost: 3.6,
      totalProfit: 18.4,
      paymentMethod: "Mobile",
      companyId: "comp-cafe",
      createdAt: "2026-06-07T16:15:00Z",
      date: "2026-06-07"
    },

    // Pharmacy Sales
    {
      id: "sale-p1",
      customerId: "cust-p1",
      employeeId: "usr-pharma-manager",
      totalAmount: 84.0, // 2 vitamins + 4 Aspirins
      totalCost: 22.0,
      totalProfit: 62.0,
      paymentMethod: "Card",
      companyId: "comp-pharma",
      createdAt: "2026-06-02T13:00:00Z",
      date: "2026-06-02"
    },
    {
      id: "sale-p2",
      customerId: "cust-p2",
      employeeId: "usr-pharma-manager",
      totalAmount: 39.79, // 1 Amoxicillin + 1 Mask Pack + 2 Aspirin
      totalCost: 10.2,
      totalProfit: 29.59,
      paymentMethod: "Mobile",
      companyId: "comp-pharma",
      createdAt: "2026-06-06T11:30:00Z",
      date: "2026-06-06"
    }
  ],
  salesItems: [
    // Cafe Items for sale-c1
    {
      id: "item-c1-1",
      saleId: "sale-c1",
      productId: "prod-c1",
      quantity: 2,
      salePrice: 18.0,
      costPrice: 8.5,
      profit: 19.0,
      companyId: "comp-cafe"
    },
    {
      id: "item-c1-2",
      saleId: "sale-c1",
      productId: "prod-c3",
      quantity: 1,
      salePrice: 5.5,
      costPrice: 0.9,
      profit: 4.6,
      companyId: "comp-cafe"
    },
    // Cafe Items for sale-c2
    {
      id: "item-c2-1",
      saleId: "sale-c2",
      productId: "prod-c2",
      quantity: 2,
      salePrice: 3.5,
      costPrice: 0.5,
      profit: 6.0,
      companyId: "comp-cafe"
    },
    {
      id: "item-c2-2",
      saleId: "sale-c2",
      productId: "prod-c4",
      quantity: 1,
      salePrice: 4.0,
      costPrice: 1.2,
      profit: 2.8,
      companyId: "comp-cafe"
    },

    // Pharmacy Items for sale-p1
    {
      id: "item-p1-1",
      saleId: "sale-p1",
      productId: "prod-p3",
      quantity: 3,
      salePrice: 22.0,
      costPrice: 6.8,
      profit: 45.6,
      companyId: "comp-pharma"
    },
    {
      id: "item-p1-2",
      saleId: "sale-p1",
      productId: "prod-p1",
      quantity: 4,
      salePrice: 6.5,
      costPrice: 2.1,
      profit: 17.6,
      companyId: "comp-pharma"
    }
  ],
  auditLogs: [
    {
      id: "log-1",
      userId: "usr-cafe-admin",
      username: "Alikhan",
      action: "Database Initialized",
      details: "SaaS Business workspace configured successfully",
      companyId: "comp-cafe",
      createdAt: "2026-06-08T11:00:00Z"
    }
  ],
  tickets: [
    {
      id: "tkt-01",
      companyId: "comp-cafe",
      companyName: "Central Cafe & Roastery",
      username: "Alikhan",
      subject: "How do I upgrade to the Premium plan?",
      description: "We are expanding our seating capacity and recruiting three more baristas. Does the Business plan support unlimited terminal logging?",
      category: "Billing",
      status: "Open",
      createdAt: "2026-06-11T12:00:00Z",
      replies: [
        { sender: "System", text: "Ticket received automatically.", createdAt: "2026-06-11T12:00:05Z" }
      ]
    },
    {
      id: "tkt-02",
      companyId: "comp-pharma",
      companyName: "Altyn Pharmacy",
      username: "Sultan",
      subject: "Backup exports functionality",
      description: "Is it possible to receive a PDF summary export of the monthly expenses sheet directly to our emails? That would help our accountants.",
      category: "Feature Request",
      status: "In Progress",
      createdAt: "2026-06-11T14:30:00Z",
      replies: [
        { sender: "SuperAdmin", text: "Thanks for reaching out, Sultan! This feature is scheduled for the upcoming Q3 release.", createdAt: "2026-06-11T16:00:00Z" }
      ]
    }
  ],
  platformAuditLogs: [
    {
      id: "p-log-1",
      action: "Platform Initialized",
      details: "SaaS Multi-tenant platform services booted cleanly",
      adminEmail: "system@saas-control.com",
      createdAt: "2026-06-10T00:00:00Z"
    }
  ]
};

class LocalDatabase {
  private cache: DbSchema | null = null;

  public load(): DbSchema {
    if (this.cache) {
      return this.cache;
    }

    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(fileContent);
        
        // Backward compatibility migration normalization checks
        if (!this.cache!.tickets) {
          this.cache!.tickets = JSON.parse(JSON.stringify(DEFAULT_DB.tickets));
        }
        if (!this.cache!.platformAuditLogs) {
          this.cache!.platformAuditLogs = JSON.parse(JSON.stringify(DEFAULT_DB.platformAuditLogs));
        }
        
        // Ensure companies have plan default metadata keys
        const hasHQ = this.cache!.companies.some(c => c.id === 'comp-platform-hq');
        if (!hasHQ) {
          this.cache!.companies.push({ id: "comp-platform-hq", name: "HQ Platform Operations", createdAt: "2026-05-01T08:00:00Z", subscriptionPlan: "Premium", status: "Active", billingStatus: "Paid" });
        }

        this.cache!.companies.forEach(c => {
          if (!c.subscriptionPlan) c.subscriptionPlan = c.id === 'comp-pharma' ? 'Premium' : 'Business';
          if (!c.status) c.status = 'Active';
          if (!c.billingStatus) c.billingStatus = 'Paid';
        });

        // Ensure SuperAdmin exists in users array
        const hasSuper = this.cache!.users.some(u => u.role === UserRole.SUPER_ADMIN || u.email === "admin@gmail.com");
        if (!hasSuper) {
          this.cache!.users.push({
            id: "usr-superadmin",
            username: "Bekzat (Owner)",
            email: "admin@gmail.com",
            passwordHash: hashPassword("super123"),
            role: UserRole.SUPER_ADMIN,
            companyId: "comp-platform-hq",
            createdAt: "2026-05-01T08:00:00Z"
          });
        }

        this.save();
        return this.cache!;
      }
    } catch (e) {
      console.warn("Could not read database file, restoring defaults:", e);
    }

    // Default to seeded values
    this.cache = JSON.parse(JSON.stringify(DEFAULT_DB));
    this.save();
    return this.cache!;
  }

  public save(): void {
    if (!this.cache) return;
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (e) {
      console.error("Could not write database file:", e);
    }
  }

  // --- QUERY UTILS with multi-tenant filter ---

  public getCompany(id: string): Company | undefined {
    return this.load().companies.find(c => c.id === id);
  }

  public getCompanies(): Company[] {
    return this.load().companies;
  }

  public registerCompany(name: string): Company {
    const db = this.load();
    const id = "comp-" + crypto.randomUUID().substring(0, 8);
    const newComp: Company = { id, name, createdAt: new Date().toISOString() };
    db.companies.push(newComp);
    this.save();
    return newComp;
  }

  // --- Users ---
  public getUsers(companyId: string): User[] {
    return this.load().users.filter(u => u.companyId === companyId);
  }

  public getUserById(id: string): User | undefined {
    return this.load().users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    if (!email) return undefined;
    const cleanEmail = email.trim().toLowerCase();
    return this.load().users.find(u => u.email.trim().toLowerCase() === cleanEmail);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const db = this.load();
    const id = "usr-" + crypto.randomUUID().substring(0, 8);
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    this.save();
    return newUser;
  }

  // --- Products ---
  public getProducts(companyId: string): Product[] {
    return this.load().products.filter(p => p.companyId === companyId);
  }

  public getProductById(id: string, companyId: string): Product | undefined {
    return this.load().products.find(p => p.id === id && p.companyId === companyId);
  }

  public createProduct(prod: Omit<Product, 'id' | 'createdAt'>): Product {
    const db = this.load();
    const id = "prod-" + crypto.randomUUID().substring(0, 8);
    const newProd: Product = {
      ...prod,
      id,
      createdAt: new Date().toISOString()
    };
    db.products.push(newProd);
    this.save();
    return newProd;
  }

  public updateProduct(id: string, companyId: string, updates: Partial<Omit<Product, 'id' | 'companyId' | 'createdAt'>>): Product | null {
    const db = this.load();
    const idx = db.products.findIndex(p => p.id === id && p.companyId === companyId);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates };
    this.save();
    return db.products[idx];
  }

  public deleteProduct(id: string, companyId: string): boolean {
    const db = this.load();
    const countBefore = db.products.length;
    db.products = db.products.filter(p => !(p.id === id && p.companyId === companyId));
    const deleted = db.products.length < countBefore;
    if (deleted) this.save();
    return deleted;
  }

  // --- Expenses ---
  public getExpenses(companyId: string): Expense[] {
    return this.load().expenses.filter(e => e.companyId === companyId);
  }

  public createExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const db = this.load();
    const id = "exp-" + crypto.randomUUID().substring(0, 8);
    const newExp: Expense = {
      ...expense,
      id,
      createdAt: new Date().toISOString()
    };
    db.expenses.push(newExp);
    this.save();
    return newExp;
  }

  public deleteExpense(id: string, companyId: string): boolean {
    const db = this.load();
    const originalLen = db.expenses.length;
    db.expenses = db.expenses.filter(e => !(e.id === id && e.companyId === companyId));
    const deleted = db.expenses.length < originalLen;
    if (deleted) this.save();
    return deleted;
  }

  // --- Customers ---
  public getCustomers(companyId: string): Customer[] {
    return this.load().customers.filter(c => c.companyId === companyId);
  }

  public createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'loyaltyPoints' | 'isVip'>): Customer {
    const db = this.load();
    const id = "cust-" + crypto.randomUUID().substring(0, 8);
    const newCust: Customer = {
      ...customer,
      id,
      loyaltyPoints: 0,
      isVip: false,
      createdAt: new Date().toISOString()
    };
    db.customers.push(newCust);
    this.save();
    return newCust;
  }

  public updateCustomerPoints(id: string, companyId: string, addPoints: number): Customer | null {
    const db = this.load();
    const idx = db.customers.findIndex(c => c.id === id && c.companyId === companyId);
    if (idx === -1) return null;
    const customer = db.customers[idx];
    const newPoints = customer.loyaltyPoints + addPoints;
    db.customers[idx] = {
      ...customer,
      loyaltyPoints: newPoints,
      isVip: newPoints >= 100 // VIP tier at 100 points
    };
    this.save();
    return db.customers[idx];
  }

  public deleteCustomer(id: string, companyId: string): boolean {
    const db = this.load();
    const originalLen = db.customers.length;
    db.customers = db.customers.filter(c => !(c.id === id && c.companyId === companyId));
    const deleted = db.customers.length < originalLen;
    if (deleted) this.save();
    return deleted;
  }

  // --- Employees ---
  public getEmployees(companyId: string): Employee[] {
    return this.load().employees.filter(e => e.companyId === companyId);
  }

  public createEmployee(emp: Omit<Employee, 'id' | 'createdAt'>): Employee {
    const db = this.load();
    const id = "emp-" + crypto.randomUUID().substring(0, 8);
    const newEmp: Employee = {
      ...emp,
      id,
      createdAt: new Date().toISOString()
    };
    db.employees.push(newEmp);
    this.save();
    return newEmp;
  }

  public deleteEmployee(id: string, companyId: string): boolean {
    const db = this.load();
    const originalLen = db.employees.length;
    db.employees = db.employees.filter(e => !(e.id === id && e.companyId === companyId));
    const deleted = db.employees.length < originalLen;
    if (deleted) this.save();
    return deleted;
  }

  public updateEmployeeScore(id: string, companyId: string, increase: number): Employee | null {
    const db = this.load();
    const idx = db.employees.findIndex(e => e.id === id && e.companyId === companyId);
    if (idx === -1) return null;
    const current = db.employees[idx];
    const newScore = Math.min(100, Math.max(0, current.rankingScore + increase));
    db.employees[idx] = { ...current, rankingScore: newScore };
    this.save();
    return db.employees[idx];
  }

  // --- Sales & POS System ---
  public getSales(companyId: string): Sale[] {
    return this.load().sales.filter(s => s.companyId === companyId);
  }

  public getSalesItems(companyId: string, saleId?: string): SaleItem[] {
    let items = this.load().salesItems.filter(si => si.companyId === companyId);
    if (saleId) {
      items = items.filter(si => si.saleId === saleId);
    }
    return items;
  }

  public processCheckout(
    companyId: string,
    cashierId: string,
    cartItems: { productId: string; quantity: number }[],
    customerId: string | null,
    paymentMethod: 'Cash' | 'Card' | 'Mobile'
  ): { sale: Sale; items: SaleItem[] } | null {
    const db = this.load();
    
    // 1. Double check and decrement inventory stock
    let totalAmount = 0;
    let totalCost = 0;
    let totalProfit = 0;
    const transItems: { product: Product; quantity: number }[] = [];

    for (const item of cartItems) {
      const prod = db.products.find(p => p.id === item.productId && p.companyId === companyId);
      if (!prod) {
        throw new Error(`Product not found or access denied: ${item.productId}`);
      }
      if (prod.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stockQuantity}`);
      }
      transItems.push({ product: prod, quantity: item.quantity });
    }

    // Generate Sale ID
    const saleId = "sale-" + crypto.randomUUID().substring(0, 8);
    const saleDate = new Date().toISOString().substring(0, 10);
    const createdItems: SaleItem[] = [];

    // Deduct stock and compile checkout items
    transItems.forEach(({ product, quantity }) => {
      // update db quantity
      product.stockQuantity -= quantity;

      const itemSaleTotal = product.salePrice * quantity;
      const itemCostTotal = product.costPrice * quantity;
      const itemProfit = itemSaleTotal - itemCostTotal;

      totalAmount += itemSaleTotal;
      totalCost += itemCostTotal;
      totalProfit += itemProfit;

      const saleItem: SaleItem = {
        id: "sitem-" + crypto.randomUUID().substring(0, 8),
        saleId,
        productId: product.id,
        quantity,
        salePrice: product.salePrice,
        costPrice: product.costPrice,
        profit: itemProfit,
        companyId
      };
      createdItems.push(saleItem);
      db.salesItems.push(saleItem);
    });

    // 2. Award loyalty points (1 point per whole $10 spent)
    if (customerId) {
      const cust = db.customers.find(c => c.id === customerId && c.companyId === companyId);
      if (cust) {
        const addedPoints = Math.floor(totalAmount / 10);
        cust.loyaltyPoints += addedPoints;
        cust.isVip = cust.loyaltyPoints >= 100;
      }
    }

    // 3. Save the Sale metadata
    const parsedSale: Sale = {
      id: saleId,
      customerId,
      employeeId: cashierId,
      totalAmount: Number(totalAmount.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      paymentMethod,
      companyId,
      createdAt: new Date().toISOString(),
      date: saleDate
    };
    db.sales.push(parsedSale);

    // 4. Update head cashier's ranking score slightly
    const cashierUser = db.users.find(u => u.id === cashierId);
    if (cashierUser) {
      // Find matching employee record by name mapping
      const employeeRecord = db.employees.find(e => 
        e.companyId === companyId && 
        e.name.toLowerCase().includes(cashierUser.username.split(' ')[0].toLowerCase())
      );
      if (employeeRecord) {
        employeeRecord.rankingScore = Math.min(100, employeeRecord.rankingScore + 1);
      }
    }

    this.save();
    return { sale: parsedSale, items: createdItems };
  }

  // --- Audit Logs ---
  public getLogs(companyId: string): AuditLog[] {
    return this.load().auditLogs
      .filter(l => l.companyId === companyId)
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50); // Recent 50
  }

  public createLog(companyId: string, userId: string, username: string, action: string, details: string): void {
    const db = this.load();
    const log: AuditLog = {
      id: "log-" + crypto.randomUUID().substring(0, 8),
      userId,
      username,
      action,
      details,
      companyId,
      createdAt: new Date().toISOString()
    };
    db.auditLogs.push(log);
    this.save();
  }

  // === SUPER ADMIN / SAAS OWNER PLATFORM MANAGEMENT METHODS ===

  public superAdminGetStats(): SuperAdminStats {
    const db = this.load();
    const totalCompanies = db.companies.length;
    
    // An active company has at least 1 sale or 1 product or 1 audit log
    const activeCompanies = db.companies.filter(c => {
      const salesCount = db.sales.filter(s => s.companyId === c.id).length;
      const productsCount = db.products.filter(p => p.companyId === c.id).length;
      return salesCount > 0 || productsCount > 0;
    }).length;

    const totalUsers = db.users.length;
    const totalProducts = db.products.length;
    const totalSales = db.sales.length;

    // Plan MRR rates logic
    let mrr = 0;
    const distributionMap: { [key: string]: number } = { Free: 0, Business: 0, Premium: 0 };
    
    db.companies.forEach(c => {
      const plan = c.subscriptionPlan || 'Free';
      distributionMap[plan] = (distributionMap[plan] || 0) + 1;
      if (plan === 'Business') mrr += 49;
      else if (plan === 'Premium') mrr += 149;
    });

    // Registrations in current month (June 2026 based on mock system context timezone)
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // "2026-06"
    const newRegistrationsThisMonth = db.companies.filter(c => c.createdAt.startsWith(currentMonthPrefix)).length;

    const subscriptionDistribution = Object.keys(distributionMap).map(plan => ({
      plan,
      count: distributionMap[plan]
    }));

    return {
      totalCompanies,
      activeCompanies,
      totalUsers,
      totalProducts,
      totalSales,
      monthlyRecurringRevenue: mrr,
      newRegistrationsThisMonth,
      subscriptionDistribution
    };
  }

  public superAdminGetCompanies(): SuperAdminCompanyData[] {
    const db = this.load();
    return db.companies.map(c => {
      const usersCount = db.users.filter(u => u.companyId === c.id).length;
      const productsCount = db.products.filter(p => p.companyId === c.id).length;
      const sales = db.sales.filter(s => s.companyId === c.id);
      const salesCount = sales.length;

      // Scan dynamic audit logs or checkout logs to identify last activity time
      const compLogs = db.auditLogs.filter(l => l.companyId === c.id);
      let lastActivityDate = c.createdAt;
      if (compLogs.length > 0) {
        const sorted = compLogs.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
        lastActivityDate = sorted[0].createdAt;
      } else if (sales.length > 0) {
        const sortedSales = sales.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
        lastActivityDate = sortedSales[0].createdAt;
      }

      // Identify the registered administrator or first user of this company
      const owner = db.users.find(u => u.companyId === c.id && u.role === UserRole.ADMINISTRATOR) || 
                    db.users.find(u => u.companyId === c.id);
      const ownerName = owner ? owner.username : "N/A";
      const ownerEmail = owner ? owner.email : "N/A";

      return {
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        subscriptionPlan: c.subscriptionPlan || 'Free',
        status: (c.status || 'Active') as 'Active' | 'Suspended',
        billingStatus: (c.billingStatus || 'Paid') as 'Paid' | 'Unpaid' | 'Trial',
        usersCount,
        productsCount,
        salesCount,
        lastActivityDate,
        ownerName,
        ownerEmail
      };
    });
  }

  public superAdminUpdateCompanyPlan(
    id: string, 
    plan: 'Free' | 'Business' | 'Premium',
    status: 'Active' | 'Suspended',
    billingStatus: 'Paid' | 'Unpaid' | 'Trial'
  ): boolean {
    const db = this.load();
    const comp = db.companies.find(c => c.id === id);
    if (!comp) return false;

    const oldPlan = comp.subscriptionPlan || 'Free';
    const oldStatus = comp.status || 'Active';

    comp.subscriptionPlan = plan;
    comp.status = status;
    comp.billingStatus = billingStatus;

    // Track platform log
    this.superAdminCreatePlatformLog(
      "Subscription Modified", 
      `Company '${comp.name}' [ID: ${comp.id}] adjusted from ${oldPlan} (${oldStatus}) to ${plan} (${status})`,
      "admin@gmail.com"
    );

    this.save();
    return true;
  }

  public superAdminDeleteCompany(id: string): boolean {
    const db = this.load();
    const compIdx = db.companies.findIndex(c => c.id === id);
    if (compIdx === -1) return false;

    const compName = db.companies[compIdx].name;

    // Remove corporate metadata
    db.companies.splice(compIdx, 1);

    // Cascade deletion of all workspace-associated entity records
    db.users = db.users.filter(u => u.companyId !== id);
    db.products = db.products.filter(p => p.companyId !== id);
    db.expenses = db.expenses.filter(e => e.companyId !== id);
    db.customers = db.customers.filter(c => c.companyId !== id);
    db.employees = db.employees.filter(e => e.companyId !== id);
    
    // Cascading sales and checking for SaleItems
    const deletedSales = db.sales.filter(s => s.companyId === id);
    const deletedSaleIds = new Set(deletedSales.map(s => s.id));
    db.sales = db.sales.filter(s => s.companyId !== id);
    db.salesItems = db.salesItems.filter(si => !deletedSaleIds.has(si.saleId) && si.companyId !== id);

    db.auditLogs = db.auditLogs.filter(a => a.companyId !== id);
    db.tickets = db.tickets.filter(t => t.companyId !== id);

    this.superAdminCreatePlatformLog(
      "Company Purged",
      `Enterprise workspace '${compName}' [ID: ${id}] and all its user accounts/records were purged from the system.`,
      "admin@gmail.com"
    );

    this.save();
    return true;
  }

  public superAdminGetTickets(): SupportTicket[] {
    return this.load().tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public superAdminReplyTicket(ticketId: string, sender: string, text: string): SupportTicket | null {
    const db = this.load();
    const ticket = db.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    ticket.replies.push({
      sender,
      text,
      createdAt: new Date().toISOString()
    });
    ticket.status = 'Resolved'; // Respond auto-resolves or sets status to Resolved/In Progress

    this.superAdminCreatePlatformLog(
      "Support Ticket Answered",
      `Answered ticket [${ticketId}] regarding '${ticket.subject}' for ${ticket.companyName}`,
      "admin@gmail.com"
    );

    this.save();
    return ticket;
  }

  public superAdminCreateTicket(companyId: string, companyName: string, username: string, category: 'Bug' | 'Feature Request' | 'Billing' | 'General', subject: string, description: string): SupportTicket {
    const db = this.load();
    const id = "tkt-" + crypto.randomUUID().substring(0, 8);
    const newTicket: SupportTicket = {
      id,
      companyId,
      companyName,
      username,
      subject,
      description,
      category,
      status: 'Open',
      createdAt: new Date().toISOString(),
      replies: [
        { sender: "System", text: "Ticket issued and queued for SaaS Platform Operations support.", createdAt: new Date().toISOString() }
      ]
    };
    db.tickets.push(newTicket);
    this.save();
    return newTicket;
  }

  public superAdminGetPlatformLogs(): PlatformAuditLog[] {
    return this.load().platformAuditLogs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public superAdminCreatePlatformLog(action: string, details: string, adminEmail: string): void {
    const db = this.load();
    const id = "p-log-" + crypto.randomUUID().substring(0, 8);
    db.platformAuditLogs.push({
      id,
      action,
      details,
      adminEmail,
      createdAt: new Date().toISOString()
    });
    this.save();
  }
}

export const dbManager = new LocalDatabase();
