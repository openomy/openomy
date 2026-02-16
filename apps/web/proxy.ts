import { type NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // 解析路径段
  const segments = pathname.split('/').filter(Boolean);

  // 保护现有的路由，不进行重写
  if (pathname.startsWith('/github') && segments.length === 3) {
    // 保护 /github/{owner}/{repo}
    return NextResponse.next();
  } else if (pathname.startsWith('/party') && segments.length >= 3) {
    // 保护 /party/{owner}/{projectId} 和 /party/{owner}/{projectId}/svg
    return NextResponse.next();
  } else if (pathname.startsWith('/svg') && segments.length === 1) {
    // 保护 /svg?repo={repo}
    const searchParams = request.nextUrl.searchParams;
    const repoParam = searchParams.get('repo');
    if (repoParam) {
      return NextResponse.next();
    }
    // 没有匹配的话，走路由重写逻辑，将 /svg -> 重写为 /github/svg
  } else if (pathname.startsWith('/openexpo')) {
    // 保护 /openexpo 页面（含潜在子路由）
    return NextResponse.next();
  } else if (pathname === '/') {
    // 额外保护以下路由：
    // 1. "/": 首页
    return NextResponse.next();
  }

  // 重写以下路由
  if (segments.length === 1) {
    // 将 /{owner} -> 重写为 /github/{owner}
    const owner = segments[0];
    const newUrl = new URL(`/github/${owner}`, request.url);
    return NextResponse.rewrite(newUrl);
  } else if (segments.length === 2) {
    // 将 /{owner}/{repo} -> 重写为 /github/{owner}/{repo}
    const [owner, repo] = segments;
    const newUrl = new URL(`/github/${owner}/${repo}`, request.url);
    return NextResponse.rewrite(newUrl);
  }

  // 其他路由正常处理
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - /images (public/images/* files)
     * - /products (public/products/* files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next|_vercel|images|products|favicon.ico).*)',
  ],
};
