import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
const title = 'Z1.Tool';
export const metadata: Metadata = {
  title: title,
  description:
    'Build tool box site with Basic dashboard with Next.js and Shadcn',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>👋</text></svg>',
        type: 'image/svg+xml'
      }
    ]
  }
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
