'use client';

import { useState } from 'react';
import {
  login,
  LoginParams,
  LoginResponse,
  getCurrentUser
} from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthTestPage() {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('123456');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [userError, setUserError] = useState<string>('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      setToken('');
      setUserInfo(null);

      const loginParams: LoginParams = {
        username,
        password
      };

      const response = await login(loginParams);
      setToken(response.token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '登录失败，请检查服务器连接'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserInfo = async () => {
    if (!token) {
      setUserError('请先登录获取token');
      return;
    }

    try {
      setUserLoading(true);
      setUserError('');

      const user = await getCurrentUser(token);
      setUserInfo(user);
    } catch (err) {
      setUserError(err instanceof Error ? err.message : '获取用户信息失败');
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-10'>
      <Card className='mx-auto max-w-md'>
        <CardHeader>
          <CardTitle>后端认证测试</CardTitle>
          <CardDescription>测试与Midway后端的认证连接</CardDescription>
        </CardHeader>

        <Tabs defaultValue='login'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='login'>登录获取Token</TabsTrigger>
            <TabsTrigger value='user' disabled={!token}>
              获取用户信息
            </TabsTrigger>
          </TabsList>

          <TabsContent value='login'>
            <CardContent className='space-y-4 pt-4'>
              <div className='space-y-2'>
                <Label htmlFor='username'>用户名</Label>
                <Input
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='请输入用户名'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>密码</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='请输入密码'
                />
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {token && (
                <div className='bg-muted mt-4 rounded-md p-3'>
                  <p className='text-sm font-semibold'>获取的JWT Token:</p>
                  <p className='mt-1 text-xs break-all'>{token}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleLogin}
                disabled={loading}
                className='w-full'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value='user'>
            <CardContent className='space-y-4 pt-4'>
              {userError && (
                <Alert variant='destructive'>
                  <AlertDescription>{userError}</AlertDescription>
                </Alert>
              )}

              {userInfo && (
                <div className='bg-muted mt-4 rounded-md p-3'>
                  <p className='text-sm font-semibold'>用户信息:</p>
                  <pre className='mt-1 overflow-auto text-xs'>
                    {JSON.stringify(userInfo, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGetUserInfo}
                disabled={userLoading || !token}
                className='w-full'
              >
                {userLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    获取中...
                  </>
                ) : (
                  '获取用户信息'
                )}
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
