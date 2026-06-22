/**
 * Localization translations directory for English, Russian and Kyrgyz.
 */

export type LanguageType = 'en' | 'ru' | 'ky';

export interface TranslationDictionary {
  // Sidebar Tabs
  dashboardTab: string;
  posTab: string;
  inventoryTab: string;
  expensesTab: string;
  crmTab: string;
  employeesTab: string;
  aiTab: string;
  telegramTab: string;
  logoutButton: string;
  currentUserLabel: string;
  
  // App Bar / Headers
  headerDashboard: string;
  headerPOS: string;
  headerInventory: string;
  headerExpenses: string;
  headerCRM: string;
  headerEmployees: string;
  headerAI: string;
  headerTelegram: string;
  headerSubtitle: string;
  connectedStatusLabel: string;
  
  // Dashboard
  welcomeBack: string;
  quickActions: string;
  registerSaleBtn: string;
  addSupplyBtn: string;
  netRevenue: string;
  aggregatedSalesVolume: string;
  opexOverheadLabel: string;
  stockAlertCard: string;
  salesVolumeLabel: string;
  expectedMarginLabel: string;
  lowStockItemsCount: string;
  activeClienteleLoyalty: string;
  salesBreakdownTitle: string;
  operatingCostsTitle: string;
  noSalesRecorded: string;
  noExpensesLogged: string;
  
  // POS System
  posTitleCheckout: string;
  clientWalkIn: string;
  crmLoyaltyAccount: string;
  searchProductPlaceholder: string;
  paymentChannelLabel: string;
  cashLabel: string;
  cardLabel: string;
  mobileLabel: string;
  taxFeesLabel: string;
  totalLedgerAmount: string;
  emptyCartLabel: string;
  addItemsMessage: string;
  paySuccessMessage: string;
  checkoutBtn: string;
  checkoutInProcess: string;
  recentSalesTitle: string;
  transactionCount: string;
  startNewCheckout: string;
  
  // Inventory
  inventoryTitle: string;
  inventorySubtitle: string;
  appendProductBtn: string;
  viewerAccessOnly: string;
  searchProducts: string;
  allCategories: string;
  barcodeSKU: string;
  productLineName: string;
  categoryLabel: string;
  wholesaleUnitPrice: string;
  retailSalePrice: string;
  startingQty: string;
  lowStockSafetyMark: string;
  actionCol: string;
  saveProductBtn: string;
  savingProductBtn: string;
  criticalWarnQty: string;
  noProductsRecorded: string;
  editProductTitle: string;
  deleteProductBtn: string;
  
  // Finance & Expenses
  financeTitle: string;
  financeSubtitle: string;
  logOperationalCost: string;
  expenseCategoryLabel: string;
  expenseAmountLabel: string;
  expenseDateLabel: string;
  expenseDescLabel: string;
  commitExpenseEntry: string;
  submittingEntry: string;
  noExpensesTable: string;
  operationalCategoryFilter: string;
  utilitiesLabel: string;
  rentLabel: string;
  salariesLabel: string;
  suppliesLabel: string;
  otherLabel: string;
  
  // CRM Loyalty
  crmDatabaseTitle: string;
  crmDatabaseSubtitle: string;
  loyalistName: string;
  phoneNumber: string;
  emailAddress: string;
  vipBadge: string;
  vipTierBadge: string;
  standardClientBadge: string;
  noCustomersTable: string;
  fastEnrollCustomer: string;
  clientFullName: string;
  phoneContact: string;
  emailContact: string;
  optionalEmail: string;
  pointsCoefficientText: string;
  saveCrmBtn: string;
  addingCustomerStatus: string;
  customerRegisteredSuccess: string;
  
  // Employees Leaderboard
  employeesTitle: string;
  employeesSubtitle: string;
  activeCrewBadge: string;
  wageCostLabel: string;
  multiplierLabel: string;
  noStaffRecorded: string;
  recruitCrewMember: string;
  crewFullName: string;
  primaryPhone: string;
  wageSalaryMonth: string;
  efficiencyScore: string;
  hireCrewBtn: string;
  addingEmployeeStatus: string;
  crewEnrolledSuccess: string;
  noRecruitmentPermissions: string;
  
  // AI Copilot
  aiCopilotTitle: string;
  aiCopilotSubtitle: string;
  regenerateAnalysisBtn: string;
  regeneratingAnalysisStatus: string;
  connectingApiStatus: string;
  connectingApiDesc: string;
  liveGenStandbyTitle: string;
  liveGenStandbyDesc: string;
  howThisWorksTitle: string;
  howThisWorksDesc: string;
  standbyIntelligenceTitle: string;
  standbyIntelligenceDesc: string;
  clickRegeneratePrompt: string;
  
  // Telegram Integrator
  telegramTitle: string;
  telegramSubtitle: string;
  botConnDetails: string;
  connectedState: string;
  broadcastTriggerTitle: string;
  dailyMarginReportLabel: string;
  lowStockWarningsLabel: string;
  excessiveCostsLabel: string;
  triggerWebhookTestBtn: string;
  triggeringWebhooksStatus: string;
  simulatedPhoneScreenTitle: string;
  simulatedStatusPlaceholder: string;
  simulatorWebhookInfo: string;
  
  // Auth Controls
  loginHeader: string;
  loginSubtitle: string;
  workEmailPlaceholder: string;
  passcodePlaceholder: string;
  signinButton: string;
  businessWorkspaceName: string;
  choosePasscode: string;
  bootstrapWorkspaceBtn: string;
  bootstrapWorkspaceInProcess: string;
  quickEvaluationTitle: string;
  quickEvaluationOption: string;
  quickEvaluationRole: string;
  wantConfigureSeparate: string;
  createDynamicTenant: string;
  alreadyRegisteredCompany: string;
  logOnTerminal: string;

  // Super Admin keys
  superAdminTab: string;
  superAdminHeader: string;
  superAdminLoading: string;
  superAdminOwnerAccess: string;
  superAdminPrivacyNotice: string;
  superAdminSyncBtn: string;
  superAdminTabOverview: string;
  superAdminTabMonitoring: string;
  superAdminTabAnalytics: string;
  superAdminTabSupport: string;
  superAdminTabHealth: string;
  superAdminTabAudit: string;
}

export const translations: Record<LanguageType, TranslationDictionary> = {
  en: {
    dashboardTab: "Home",
    posTab: "Sales",
    inventoryTab: "Products",
    expensesTab: "Expenses",
    crmTab: "Customers",
    employeesTab: "Employees",
    aiTab: "Reports",
    telegramTab: "Settings",
    logoutButton: "Exit Platform",
    currentUserLabel: "Who is using this today",

    headerDashboard: "Your Business Home",
    headerPOS: "Sell / Cash Terminal",
    headerInventory: "Your Products List",
    headerExpenses: "Store Expenses List",
    headerCRM: "Your Customers List",
    headerEmployees: "Your Employees List",
    headerAI: "Simple Business Guide & AI Reports",
    headerTelegram: "Automatic Alerts & Notification Settings",
    headerSubtitle: "Helping you manage, calculate, and coordinate your store seamlessly",
    connectedStatusLabel: "System Status: Online & Secure",

    welcomeBack: "Welcome back",
    quickActions: "What would you like to do next?",
    registerSaleBtn: "⭐ Open Cashier to Sell Goods",
    addSupplyBtn: "➕ Add a New Product",
    netRevenue: "Net money left (Profit)",
    aggregatedSalesVolume: "Total earnings from all cashier sales",
    opexOverheadLabel: "Regular bills, materials, or rents paid out",
    stockAlertCard: "These items are low in stock and need a refill",
    salesVolumeLabel: "Money Earned (Revenue)",
    expectedMarginLabel: "Estimated Profit",
    lowStockItemsCount: "Items Running Low",
    activeClienteleLoyalty: "Customers Registered",
    salesBreakdownTitle: "Daily Income Checkout Share",
    operatingCostsTitle: "Where your money is spent",
    noSalesRecorded: "You haven't made any sales today yet. Open the cashier tab to start!",
    noExpensesLogged: "No expenses logged today.",

    posTitleCheckout: "POS Checkout terminal",
    clientWalkIn: "Walk-in client (Standard checkout)",
    crmLoyaltyAccount: "Associate CRM Loyalist Card account",
    searchProductPlaceholder: "Search inventory products by name, category or barcode SKU...",
    paymentChannelLabel: "Choose Payment Channel",
    cashLabel: "Cash Currency",
    cardLabel: "Credit Card Terminal",
    mobileLabel: "Contactless / Mobile QR",
    taxFeesLabel: "Calculated Tax & processing fees (approximate)",
    totalLedgerAmount: "Total Checkout Ledger Amount",
    emptyCartLabel: "Cart is currently unoccupied.",
    addItemsMessage: "Click on inventory products to the left to populate checkouts.",
    paySuccessMessage: "Receipt recorded into system logs successfully!",
    checkoutBtn: "Complete POS Checkout transaction",
    checkoutInProcess: "Registering transactions...",
    recentSalesTitle: "Workspace POS Transaction Roll",
    transactionCount: "Today's ledger records count",
    startNewCheckout: "Initiate next POS Checkout",

    inventoryTitle: "Workspace Inventory Hub",
    inventorySubtitle: "Add, track and modify product lines. Critical low stocks will alert headers automatically.",
    appendProductBtn: "Append New Product Line",
    viewerAccessOnly: "Your access role is strict viewer. Upgrades needed to edit items catalog.",
    searchProducts: "Search inventory list...",
    allCategories: "All Catalog Categories",
    barcodeSKU: "Barcode / SKU Code",
    productLineName: "Product Line Name",
    categoryLabel: "Category Group",
    wholesaleUnitPrice: "Wholesale Unit Cost ($)",
    retailSalePrice: "Retail Sale Price ($)",
    startingQty: "Starting Stock Quantity",
    lowStockSafetyMark: "Low Stock Safety Threshold",
    actionCol: "Workspace action",
    saveProductBtn: "Save Catalog Item",
    savingProductBtn: "Saving items record...",
    criticalWarnQty: "Critical Alert Limit",
    noProductsRecorded: "No products stored. Select 'Append New Product Line' to get started!",
    editProductTitle: "Modify Selected Catalog Line",
    deleteProductBtn: "Archive Product",

    financeTitle: "Operational Bills & OPEX ledger",
    financeSubtitle: "Logged business overhead outlays, utilities, rental fees, and worker salaries.",
    logOperationalCost: "Log Active Business Expenditure",
    expenseCategoryLabel: "Operational Outlay Category",
    expenseAmountLabel: "Amount Spent ($)",
    expenseDateLabel: "Transaction Log Date",
    expenseDescLabel: "Expenditure description, vendor or invoice text",
    commitExpenseEntry: "Log Operations Cost",
    submittingEntry: "Filing ledger entry...",
    noExpensesTable: "No operational overhead cost lines logged onto system registry.",
    operationalCategoryFilter: "Operational Category Filters",
    utilitiesLabel: "Utilities (Water, Electricity, Gas)",
    rentLabel: "Rent & Real Estate",
    salariesLabel: "Employee Wage Salaries",
    suppliesLabel: "Raw Material & Supplies",
    otherLabel: "Other Miscellaneous",

    crmDatabaseTitle: "CRM Clientele Loyalty Database",
    crmDatabaseSubtitle: "Track customer purchases, outstanding loyalty points, and VIP enrollment tiers.",
    loyalistName: "Loyalist Name",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    vipBadge: "SaaS VIP Badge",
    vipTierBadge: "VIP TIER",
    standardClientBadge: "Standard Client",
    noCustomersTable: "No customers enrolled onto workspace registries yet.",
    fastEnrollCustomer: "Fast-Enroll Customer",
    clientFullName: "Client Full Name",
    phoneContact: "Phone number contact",
    emailContact: "Email address",
    optionalEmail: "Email address (Optional)",
    pointsCoefficientText: "Auto registers loyalty coefficients. Customers acquire points based on checkout size. Reach 100 points to unlock special VIP Status.",
    saveCrmBtn: "Save CRM Loyalty File",
    addingCustomerStatus: "Adding Customer profile...",
    customerRegisteredSuccess: "Customer registered into CRM registry!",

    employeesTitle: "Staff Performance Ranking Leaderboard",
    employeesSubtitle: "View active employee wage cards and efficiency multipliers based on POS checkout audits.",
    activeCrewBadge: "Active Crew",
    wageCostLabel: "Wage cost",
    multiplierLabel: "Multiplier",
    noStaffRecorded: "No employees recorded. Register a crew member on the right page panel!",
    recruitCrewMember: "Recruit Crew Member",
    crewFullName: "Crew Full Name",
    primaryPhone: "Primary Telephone contact",
    wageSalaryMonth: "Wage salary ($ / Month)",
    efficiencyScore: "Efficiency Ranking score (Starting)",
    hireCrewBtn: "Hire Crew Member",
    addingEmployeeStatus: "Adding Employee record...",
    crewEnrolledSuccess: "Crew member enrolled onto ledger lists successfully!",
    noRecruitmentPermissions: "Your current role excludes recruitment permissions. (Admin level required).",

    aiCopilotTitle: "Gemini SaaS Business Copilot",
    aiCopilotSubtitle: "Generative restructuring suggestions and restock multipliers based on real-time tenant context.",
    regenerateAnalysisBtn: "Regenerate Analysis",
    regeneratingAnalysisStatus: "Refreshing Advisor Reports...",
    connectingApiStatus: "Connecting to Google Gemini API...",
    connectingApiDesc: "Analyzing catalog stock balances, operational cost expenditures, and checkout metrics to compile your advisory reports.",
    liveGenStandbyTitle: "Live Generative Analysis is on Standby",
    liveGenStandbyDesc: "To activate live generative analysis with state-of-the-art model inference on your latest records, go to Settings and configure an active GEMINI_API_KEY environment parameter.",
    howThisWorksTitle: "How this works:",
    howThisWorksDesc: "Your business records (stock counts, checkout ledger items, logged material costs) are securely evaluated on the server-side to generate context-specific restructuring workflows. This data is fully sandboxed.",
    standbyIntelligenceTitle: "Rule-Based Business Intelligence (Standby Mode)",
    standbyIntelligenceDesc: "Below is your instant, automated, rule-based business intelligence summary compiled securely from local inventory metadata:",
    clickRegeneratePrompt: "Click \"Regenerate Analysis\" to trigger AI Restock suggestions.",

    telegramTitle: "Automated Telegram Bot Integrator",
    telegramSubtitle: "Subscribe for automated store balance highlights, low-stock notifications and daily revenue briefings.",
    botConnDetails: "Bot Connection details",
    connectedState: "Connected",
    broadcastTriggerTitle: "Broadcast Trigger Settings",
    dailyMarginReportLabel: "Daily Sales & margin report",
    lowStockWarningsLabel: "Low stock threshold warnings",
    excessiveCostsLabel: "Excessive costs alerting",
    triggerWebhookTestBtn: "Trigger Telegram Push Test",
    triggeringWebhooksStatus: "Transmitting payload...",
    simulatedPhoneScreenTitle: "Simulated Phone Display Screen",
    simulatedStatusPlaceholder: "Subscribed workspace data ready. Click \"Trigger Telegram Push Test\" to execute webhook payloads!",
    simulatorWebhookInfo: "This simulator triggers exact server side webhook builders mapping products list balances and today's total margins. Firing simulates live REST web hook protocols instantly.",

    loginHeader: "SaaS Business Workspace Suite",
    loginSubtitle: "Secure Multi-tenant Ledger sheets for Cafes, Retail Shops, and local Warehouse operations.",
    workEmailPlaceholder: "e.g. cafe_admin@example.com",
    passcodePlaceholder: "Minimum 6 characters",
    signinButton: "Sign in to Terminal",
    businessWorkspaceName: "Business Workspace Name",
    choosePasscode: "Choose Passcode",
    bootstrapWorkspaceBtn: "Bootstrap Workspace",
    bootstrapWorkspaceInProcess: "Bootstrapping...",
    quickEvaluationTitle: "1-Click Evaluation fast login keys",
    quickEvaluationOption: "Fast login option",
    quickEvaluationRole: "Role",
    wantConfigureSeparate: "Want to configure a separate business?",
    createDynamicTenant: "Create dynamic tenant workspace",
    alreadyRegisteredCompany: "Already registered your company?",
    logOnTerminal: "Log on to terminal",

    superAdminTab: "Super Admin Panel",
    superAdminHeader: "Super Admin Overview",
    superAdminLoading: "Loading telemetry and compliance reporting metrics...",
    superAdminOwnerAccess: "Owner Access",
    superAdminPrivacyNotice: "Strictly restricted to Business Control platform creator. This panel complies with strict GDPR principles. Individual customer rosters, notes, personal employee addresses, and transaction listings are completely isolated from this screen.",
    superAdminSyncBtn: "Synchronize System Data",
    superAdminTabOverview: "Platform Overview",
    superAdminTabMonitoring: "Company Monitoring",
    superAdminTabAnalytics: "Growth & Analytics",
    superAdminTabSupport: "Support center",
    superAdminTabHealth: "System Health",
    superAdminTabAudit: "Audit Log & Security"
  },
  ru: {
    dashboardTab: "Главная",
    posTab: "Продажи",
    inventoryTab: "Товары",
    expensesTab: "Расходы",
    crmTab: "Клиенты",
    employeesTab: "Сотрудники",
    aiTab: "Отчеты",
    telegramTab: "Настройки",
    logoutButton: "Выйти из системы",
    currentUserLabel: "Кто сейчас работает в системе",

    headerDashboard: "Главная страница вашего бизнеса",
    headerPOS: "Регистрация продаж",
    headerInventory: "Ват список ваших товаров",
    headerExpenses: "Расходы и счета магазина",
    headerCRM: "Ваша база клиентов",
    headerEmployees: "Ваши сотрудники",
    headerAI: "Простые руководства и ИИ-отчеты",
    headerTelegram: "Автоматические оповещения и настройки",
    headerSubtitle: "Помогает легко вести учет, считать прибыль и управлять магазином без подготовки",
    connectedStatusLabel: "Состояние системы: Онлайн и в безопасности",

    welcomeBack: "Добро пожаловать",
    quickActions: "Что вы хотите сделать дальше?",
    registerSaleBtn: "⭐ Открыть кассу для продажи товара",
    addSupplyBtn: "➕ Добавить новый товар в каталог",
    netRevenue: "Чистая прибыль (Оставшиеся деньги)",
    aggregatedSalesVolume: "Общая сумма от всех продаж на кассе",
    opexOverheadLabel: "Налоги, аренда, зарплаты и прочие траты",
    stockAlertCard: "Эти товары заканчиваются и требуют закупки",
    salesVolumeLabel: "Заработано денег (Выручка)",
    expectedMarginLabel: "Ожидаемая прибыль",
    lowStockItemsCount: "Заканчивающиеся товары",
    activeClienteleLoyalty: "Зарегистрировано клиентов",
    salesBreakdownTitle: "Доля доходов по категориям",
    operatingCostsTitle: "На что тратятся ваши деньги",
    noSalesRecorded: "Сегодня еще не было продаж. Откройте вкладку Касса / Продажи, чтобы начать!",
    noExpensesLogged: "Сегодня еще не было расходов.",

    posTitleCheckout: "Кассовый терминал оформления заказов",
    clientWalkIn: "Обычный покупатель (Без бонусов)",
    crmLoyaltyAccount: "Привязать карту лояльности CRM",
    searchProductPlaceholder: "Ищите товары по названию, категории или штрихкоду SKU...",
    paymentChannelLabel: "Выберите способ оплаты",
    cashLabel: "Наличные средства",
    cardLabel: "Платежный терминал (Карта)",
    mobileLabel: "Бесконтактный QR-платеж",
    taxFeesLabel: "Приблизительные налоги и сборы системы",
    totalLedgerAmount: "Итого к оплате на кассе",
    emptyCartLabel: "Ваша корзина в данный момент пуста.",
    addItemsMessage: "Нажмите на товары из каталога слева, чтобы наполнить чек.",
    paySuccessMessage: "Чек успешно зарегистрирован в системном журнале!",
    checkoutBtn: "Оформить и провести покупку",
    checkoutInProcess: "Регистрация транзакции...",
    recentSalesTitle: "Лента последних транзакций POS",
    transactionCount: "Записей в реестре за сегодня",
    startNewCheckout: "Начать новое оформление",

    inventoryTitle: "Каталог и учет запасов склада",
    inventorySubtitle: "Добавляйте, отслеживайте и редактируйте позиции товаров. Предупреждения о низком количестве выводятся автоматически на панель.",
    appendProductBtn: "Добавить новую позицию товара",
    viewerAccessOnly: "Ваша роль ограничена только просмотром. Требуется повышение прав для добавления товаров.",
    searchProducts: "Искать товары в каталоге...",
    allCategories: "Все категории каталога",
    barcodeSKU: "Штрихкод / SKU код",
    productLineName: "Наименование товара",
    categoryLabel: "Группа категорий",
    wholesaleUnitPrice: "Оптовая цена закупки ($)",
    retailSalePrice: "Розничная цена продажи ($)",
    startingQty: "Стартовое количество на складе",
    lowStockSafetyMark: "Порог критического остатка",
    actionCol: "Действие",
    saveProductBtn: "Сохранить товар",
    savingProductBtn: "Сохранение записи товара...",
    criticalWarnQty: "Порог предупреждения",
    noProductsRecorded: "Нет товаров на складе. Нажмите 'Добавить новую позицию товара', чтобы начать!",
    editProductTitle: "Редактировать выбранную позицию каталога",
    deleteProductBtn: "Архивировать товар",

    financeTitle: "Учет операционных платежей и расходов",
    financeSubtitle: "Зафиксированные накладные расходы бизнеса, коммунальные услуги, арендная плата и заработные платы сотрудников.",
    logOperationalCost: "Зафиксировать операционный расход",
    expenseCategoryLabel: "Категория расходов",
    expenseAmountLabel: "Потраченная сумма ($)",
    expenseDateLabel: "Дата проводки расхода",
    expenseDescLabel: "Описание расходов, поставщик или номер счета-фактуры",
    commitExpenseEntry: "Внести расход в реестр",
    submittingEntry: "Внесение записи...",
    noExpensesTable: "В реестре системы пока нет записей о накладных расходах.",
    operationalCategoryFilter: "Фильтры по категориям расходов",
    utilitiesLabel: "Коммунальные услуги (Вода, Свет, Газ)",
    rentLabel: "Аренда и недвижимость",
    salariesLabel: "Заработная плата сотрудников",
    suppliesLabel: "Сырье и расходные материалы",
    otherLabel: "Прочие расходы",

    crmDatabaseTitle: "CRM-База лояльности клиентов",
    crmDatabaseSubtitle: "Отслеживайте объемы покупок клиентов, остатки бонусных баллов и статусы VIP-уровней.",
    loyalistName: "Имя клиента",
    phoneNumber: "Номер телефона",
    emailAddress: "Электронная почта",
    vipBadge: "Статус в SaaS",
    vipTierBadge: "VIP УРОВЕНЬ",
    standardClientBadge: "Обычный клиент",
    noCustomersTable: "В реестре CRM еще не зарегистрировано клиентов лояльности.",
    fastEnrollCustomer: "Быстрая регистрация клиента",
    clientFullName: "Полное имя клиента",
    phoneContact: "Контактный номер телефона",
    emailContact: "Адрес эл. почты",
    optionalEmail: "Адрес эл. почты (Опционально)",
    pointsCoefficientText: "Система автоматически начисляет баллы лояльности. Покупатели получают баллы на основе размера чека. Наберите 100 баллов, чтобы активировать статус VIP.",
    saveCrmBtn: "Зарегистрировать в CRM",
    addingCustomerStatus: "Регистрация профиля в CRM...",
    customerRegisteredSuccess: "Клиент успешно зарегистрирован в реестре CRM!",

    employeesTitle: "Таблица эффективности сотрудников",
    employeesSubtitle: "Просматривайте зарплатные карты персонала и коэффициенты эффективности по результатам кассовых аудитов.",
    activeCrewBadge: "Активный штат",
    wageCostLabel: "Ставка оклада",
    multiplierLabel: "Множитель",
    noStaffRecorded: "Персонал не зарегистрирован. Оформите сотрудника на правой панели!",
    recruitCrewMember: "Принять сотрудника в штат",
    crewFullName: "Полное имя сотрудника",
    primaryPhone: "Основной телефон для связи",
    wageSalaryMonth: "Размер оклада ($ / Месяц)",
    efficiencyScore: "Стартовый балл эффективности",
    hireCrewBtn: "Принять в команду",
    addingEmployeeStatus: "Добавление записи сотрудника...",
    crewEnrolledSuccess: "Сотрудник успешно добавлен в зарплатную ведомость!",
    noRecruitmentPermissions: "Ваша текущая роль не позволяет нанимать персонал. (Требуется уровень Администратора).",

    aiCopilotTitle: "Ассистент на базе Google Gemini AI",
    aiCopilotSubtitle: "Генеративные предложения по оптимизации бизнеса и закупкам на основе ваших показателей.",
    regenerateAnalysisBtn: "Запустить новый анализ",
    regeneratingAnalysisStatus: "Обновление консультационных отчетов...",
    connectingApiStatus: "Подключение к Google Gemini API...",
    connectingApiDesc: "Анализируем остатки на складе, расходы компании и кассовые метрики для компиляции подробных отчетов.",
    liveGenStandbyTitle: "Генеративный анализ в режиме ожидания",
    liveGenStandbyDesc: "Для активации живого бизнес-анализа с помощью передовых моделей Gemini по вашим данным, зайдите в Настройки и задайте активный API-ключ GEMINI_API_KEY.",
    howThisWorksTitle: "Принцип работы ассистента:",
    howThisWorksDesc: "Ваши бизнес-показатели (остатки товаров, чеки продаж на кассе, зафиксированные издержки) безопасно оцениваются на сервере для выявления точек роста. Ваши данные полностью изолированы.",
    standbyIntelligenceTitle: "Шаблонный бизнес-анализ (Режим ожидания ключа AI)",
    standbyIntelligenceDesc: "Ниже представлен моментальный сводный отчет по вашим данным на основе встроенных алгоритмов:",
    clickRegeneratePrompt: "Нажмите кнопку \"Запустить новый анализ\" для генерации авто-рекомендаций по закупкам.",

    telegramTitle: "Интегратор Telegram-оповещений",
    telegramSubtitle: "Подпишитесь на уведомления о критических остатках, ежедневной прибыли и измененияхOPEX расходов.",
    botConnDetails: "Детали подключения Telegram-бота",
    connectedState: "Подключено",
    broadcastTriggerTitle: "Настройки триггеров рассылки",
    dailyMarginReportLabel: "Ежедневный финансовый отчет",
    lowStockWarningsLabel: "Уведомления о дефиците товаров",
    excessiveCostsLabel: "Оповещения о росте накладных расходов",
    triggerWebhookTestBtn: "Проверить отправку (Тест)",
    triggeringWebhooksStatus: "Передача тестового пакета...",
    simulatedPhoneScreenTitle: "Симулируемый экран смартфона",
    simulatedStatusPlaceholder: "Данные вашей компании готовы. Нажмите кнопку \"Проверить отправку (Тест)\" для имитации рассылки!",
    simulatorWebhookInfo: "Данный симулятор вызывает оригинальный серверный обработчик для компоновки отчета. Отправка имитирует передачу REST-запросов боту в реальном времени.",

    loginHeader: "SaaS Система Управления Бизнесом",
    loginSubtitle: "Защищенные мультитенантные реестры для кафе, магазинов розничной торговли и складов.",
    workEmailPlaceholder: "Например: cafe_admin@example.com",
    passcodePlaceholder: "Минимум 6 символов",
    signinButton: "Войти в систему",
    businessWorkspaceName: "Наименование компании / Терминала",
    choosePasscode: "Придумайте пароль для доступа",
    bootstrapWorkspaceBtn: "Запустить рабочую среду",
    bootstrapWorkspaceInProcess: "Создание рабочей среды...",
    quickEvaluationTitle: "Вход в 1 клик для тестирования",
    quickEvaluationOption: "Быстрый тестовый аккаунт",
    quickEvaluationRole: "Роль в системе",
    wantConfigureSeparate: "Хотите зарегистрировать новую компанию?",
    createDynamicTenant: "Создать новый изолированный терминал",
    alreadyRegisteredCompany: "Ваша компания уже зарегистрирована?",
    logOnTerminal: "Войти под своими учетными данными",

    superAdminTab: "Панель владельца",
    superAdminHeader: "Обзор Суперадмина",
    superAdminLoading: "Загрузка телеметрии и показателей соответствия...",
    superAdminOwnerAccess: "Доступ Владельца",
    superAdminPrivacyNotice: "Строго ограничено создателем платформы Business Control. Эта панель спроектирована по строгим правилам приватности (GDPR). Списки клиентов, личные заметки, адреса сотрудников и детали транзакций полностью недоступны здесь.",
    superAdminSyncBtn: "Синхронизировать данные системы",
    superAdminTabOverview: "Обзор платформы",
    superAdminTabMonitoring: "Мониторинг компаний",
    superAdminTabAnalytics: "Аналитика и рост",
    superAdminTabSupport: "Служба поддержки",
    superAdminTabHealth: "Здоровье системы",
    superAdminTabAudit: "Безопасность и Аудит"
  },
  ky: {
    dashboardTab: "Башкы бет",
    posTab: "Сатуулар",
    inventoryTab: "Товарлор",
    expensesTab: "Чыгымдар",
    crmTab: "Кардарлар",
    employeesTab: "Кызматкерлер",
    aiTab: "Эсептер",
    telegramTab: "Орнотуулар",
    logoutButton: "Системадан чыгуу",
    currentUserLabel: "Учурда ким иштеп жатат",

    headerDashboard: "Сиздиннестин башкы барагы",
    headerPOS: "Сатууларды каттоо",
    headerInventory: "Сиздин товарлардын тизмеси",
    headerExpenses: "Дүкөндүн чыгымдары жана эсептери",
    headerCRM: "Кардарларыңыздын тизмеси",
    headerEmployees: "Кызматкерлериңиз",
    headerAI: "Жөнөкөй колдонмолор жана ИИ-отчеттор",
    headerTelegram: "Автоматтык билдирүүлөр жана орнотуулар",
    headerSubtitle: "Сизге дүкөндү оңой башкарууга, пайданы эсептөөгө жана ишти туура уюштурууга жардам берет",
    connectedStatusLabel: "Статус: Онлайн жана коопсуз",

    welcomeBack: "Кош келиңиз",
    quickActions: "Андан ары эмне кылгыңыз келет?",
    registerSaleBtn: "⭐ Товар сатуу үчүн кассаны ачуу",
    addSupplyBtn: "➕ Каталогго жаңы товар кошуу",
    netRevenue: "Таза киреше (Калган акча)",
    aggregatedSalesVolume: "Кассадагы жалпы сатуулардан түшкөн акча",
    opexOverheadLabel: "Ижара, айлыктар, салыктар жана башка чыгымдар",
    stockAlertCard: "Бул товарлар азайып калды, сатып алуу керек",
    salesVolumeLabel: "Түшкөн акча (Выручка)",
    expectedMarginLabel: "Божомолдонгон таза пайда",
    lowStockItemsCount: "Азайып калган товарлар",
    activeClienteleLoyalty: "Катталган кардарлар",
    salesBreakdownTitle: "Категориялар боюнча киреше үлүшү",
    operatingCostsTitle: "Акчаңыз кайда жумшалат",
    noSalesRecorded: "Бүгүн сатуулар боло элек. Баштоо үчүн Сатуулар же Касса барагын ачыңыз!",
    noExpensesLogged: "Бүгүн чыгымдар боло элек.",

    posTitleCheckout: "POS кассалык тейлөө терминалы",
    clientWalkIn: "Катардагы сатып алуучу (Бонуссуз)",
    crmLoyaltyAccount: "CRM Кардар лоялдуулук картасын кошуу",
    searchProductPlaceholder: "Тизмедеги товарларды аты, категориясы же SKU штрихкоду боюнча издеңиз...",
    paymentChannelLabel: "Төлөө ыкмасын тандаңыз",
    cashLabel: "Накталай акча",
    cardLabel: "Төлөм терминалы (Карта)",
    mobileLabel: "Байланышсыз QR-төлөм",
    taxFeesLabel: "Системанын болжолдуу салыктары жана жыйымдары",
    totalLedgerAmount: "Кассада төлөнүүчү жалпы сумма",
    emptyCartLabel: "Сагаңыз бош турат.",
    addItemsMessage: "Кассалык чекти толтуруу үчүн сол тараптагы товарларды басыңыз.",
    paySuccessMessage: "Чек системанын журналына ийгиликтүү катталды!",
    checkoutBtn: "Товарды сатууну ишке ашыруу",
    checkoutInProcess: "Транзакция катталууда...",
    recentSalesTitle: "Акыркы POS транзакциялардын лентасы",
    transactionCount: "Бүгүнкү реестрдеги жазуулар саны",
    startNewCheckout: "Жаңы чек ачуу",

    inventoryTitle: "Кампа каталогу жана запастарды эсепке алуу",
    inventorySubtitle: "Жаңы позицияларды кошуңуз, маалыматтарды көзөмөлдөңүз жана өзгөртүңүз. Критикалык калдыктар панелге автоматтык түрдө жарыяланат.",
    appendProductBtn: "Каталогго жаңы товар кошуу",
    viewerAccessOnly: "Сиздин ролуңуз көрүү менен гана чектелген. Товар кошуу үчүн администратордун уруксаты керек.",
    searchProducts: "Каталогдон товарларды издөө...",
    allCategories: "Бардык каталог категориялары",
    barcodeSKU: "Штрихкод / SKU код",
    productLineName: "Товардын аталышы",
    categoryLabel: "Категориялар тобу",
    wholesaleUnitPrice: "Дүң баасы закупка ($)",
    retailSalePrice: "Чекене сатуу баасы ($)",
    startingQty: "Кампа башындагы саны",
    lowStockSafetyMark: "Критикалык калдык босогосу",
    actionCol: "Иш-аракеттер",
    saveProductBtn: "Товарды сактоо",
    savingProductBtn: "Жазуу кампага сакталууда...",
    criticalWarnQty: "Эскертүү босогосу",
    noProductsRecorded: "Кампада товарлар жок. Баштоо үчүн 'Каталогго жаңы товар кошуу' баскычын басыңыз!",
    editProductTitle: "Тандалган товарды редакциялоо",
    deleteProductBtn: "Товарды архивдөө",

    financeTitle: "Операциялык төлөмдөр жана чыгымдарды эсепке алуу",
    financeSubtitle: "Катталган бизнес чыгымдары, коммуналдык кызматтар, ижара акысы жана кызматкерлердин эмгек акысы.",
    logOperationalCost: "Операциялык чыгымды каттоо",
    expenseCategoryLabel: "Чыгымдар категориясы",
    expenseAmountLabel: "Жумшалган сумма ($)",
    expenseDateLabel: "Чыгым катталган күн",
    expenseDescLabel: "Чыгымдардын сүрөттөлүшү, жеткирүүчү же эсеп-дүмүрчөк номери",
    commitExpenseEntry: "Чыгымды реестрге киргизүү",
    submittingEntry: "Жазуу киргизилүүдө...",
    noExpensesTable: "Системанын реестринде операциялык чыгымдар боюнча жазуулар жок.",
    operationalCategoryFilter: "Чыгымдар категориясынын чыпкалары",
    utilitiesLabel: "Коммуналдык кызматтар (Суу, Свет, Газ)",
    rentLabel: "Ижара жана кыймылсыз мүлк",
    salariesLabel: "Кызматкерлердин эмгек акысы",
    suppliesLabel: "Сырьё жана чыгымдалуучу материалдар",
    otherLabel: "Башка чыгымдар",

    crmDatabaseTitle: "CRM Кардарлар базасы жана лоялдуулук",
    crmDatabaseSubtitle: "Кардарлардын сатып алуу көлөмдөрүн, лоялдуулук упайларын жана VIP деңгээлдерин көзөмөлдөңүз.",
    loyalistName: "Кардардын аты-жөнү",
    phoneNumber: "Телефон номери",
    emailAddress: "Электрондук почта",
    vipBadge: "SaaS VIP Статусу",
    vipTierBadge: "VIP ДЕҢГЭЭЛ",
    standardClientBadge: "Кадимки кардар",
    noCustomersTable: "CRM реестринде кардарлар каттала элек.",
    fastEnrollCustomer: "Кардарды тез арада каттоо",
    clientFullName: "Кардардын толук аты-жөнү",
    phoneContact: "Байланыш телефон номери",
    emailContact: "Эл. почта дареги",
    optionalEmail: "Эл. почта дареги (Милдеттүү эмес)",
    pointsCoefficientText: "Система лоялдуулук упайларын автоматтык түрдө кошот. Сатып алуучу упайларды чектин өлчөмүнө жараша алат. 100 упайга жеткенде VIP статус берилет.",
    saveCrmBtn: "Кардарды каттоого алуу",
    addingCustomerStatus: "Профиль CRMге жазылууда...",
    customerRegisteredSuccess: "Кардар CRM реестрине ийгиликтүү кошулду!",

    employeesTitle: "Кызматкерлердин натыйжалуулук рейтинги",
    employeesSubtitle: "Кассалык аудиттин жыйынтыгы боюнча кызматкерлердин таблицасын жана коэффициенттерин көрүңүз.",
    activeCrewBadge: "Команда курамы",
    wageCostLabel: "Айлык ставкасы",
    multiplierLabel: "Множитель",
    noStaffRecorded: "Кызматкерлер каттала элек. Кызматкерди оң жактагы панелден каттаңыз!",
    recruitCrewMember: "Жаңы кызматкерди кабыл алуу",
    crewFullName: "Кызматкердин толук аты-жөнү",
    primaryPhone: "Байланыш телефон номери",
    wageSalaryMonth: "Айлык көлөмү ($ / Ай)",
    efficiencyScore: "Баштапкы натыйжалуулук упайы",
    hireCrewBtn: "Командага кошуу",
    addingEmployeeStatus: "Кызматкер катталууда...",
    crewEnrolledSuccess: "Кызматкер ийгиликтүү айлык ведомостуна кошулду!",
    noRecruitmentPermissions: "Сурам четке кагылды. Кызматкер алуу уруксатыңыз жок (Администратор деңгээли керек).",

    aiCopilotTitle: "Google Gemini AI негизиндеги ассистент",
    aiCopilotSubtitle: "Сиздин маалыматтардын негизинде бизнести оптималдаштыруу боюнча генеративдик сунуштар.",
    regenerateAnalysisBtn: "Жаңы талдоону баштоо",
    regeneratingAnalysisStatus: "Консультациялык отчеттор жаңыланууда...",
    connectingApiStatus: "Google Gemini API кызматына туташуу...",
    connectingApiDesc: "Маалыматтарды толук талдоо жана отчетту түзүү үчүн бааларды, складдык калдыктарды жана чыгымдарды карап жатабыз.",
    liveGenStandbyTitle: "Генеративдик талдоо күтүү режиминде",
    liveGenStandbyDesc: "Жандуу бизнес-талдоону акыркы маалыматтар боюнча баштоо үчүн Орнотуулар бөлүмүнөн GEMINI_API_KEY параметрин кошуңуз.",
    howThisWorksTitle: "Ассистент кандай иштейт:",
    howThisWorksDesc: "Сиздин бизнес-көрсөткүчтөр (товар калдыктары, кассалык чектер, чыгымдар) өсүү чекиттерин табуу үчүн серверде коопсуз бааланат. Маалыматтар толугу менен корголгон.",
    standbyIntelligenceTitle: "Шаблондуу бизнес-анализ (Күтүү режиминдеги отчет)",
    standbyIntelligenceDesc: "Төмөндө орнотулган алгоритмдердин негизинде маалыматтардын кыскача аналитикалык отчету берилди:",
    clickRegeneratePrompt: "Автоматтык закупка сунуштарын алуу үчүн \"Жаңы талдоону баштоо\" баскычын басыңыз.",

    telegramTitle: "Интегратор Telegram билдирүүлөрү",
    telegramSubtitle: "Критикалык калдыктар, күндөлүк кирешелер жана чыгымдар боюнча автоматтык канал таркатуулары.",
    botConnDetails: "Telegram-бот байланыш деталдары",
    connectedState: "Иштеди",
    broadcastTriggerTitle: "Рассылка жөндөөлөрү",
    dailyMarginReportLabel: "Күнүмдүк каржылык отчет",
    lowStockWarningsLabel: "Дефицит товарлар эскертүүлөрү",
    excessiveCostsLabel: "Капыстан чыккан чыгымдар эскертүүсү",
    triggerWebhookTestBtn: "Жөнөтүүнү текшерүү (Тест)",
    triggeringWebhooksStatus: "Тест пакети жөнөтүлүүдө...",
    simulatedPhoneScreenTitle: "Имитацияланган смартфон экраны",
    simulatedStatusPlaceholder: "Каржы маалыматтары даяр. Байланышты текшерүү үчүн \"Жөнөтүүнү текшерүү (Тест)\" баскычын басыңыз!",
    simulatorWebhookInfo: "Бул симулятор рассыла тармактарын компоновкалоо үчүн сервердик кодду иштетет. Жөнөтүү REST суроо-талаптарды реалдуу убакытта жөнөтүүгө барабар.",

    loginHeader: "SaaS Бизнести Башкаруу Системасы",
    loginSubtitle: "Кафе, дүкөндөр жана кампалар үчүн атайын коопсуз көп тенанттуу реестрлер.",
    workEmailPlaceholder: "Мисалы: cafe_admin@example.com",
    passcodePlaceholder: "Үлгү: кеминде 6 символ",
    signinButton: "Системага кирүү",
    businessWorkspaceName: "Компаниянын же терминалдын аталышы",
    choosePasscode: "Коопсуздук кодун жазыңыз",
    bootstrapWorkspaceBtn: "Системаны баштоо",
    bootstrapWorkspaceInProcess: "Жумушчу чөйрө түзүлүүдө...",
    quickEvaluationTitle: "Тест кылуу үчүн 1-кликтүү баскычтар",
    quickEvaluationOption: "Тест аккаунту",
    quickEvaluationRole: "Системадагы ролу",
    wantConfigureSeparate: "Жаңы компания каттоону каалайсызбы?",
    createDynamicTenant: "Жаңы өзүнчө терминал түзүү",
    alreadyRegisteredCompany: "Сиздин компания катталганбы?",
    logOnTerminal: "Кирүү баскычына өтүү",

    superAdminTab: "Кожоюндун панели",
    superAdminHeader: "Суперадмин Кароосу",
    superAdminLoading: "Телеметрияны жана шайкештик көрсөткүчтөрүн жүктөө...",
    superAdminOwnerAccess: "Кожоюндун кирүүсү",
    superAdminPrivacyNotice: "Муну Business Control платформасынын түзүүчүсү гана колдоно алат. Бул панель GDPR эрежелерине ылайык иштелип чыккан. Кардарлардын тизмелери, жеке жазуулар, кызматкерлердин даректери жана сатуулардын деталдары буерде толугу менен жеткиликсиз.",
    superAdminSyncBtn: "Системанын маалыматтарын синхрондоштуруу",
    superAdminTabOverview: "Платформаны жалпы көрүү",
    superAdminTabMonitoring: "Компанияларды көзөмөлдөө",
    superAdminTabAnalytics: "Өсүү жана аналитика",
    superAdminTabSupport: "Колдоо кызматы",
    superAdminTabHealth: "Системанын ден соолугу",
    superAdminTabAudit: "Коопсуздук жана Аудит"
  }
};
