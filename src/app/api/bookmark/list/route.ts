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
    const response = await fetch(`${API_URL}/api/bookmark/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader
      }
    });

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`后端返回错误状态码: ${response.status}`, errorText);
      return NextResponse.json(
        { message: `后端请求失败: ${response.status}`, error: errorText },
        { status: response.status }
      );
    }

    // 检查内容类型
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('后端返回非JSON格式数据:', text);
      return NextResponse.json(
        { message: '后端返回格式错误', error: text.substring(0, 200) },
        { status: 500 }
      );
    }

    // 获取后端返回的数据
    const data = await response.json();

    // 返回数据给前端
    return NextResponse.json(data);
  } catch (error) {
    console.error('代理获取书签数据请求失败:', error);
    return NextResponse.json(
      { message: '获取书签数据失败', error: String(error) },
      { status: 500 }
    );
  }
}
