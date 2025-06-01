import { NextRequest, NextResponse } from 'next/server';

// 后端API地址 - 确保这个地址是正确的
const API_URL = 'http://localhost:7001';

export async function POST(request: NextRequest) {
  try {
    // 从请求中获取登录数据
    const body = await request.json();

    // 调用后端API
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      // 添加额外配置以处理可能的连接问题
      cache: 'no-store'
    });

    // 获取后端返回的数据
    const data = await response.json();

    // 返回数据给前端
    return NextResponse.json(data);
  } catch (error) {
    console.error('代理登录请求失败:', error);
    return NextResponse.json(
      { message: '登录请求失败，请确保后端服务已启动', error: String(error) },
      { status: 500 }
    );
  }
}
