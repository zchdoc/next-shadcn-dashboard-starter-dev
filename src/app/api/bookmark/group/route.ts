import { NextRequest, NextResponse } from 'next/server';

// 后端API地址 - 确保这个地址是正确的
const API_URL = 'http://localhost:7001';

export async function POST(request: NextRequest) {
  try {
    // 从请求头中获取认证token
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: '未提供认证令牌' }, { status: 401 });
    }

    // 从请求中获取数据
    const body = await request.json();

    // 调用后端API
    const response = await fetch(`${API_URL}/api/bookmark/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader
      },
      body: JSON.stringify(body)
    });

    // 获取后端返回的数据
    const data = await response.json();

    // 返回数据给前端
    return NextResponse.json(data);
  } catch (error) {
    console.error('代理添加书签组请求失败:', error);
    return NextResponse.json(
      { message: '添加书签组失败', error: String(error) },
      { status: 500 }
    );
  }
}
