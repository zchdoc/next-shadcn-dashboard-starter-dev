import { NextRequest, NextResponse } from 'next/server';

// AllTick API key
const API_KEY = '105b9f7b81c8493ddcf6334d49a3f2f0-c-app';

// AllTick API base URL
const API_BASE_URL = 'https://quote.alltick.io/quote-b-api';

/**
 * 处理 AllTick API 请求的代理
 * @param request 请求对象
 * @returns 响应对象
 */
export async function POST(request: NextRequest) {
  try {
    // 从请求体中获取参数
    const body = await request.json();
    const { code, klineType, klineTimestampEnd, queryKlineNum, adjustType } =
      body;

    // 生成唯一的 trace ID
    const traceId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // 构建查询参数
    const queryParams = {
      trace: traceId,
      data: {
        code,
        kline_type: klineType,
        kline_timestamp_end: klineTimestampEnd,
        query_kline_num: queryKlineNum,
        adjust_type: adjustType
      }
    };

    // URL 编码查询参数
    const encodedQuery = encodeURIComponent(JSON.stringify(queryParams));

    // 构建 API URL
    const apiUrl = `${API_BASE_URL}/kline?token=${API_KEY}&query=${encodedQuery}`;

    // 发送请求到 AllTick API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 检查响应状态
    if (!response.ok) {
      return NextResponse.json(
        { error: `Error from AllTick API: ${response.statusText}` },
        { status: response.status }
      );
    }

    // 获取响应数据
    const data = await response.json();

    // 返回响应
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in AllTick API proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
