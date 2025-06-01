import { NextRequest, NextResponse } from 'next/server';

// 后端API地址 - 确保这个地址是正确的
const API_URL = 'http://localhost:7001';

export async function GET(request: NextRequest) {
  try {
    // 从请求头中获取认证token
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ message: '未提供认证令牌' }, { status: 401 });
    }

    // 调用后端API
    const response = await fetch(`${API_URL}/api/auth/currentUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader
      }
    });

    // 获取后端返回的数据
    const data = await response.json();

    // 返回数据给前端
    return NextResponse.json(data);
  } catch (error) {
    console.error('代理获取用户信息请求失败:', error);
    return NextResponse.json(
      { message: '获取用户信息失败', error: String(error) },
      { status: 500 }
    );
  }
}
