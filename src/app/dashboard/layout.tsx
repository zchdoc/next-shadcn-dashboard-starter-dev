import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
const title = 'Z1.Tool';
export const metadata: Metadata = {
  title: 'Dashboard : Kanban view'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get('sidebar_state'); // Changed from sidebar:state to sidebar_state
  // console.log('sidebarState', sidebarState, typeof sidebarState)
  let defaultOpen;
  if ('undefined' === typeof sidebarState) {
    defaultOpen = false;
  } else {
    defaultOpen = sidebarState?.value !== 'false';
  }

  // console.log('defaultOpen', defaultOpen)

  const headersList = await headers();
  const host = headersList.get('host');
  const isDev = host?.startsWith('localhost') || host?.startsWith('127.0.0.1');
  const currentTitle = isDev ? `Dev-${title}` : title;

  if (
    metadata.title &&
    typeof metadata.title === 'object' &&
    'default' in metadata.title
  ) {
    metadata.title.default = currentTitle;
  }

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
