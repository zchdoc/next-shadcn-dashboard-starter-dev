/**
 * 书签服务 - 处理与后端书签相关的通信
 */

import { BookmarkData } from '@/constants/bookmarks-zch';

/**
 * 从后端获取书签数据
 * @param token JWT令牌
 * @returns 书签数据
 */
export async function getBookmarks(token: string): Promise<BookmarkData> {
  try {
    const response = await fetch(`/api/bookmark/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取书签数据失败');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取书签数据失败:', error);
    throw error;
  }
}

/**
 * 添加书签组
 * @param token JWT令牌
 * @param title 组标题
 * @param key 组键名
 * @returns 新创建的书签组
 */
export async function addBookmarkGroup(
  token: string,
  title: string,
  key: string
): Promise<any> {
  try {
    const response = await fetch(`/api/bookmark/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, key })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '添加书签组失败');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('添加书签组失败:', error);
    throw error;
  }
}

/**
 * 添加书签链接
 * @param token JWT令牌
 * @param groupKey 组键名
 * @param title 链接标题
 * @param url 链接URL
 * @returns 新创建的书签链接
 */
export async function addBookmarkLink(
  token: string,
  groupKey: string,
  title: string,
  url: string
): Promise<any> {
  try {
    const response = await fetch(`/api/bookmark/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ groupKey, title, url })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '添加书签链接失败');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('添加书签链接失败:', error);
    throw error;
  }
}
