/**
 * 认证服务 - 处理与后端认证相关的通信
 */

import { da } from '@faker-js/faker/.';

// 定义登录参数接口
export interface LoginParams {
  username: string;
  password: string;
}

// 定义登录响应接口
export interface LoginResponse {
  token: string;
  currentAuthority: string;
  status: string;
  type: string;
}

/**
 * 登录服务 - 向后端发送登录请求
 * @param params 登录参数 (用户名和密码)
 * @returns 登录响应
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '登录失败');
    }

    const data = await response.json();
    console.info('login-response-data:', data);
    return data.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 获取当前用户信息
 * @param token JWT令牌
 * @returns 用户信息
 */
export async function getCurrentUser(token: string): Promise<any> {
  try {
    const response = await fetch(`/api/auth/currentUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取用户信息失败');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}
