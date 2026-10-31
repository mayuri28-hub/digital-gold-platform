import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { ManagementContext } from '../context/ManagementContext.jsx';
import { OperationsContext } from '../context/OperationsContext.jsx';
import AuditLogsPage from '../pages/AuditLogsPage.jsx';
import CustomerDetailsPage from '../pages/CustomerDetailsPage.jsx';
import CustomerManagementPage from '../pages/CustomerManagementPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import GiftManagementPage from '../pages/GiftManagementPage.jsx';
import MetalProductsPage from '../pages/MetalProductsPage.jsx';
import OrderDetailsPage from '../pages/OrderDetailsPage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import PaymentsPage from '../pages/PaymentsPage.jsx';
import RateManagementPage from '../pages/RateManagementPage.jsx';
import ReconciliationPage from '../pages/ReconciliationPage.jsx';
import RedemptionDeliveryPage from '../pages/RedemptionDeliveryPage.jsx';
import RefundsPage from '../pages/RefundsPage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';
import RolesPermissionsPage from '../pages/RolesPermissionsPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import SipManagementPage from '../pages/SipManagementPage.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import { DEFAULT_ROLES, DEFAULT_SETTINGS } from '../data/adminData.js';
import {
  initialGifts,
  initialMetalMakingCharges,
  initialOrders,
  initialPayments,
  initialProducts,
  initialRateRequests,
  initialRedemptions,
  initialRefunds,
  initialSettlements,
  initialSips,
} from '../data/managementData.js';

const permissionKeys = [
  'dashboard',
  'customers',
  'products',
  'orders',
  'fulfillment',
  'finance',
  'reports',
  'administration',
  'audit',
];

const previewRole = {
  id: 'PREVIEW',
  name: 'Preview Admin',
  users: 0,
  permissions: Object.fromEntries(permissionKeys.map((permission) => [permission, true])),
};
const previewNoop = async () => false;

const today = new Date();
const dateParts = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).formatToParts(today);
const previewDate = `${dateParts.find((part) => part.type === 'day').value} ${dateParts.find((part) => part.type === 'month').value} ${dateParts.find((part) => part.type === 'year').value}`;

const previewCustomers = [
  { id: 'PREVIEW-CUS-001', name: 'Preview Customer One', email: 'customer.one@example.invalid', phone: '+91 90000 00001', city: 'Mumbai', kycStatus: 'Verified', status: 'Active', joined: previewDate },
  { id: 'PREVIEW-CUS-002', name: 'Preview Customer Two', email: 'customer.two@example.invalid', phone: '+91 90000 00002', city: 'Pune', kycStatus: 'Pending', status: 'Active', joined: previewDate },
];

const previewOrders = [
  { id: 'PREVIEW-ORD-001', customerId: 'PREVIEW-CUS-001', customer: 'Preview Customer One', placedAt: `${previewDate} 10:38 AM`, type: 'Buy', metal: 'Gold', amount: 14497, status: 'Completed' },
  { id: 'PREVIEW-ORD-002', customerId: 'PREVIEW-CUS-002', customer: 'Preview Customer Two', placedAt: `${previewDate} 10:24 AM`, type: 'Sell', metal: 'Silver', amount: 9265, status: 'Processing' },
  { id: 'PREVIEW-ORD-003', customerId: 'PREVIEW-CUS-001', customer: 'Preview Customer One', placedAt: `${previewDate} 09:56 AM`, type: 'Buy', metal: 'Gold', amount: 7249, status: 'Completed' },
];

const authValue = {
  user: { name: previewRole.name, email: 'preview@example.invalid', roleId: previewRole.id },
  isAuthenticated: true,
  isLoading: false,
  authError: '',
  login: async () => ({ success: false }),
  logout: async () => {},
};

const adminValue = {
  activeRole: previewRole,
  activeRoleId: previewRole.id,
  roles: [...DEFAULT_ROLES, previewRole],
  settings: { ...DEFAULT_SETTINGS },
  hasPermission: (permission) => Boolean(previewRole.permissions[permission]),
  auditEvents: [
    {
      id: 'PREVIEW-AUD-001',
      timestamp: new Date().toISOString(),
      actor: 'Preview Admin',
      action: 'Reviewed a sample verification',
      category: 'Customers',
      target: 'PREVIEW-CUS-002',
      outcome: 'Simulated',
      detail: 'A sample verification review was recorded in preview data.',
    },
  ],
  persistenceError: '',
  setPersistenceError: () => {},
  updateSettings: previewNoop,
  saveAdminPermissions: previewNoop,
  recordAudit: () => {},
};

const managementValue = {
  customers: previewCustomers,
  customersLoading: false,
  products: initialProducts,
  rateRequests: initialRateRequests,
  metalMakingCharges: initialMetalMakingCharges,
  ledgerEntries: [],
  updateMetalMakingCharge: previewNoop,
  addCustomer: previewNoop,
  updateCustomer: previewNoop,
  saveProduct: previewNoop,
  toggleProduct: previewNoop,
  addRateRequest: previewNoop,
  reviewRateRequest: previewNoop,
};

const operationsValue = {
  orders: [...previewOrders, ...initialOrders],
  payments: initialPayments,
  sips: initialSips,
  redemptions: initialRedemptions,
  gifts: initialGifts,
  refunds: initialRefunds,
  settlements: initialSettlements,
  addOrder: previewNoop,
  updateOrder: previewNoop,
  addSip: previewNoop,
  updateSip: previewNoop,
  updateRedemption: previewNoop,
  addRedemption: previewNoop,
  addGift: previewNoop,
  updateGift: previewNoop,
  resendGift: previewNoop,
  reviewRefund: previewNoop,
  markSettlementReviewed: previewNoop,
};

function PreviewPage({ children }) {
  return (
    <>
      <div className="simulated-banner" role="note">
        <strong>LOCAL PREVIEW · MOCK DATA ONLY</strong>
        <span>This dashboard uses fabricated records. No backend requests or real customer data are used.</span>
      </div>
      {children}
    </>
  );
}

export default function PreviewApp() {
  return (
    <AuthContext.Provider value={authValue}>
      <AdminContext.Provider value={adminValue}>
        <ManagementContext.Provider value={managementValue}>
          <OperationsContext.Provider value={operationsValue}>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route index element={<PreviewPage><DashboardPage /></PreviewPage>} />
                <Route path="customers" element={<PreviewPage><CustomerManagementPage /></PreviewPage>} />
                <Route path="customers/:customerId" element={<PreviewPage><CustomerDetailsPage /></PreviewPage>} />
                <Route path="products" element={<PreviewPage><MetalProductsPage /></PreviewPage>} />
                <Route path="rates" element={<PreviewPage><RateManagementPage /></PreviewPage>} />
                <Route path="orders" element={<PreviewPage><OrdersPage /></PreviewPage>} />
                <Route path="orders/:orderId" element={<PreviewPage><OrderDetailsPage /></PreviewPage>} />
                <Route path="sips" element={<PreviewPage><SipManagementPage /></PreviewPage>} />
                <Route path="redemptions" element={<PreviewPage><RedemptionDeliveryPage /></PreviewPage>} />
                <Route path="gifts" element={<PreviewPage><GiftManagementPage /></PreviewPage>} />
                <Route path="payments" element={<PreviewPage><PaymentsPage /></PreviewPage>} />
                <Route path="refunds" element={<PreviewPage><RefundsPage /></PreviewPage>} />
                <Route path="reconciliation" element={<PreviewPage><ReconciliationPage /></PreviewPage>} />
                <Route path="reports" element={<PreviewPage><ReportsPage /></PreviewPage>} />
                <Route path="roles" element={<PreviewPage><RolesPermissionsPage /></PreviewPage>} />
                <Route path="settings" element={<PreviewPage><SettingsPage /></PreviewPage>} />
                <Route path="audit-logs" element={<PreviewPage><AuditLogsPage /></PreviewPage>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </OperationsContext.Provider>
        </ManagementContext.Provider>
      </AdminContext.Provider>
    </AuthContext.Provider>
  );
}
