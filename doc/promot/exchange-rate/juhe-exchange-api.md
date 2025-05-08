# 汇率开发文档

1、货币列表  
2、实时汇率查询换算  
3、 错误码参照

1、货币列表 [顶部]

接口地址： http://op.juhe.cn/onebox/exchange/list

返回格式： json请求方式： http get

请求示例： http://op.juhe.cn/onebox/exchange/list?key=您申请的APPKEY接口备注： 一些常见的货币代码，部分查询时可能无结果。

请求Header：

请求参数说明：

<html><body><table><tr><td>名称</td><td>值</td></tr><tr><td>Content-Type</td><td> application/x-www-form-urlencoded</td></tr></table></body></html>

返回参数说明：

<html><body><table><tr><td>名称</td><td>类型</td><td>必填</td><td>说明</td></tr><tr><td>key</td><td> string</td><td>是</td><td>在个人中心->我的数据,接口名称上方查看</td></tr><tr><td>version</td><td>string</td><td>是</td><td>版本号，最新版本传递固定值：2</td></tr></table></body></html>

<html><body><table><tr><td>名称</td><td>类型</td><td>说明</td></tr><tr><td>error_code</td><td>int</td><td>返回码</td></tr><tr><td>reason</td><td> string</td><td>返回说明</td></tr><tr><td>result</td><td>string</td><td>返回结果集</td></tr></table></body></html>

ason": "查询成功",  
ult": {  
list": [  
{ "name": "人民币", /\*货币名称\* "code": "CNY" /\*货币代码\*/  
},  
{ "name": "美元", "code": "USD"  
},  
{ "name": "日元", "code": "JPY"  
},  
{ "name": "欧元", "code": "EUR"  
},  
{ "name": "英镑", "code": "GBP"  
},  
{ "name": "韩元", "code": "KER"  
},  
{ "name": "港币", "code": "HKD"  
},  
{ "name": "澳大利亚元", "code": "AUD"  
}, { "name": "加拿大元", "code": "CAD"  
}, { "name": "阿尔及利亚第纳尔", "code": "DZD"  
}, { "name": "阿根廷比索", "code": "ARS"  
},  
{ "name": "爱尔兰镑", "code": "IEP"  
},  
{ "name": "埃及镑", "code": "EGP"  
},  
{ "name": "阿联酋迪拉姆", "code": "AED"  
}, { "name": "阿曼里亚尔", "code": "OMR"  
}, "name": "澳门元", "code": "MOP"  
产 "name": "百慕大元", "code": "BMD" "name": "巴基斯坦卢比", "code": "PKR"  
}, "name": "巴拉圭瓜拉尼", "code": "PYG"  
}, "name": "巴林第纳尔", "code": "BHD"  
}, "name": "巴拿马巴尔博亚", "code": "PAB"  
}, "name": "保加利亚列弗", "code": "BGN" "name": "巴西雷亚尔", "code": "BRL"  
}, "name": "比利时法郎", "code": "BEF"  
}, "name": "冰岛克朗", "code": "ISK"  
}, "name": "博茨瓦纳普拉", "code": "BWP"  
}, "name": "波兰兹罗提", "code": "PLN"  
}, "name": "玻利维亚诺", "code": "BOB"  
}, "name": "丹麦克朗", "code": "DKK"  
}, "name": "德国马克", "code": "DEM"  
}, "name": "法国法郎", "code": "FRF"  
}, "name": "菲律宾比索", "code"."PHP"

"name": "哥伦比亚比索", "code": "COP" }, "name": "古巴比索", "code": "CUP" }, { "name": "哈萨克坚戈", "code": "KZT" }, { "name": "荷兰盾", "code": "NLG" }, { "name": "加纳塞地", "code": "GHC" }, { "name": "捷克克朗", "code": "CZK" }, { "name": "津巴布韦元", "code": "ZWD" }, { "name": "卡塔尔里亚尔", "code": "QAR" }, { "name": "克罗地亚库纳", "code": "HRK" }, { "name": "肯尼亚先令", "code": "KES" }, { "name": "科威特第纳尔", "code": "KWD" }, { "name": "老挝基普", "code": "LAK" }, { "name": "拉脱维亚拉图", "code": "LVL" }, { "name": "黎巴嫩镑", "code": "LBP" }, { "name": "林吉特", "code": "MYR" }, { "name": "立陶宛立特", "code": "LTL" },

code": "RON"  
}, "name": "毛里求斯卢比", "code": "MUR"  
}, "name": "蒙古图格里克", "code": "MNT"  
}, "name": "孟加拉塔卡", "code": "BDT"  
}, "name": "缅甸缅元", "code": "BUK"  
},  
{ "name": "秘鲁新索尔", "code": "PEN"  
}, "name": "摩洛哥迪拉姆", "code": "MAD"  
}, "name": "墨西哥比索", "code": "MXN"  
}, "name": "南非兰特", "code": "ZAR"  
}, "name": "挪威克朗", "code": "NOK"  
},  
{ "name": "葡萄牙埃斯库多", "code": "PTE"  
}, "name": "瑞典克朗", "code": "SEK"  
},  
{ "name": "瑞士法郎", "code": "CHF"  
}, "name": "沙特里亚尔", "code": "SAR"  
}, "name": "斯里兰卡卢比", "code": "LKR"  
},  
{ "name": "索马里先令", "code": "SOS"  
}, "name": "泰国铢",  
{ "name": "土耳其新里拉", "code": "TRY"  
}, "name": "突尼斯第纳尔", "code": "TND"  
}, "name": "危地马拉格查尔", "code": "GTQ"  
}, "name": "委内瑞拉玻利瓦尔 "code": "VEB"  
},  
{ "name": "乌拉圭新比索", "code": "UYU"  
}, "name": "西班牙比塞塔", "code": "ESP"  
}, "name": "希腊德拉克马", "code": "GRD"  
}, "name": "新加坡元", "code": "SGD"  
}, "name": "新台币", "code": "TWD"  
}, "name": "新西兰元", "code": "NZD"  
}, "name": "匈牙利福林", "code": "HUF"  
},  
{ "name": "牙买加元", "code": "JMD"  
}, "name": "义大利里拉", "code": "ITL"  
}, "name": "印度卢比", "code": "INR"  
}, "name": "印尼盾", "code": "IDR"  
}, "name": "以色列谢克尔", "code": "ILS"  
},

"name": "约旦第纳尔", "code": "JOD" }, { "name": "越南盾", "code": "VND" }, { "name": "智利比索", "code": "CLP" } ] }, "error_code": 0 }

# 2、实时汇率查询换算 [顶部]

接口地址： http://op.juhe.cn/onebox/exchange/currency

返回格式： json请求方式： http get

请求示例： http://op.juhe.cn/onebox/exchange/currency?key $\prime{=}$ 您申请的APPKEY&from=JPY&to $\vDash$ BHD接口备注： 实时货币汇率查询换算，数据仅供参考，交易时以银行柜台成交价为准。部分货币之间的汇率，可能查询不到结果。

请求Header：

请求参数说明：

<html><body><table><tr><td>名称</td><td>值</td></tr><tr><td>Content-Type</td><td> application/x-www-form-urlencoded</td></tr></table></body></html>

<html><body><table><tr><td>名称</td><td>类型</td><td>必填</td><td>说明</td></tr><tr><td>from</td><td>string</td><td>是</td><td>转换汇率前的货币代码</td></tr><tr><td>to</td><td>string</td><td>是</td><td>转换汇率成的货币代码</td></tr><tr><td>version</td><td> string</td><td>是</td><td>版本号，最新版本传递固定值：2</td></tr><tr><td>key</td><td>string</td><td>是</td><td>在个人中心->我的数据,接口名称上方查看</td></tr></table></body></html>

返回参数说明：

<html><body><table><tr><td>名称</td><td>类型</td><td>说明</td></tr><tr><td>error_code</td><td>int</td><td>返回码</td></tr><tr><td>reason</td><td>string</td><td>返回说明</td></tr><tr><td>result</td><td>string</td><td>返回结果集</td></tr></table></body></html>

JSON返回示例：

{ "reason": "查询成功", "result": [ { "currencyF": "JPY", /\*货币代码\*/ "currencyF_Name": "日元", /\*货币名称\*/ "currencyT": "BHD", /\*货币代码\*/ "currencyT_Name": "巴林第纳尔", /\*货币名称\*/ "currencyFD": 1, "exchange": "0.0032685972", /\*当前汇率\*/ "result": "0.0032",/\*当前汇率\*/ "updateTime": "2014-11-07 13:58:02" }, { "currencyF": "BHD", "currencyF_Name": "巴林第纳尔", "currencyT": "JPY", "currencyT_Name": "日元", "currencyFD": 1, "exchange": "305.9416445623", "result": 305.9416, "updateTime": "2014-11-07 13:58:01" } ], "error_code": 0  
}

# 3、错误码参照

服务级错误码参照(error_code)： [顶部]

<html><body><table><tr><td>错误码</td><td>说明</td></tr><tr><td>208001</td><td>货币兑换名称不能为空</td></tr><tr><td>208002</td><td>查询不到汇率相关信息</td></tr><tr><td>208003</td><td>网络错误，请重试</td></tr><tr><td>208004</td><td>查询不到常用货币相关信息</td></tr><tr><td>208005</td><td>不存在的货币种类</td></tr><tr><td>208006</td><td>查询不到该货币兑换相关信息</td></tr></table></body></html>

系统级错误码参照：

<html><body><table><tr><td>错误码</td><td>说明</td><td>旧版本(resultcode)</td></tr><tr><td>10001</td><td>错误的请求KEY</td><td>101</td></tr><tr><td>10002</td><td>该KEY无请求权限</td><td>102</td></tr><tr><td>10003</td><td>KEY过期</td><td>103</td></tr><tr><td>10004</td><td>错误的OPENID</td><td>104</td></tr><tr><td>10005</td><td>应用未审核超时，请提交认证</td><td>105</td></tr><tr><td>10007</td><td>未知的请求源</td><td>107</td></tr><tr><td>10008</td><td>被禁止的IP</td><td>108</td></tr><tr><td>10009</td><td>被禁止的KEY</td><td>109</td></tr><tr><td>10011</td><td>当前IP请求超过限制</td><td>111</td></tr><tr><td>10012</td><td>请求超过次数限制</td><td>112</td></tr><tr><td>10013</td><td>测试KEY超过请求限制</td><td>113</td></tr><tr><td>10014</td><td>系统内部异常（调用充值类业务时，请务必联系客服或通过订单查询接口检测订 单，避免造成损失)</td><td>114</td></tr><tr><td>10020</td><td>接口维护</td><td>120</td></tr><tr><td>10021</td><td>接口停用</td><td>121</td></tr></table></body></html>

错误码格式说明（示例：200201）：

<html><body><table><tr><td>2</td><td>002</td><td>01</td></tr><tr><td>服务级错误（1为系统级错误）</td><td>服务模块代码(即数据ID)</td><td>具体错误代码</td></tr></table></body></html>

版本日期：2025-05-08 15:44
