import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const path = req.nextUrl.pathname;

  // 先检查是否公开路径
  if (
    path.startsWith('/dashboard/bookmark/zch') ||
    path.startsWith('/dashboard/tools/')
  ) {
    return; // 不执行认证
  }

  // 再检查是否需要保护的路径
  if (path.startsWith('/dashboard')) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
