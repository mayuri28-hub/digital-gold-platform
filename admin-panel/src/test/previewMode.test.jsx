import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import PreviewApp from '../preview/PreviewApp.jsx';
import { isAdminPreviewEnabled } from '../preview/previewMode.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('admin dashboard preview safeguards', () => {
  it('renders the existing dashboard with fabricated data and no backend requests', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewApp />
      </MemoryRouter>,
    );

    expect(screen.getByText('LOCAL PREVIEW · MOCK DATA ONLY')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Good morning, Preview Admin' })).toBeInTheDocument();
    expect(screen.getAllByText('customer.one@example.invalid').length).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('navigates to distinct Dashboard, Customers, Products, and Orders pages', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewApp />
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByRole('link', { name: /Dashboard/ });
    expect(dashboardLink).toHaveClass('active');
    expect(screen.getByRole('heading', { name: 'Good morning, Preview Admin' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Customers' }));
    expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Customers' })).toHaveClass('active');
    expect(screen.getByText('LOCAL PREVIEW · MOCK DATA ONLY')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Metal products' }));
    expect(screen.getByRole('heading', { name: 'Metal products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Metal products' })).toHaveClass('active');

    await user.click(screen.getByRole('link', { name: 'Buy & sell orders' }));
    expect(screen.getByRole('heading', { name: 'Buy & sell orders' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Buy & sell orders' })).toHaveClass('active');

    for (const [linkName, heading] of [
      ['Rate management', 'Rate management'],
      ['SIP management', 'SIP management'],
      ['Redemption & delivery', 'Redemption & delivery'],
      ['Gift management', 'Gift management'],
      ['Payments', 'Payments'],
      ['Refunds', 'Refund requests'],
      ['Reconciliation', 'Reconciliation'],
      ['Reports & exports', 'Reports'],
      ['Roles & permissions', 'Roles & permissions'],
      ['Settings', 'Settings'],
      ['Audit logs', 'Audit logs'],
    ]) {
      await user.click(screen.getByRole('link', { name: linkName }));
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: linkName })).toHaveClass('active');
      expect(screen.getByText('LOCAL PREVIEW · MOCK DATA ONLY')).toBeInTheDocument();
    }
  });

  it('renders a direct preview route with the preview banner', () => {
    render(
      <MemoryRouter initialEntries={['/products']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewApp />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Metal products' })).toBeInTheDocument();
    expect(screen.getByText('LOCAL PREVIEW · MOCK DATA ONLY')).toBeInTheDocument();
  });

  it('updates the preview page and active link on browser back and forward', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/');
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PreviewApp />
      </BrowserRouter>,
    );

    await user.click(screen.getByRole('link', { name: 'Customers' }));
    expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Metal products' }));
    expect(screen.getByRole('heading', { name: 'Metal products' })).toBeInTheDocument();

    window.history.back();
    await screen.findByRole('heading', { name: 'Customers' });
    expect(screen.getByRole('link', { name: 'Customers' })).toHaveClass('active');

    window.history.forward();
    await screen.findByRole('heading', { name: 'Metal products' });
    expect(screen.getByRole('link', { name: 'Metal products' })).toHaveClass('active');
  });

  it('is disabled unless explicitly enabled in development', () => {
    expect(isAdminPreviewEnabled({ DEV: true })).toBe(false);
    expect(isAdminPreviewEnabled({ DEV: true, VITE_ADMIN_PREVIEW: 'false' })).toBe(false);
    expect(isAdminPreviewEnabled({ DEV: true, VITE_ADMIN_PREVIEW: 'TRUE' })).toBe(false);
  });

  it('enables only for the exact local development opt-in', () => {
    expect(isAdminPreviewEnabled({ DEV: true, VITE_ADMIN_PREVIEW: 'true' })).toBe(true);
  });

  it('cannot be enabled in a production build, even if the flag is set', () => {
    expect(isAdminPreviewEnabled({ DEV: false, VITE_ADMIN_PREVIEW: 'true' })).toBe(false);
  });
});
