import { NextResponse } from 'next/server';

// 聚合数据API接口
const JUHE_API_URL = 'http://op.juhe.cn/onebox/exchange/currency';
const API_KEY = 'd34b5e115bfd16290dd1d3a061b26bb5';

/**
 * 代理聚合数据汇率API请求
 * 这可以避免浏览器的CORS限制
 */
export async function GET(request: Request) {
  try {
    // 从URL中获取请求参数
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');

    // 验证参数
    if (!fromCurrency || !toCurrency) {
      return NextResponse.json({ error: '缺少必要的参数' }, { status: 400 });
    }

    // 构建API请求URL
    const apiUrl = `${JUHE_API_URL}?key=${API_KEY}&from=${fromCurrency}&to=${toCurrency}&version=2`;

    // 设置请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

    // 调用聚合数据API
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    // 如果API响应不成功，返回错误
    if (!response.ok) {
      return NextResponse.json(
        { error: `API请求失败: ${response.statusText}` },
        { status: response.status }
      );
    }

    // 获取API响应数据
    const data = await response.json();

    // 返回API响应数据
    return NextResponse.json(data);
  } catch (error) {
    console.error('聚合数据API请求错误:', error);
    return NextResponse.json({ error: '处理请求时发生错误' }, { status: 500 });
  }
}
