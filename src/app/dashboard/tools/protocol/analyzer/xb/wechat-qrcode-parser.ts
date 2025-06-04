import type {
  ProtocolField,
  WechatQRCodeData,
  WechatQRCodeRequestData,
  WechatQRCodeResponseData
} from './types';

/**
 * Convert hex string to decimal number
 */
const hexToDec = (hex: string): number => {
  return Number.parseInt(hex, 16);
};

/**
 * Extract a portion of the hex string and create a protocol field
 */
const extractField = (
  data: string,
  startIndex: number,
  size: number,
  label: string,
  description?: string
): ProtocolField => {
  const hex = data.substring(startIndex * 2, (startIndex + size) * 2);
  const dec = hexToDec(hex);

  return {
    label,
    size,
    hex,
    dec,
    description
  };
};

/**
 * Extract a string field from hex data
 */
const extractStringField = (
  data: string,
  startIndex: number,
  size: number,
  label: string,
  description?: string
): ProtocolField => {
  const hex = data.substring(startIndex * 2, (startIndex + size) * 2);

  // 将十六进制转换为字符串
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = Number.parseInt(hex.substring(i, i + 2), 16);
    if (charCode !== 0) {
      // 忽略空字符
      str += String.fromCharCode(charCode);
    }
  }

  return {
    label,
    size,
    hex,
    dec: str,
    description
  };
};

/**
 * Parse a hex string as a date-time value (BCD format)
 */
const parseBCDDateTime = (hex: string): string => {
  if (hex.length !== 12) {
    return '日期格式无效';
  }

  const year = hex.substring(0, 2);
  const month = hex.substring(2, 4);
  const day = hex.substring(4, 6);
  const hour = hex.substring(6, 8);
  const minute = hex.substring(8, 10);
  const second = hex.substring(10, 12);

  // Format: 20YY-MM-DD HH:MM:SS
  return `20${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
};

/**
 * Parse timestamp from hex string (seconds since 2000-01-01)
 */
const parseTimestampFrom2000 = (hex: string): string => {
  const timestamp = Number.parseInt(hex, 16);
  // 2000年1月1日的时间戳（秒）
  const year2000 = 946684800; // 2000-01-01 00:00:00 UTC
  const date = new Date((year2000 + timestamp) * 1000);
  return date.toLocaleString();
};

/**
 * Get card status description
 */
const getCardStatusDescription = (value: number): string => {
  switch (value) {
    case 0:
      return '正常卡';
    case 1:
      return '挂失卡';
    case 2:
      return '卡不存在';
    default:
      return '未知状态';
  }
};

/**
 * 解析协议头
 */
const parseHeader = (cleanedHexData: string, isResponse = false) => {
  const frameTypeSize = isResponse ? 4 : 2; // 下位机返回的数据类型帧是4字节(03df0d01)，上位机是2字节(df0d)
  const frameTypePos = 30;
  const randomCodePos = frameTypePos + frameTypeSize;

  return {
    staticId: extractField(cleanedHexData, 0, 16, '静态ID', '设备固定标识符'),
    deviceId: extractField(
      cleanedHexData,
      16,
      4,
      '设备机器号',
      '设备的唯一标识符'
    ),
    fromDeviceId: extractField(
      cleanedHexData,
      20,
      4,
      '从设备机器号',
      '00000000表示主设备，非零表示中转设备'
    ),
    protocolType: extractField(
      cleanedHexData,
      24,
      2,
      '协议类型',
      '0000表示主设备协议，非零表示中转设备协议'
    ),
    deviceType: extractField(
      cleanedHexData,
      26,
      2,
      '设备类型',
      '设备的类型标识'
    ),
    dataLength: extractField(
      cleanedHexData,
      28,
      2,
      '数据长度',
      '后续数据的字节数'
    ),
    frameType: extractField(
      cleanedHexData,
      frameTypePos,
      frameTypeSize,
      '数据类型帧',
      isResponse
        ? '03DF0D01表示微信扫码金额命令下位机响应'
        : 'DF0D表示微信扫码金额命令上位机请求'
    ),
    randomCode: extractField(
      cleanedHexData,
      randomCodePos,
      4,
      '随机码',
      '数据包的随机标识符'
    )
  };
};

/**
 * 解析微信扫码金额命令上位机请求
 */
export const parseWechatQRCodeRequest = (
  hexData: string
): WechatQRCodeRequestData => {
  // Remove any whitespace or non-hex characters
  const cleanedHexData = hexData.replace(/[^0-9A-Fa-f]/g, '');

  if (cleanedHexData.length < 200) {
    throw new Error('数据包长度不足');
  }

  // 检查是否是上位机请求（应该包含DF0D但不包含03DF0D01）
  if (
    !cleanedHexData.toLowerCase().includes('df0d') ||
    cleanedHexData.toLowerCase().includes('03df0d01')
  ) {
    throw new Error('不是有效的微信扫码金额命令上位机请求');
  }

  // 解析协议头
  const header = parseHeader(cleanedHexData, false);

  // 解析请求数据
  const currentIndex = 36; // 从帖类型开始解析

  const body = {
    cardType: extractField(
      cleanedHexData,
      currentIndex,
      1,
      '帖类型',
      '00即实用水(ID卡用水,账号+密码用水),01预约用水'
    ),
    accountId: extractField(
      cleanedHexData,
      currentIndex + 1,
      4,
      '账号',
      '4字节物理卡号'
    ),
    cardId: extractField(
      cleanedHexData,
      currentIndex + 5,
      4,
      '卡号',
      '4字节物理卡号'
    ),
    cardCategory: extractField(
      cleanedHexData,
      currentIndex + 9,
      1,
      '卡类型',
      '卡类型'
    ),
    mode: extractField(
      cleanedHexData,
      currentIndex + 10,
      1,
      '模式',
      '使用模式'
    ),
    rate: extractField(
      cleanedHexData,
      currentIndex + 11,
      4,
      '费率',
      '时间模式分/秒,流量模式分/脉冲'
    ),
    cardCounter: extractField(
      cleanedHexData,
      currentIndex + 15,
      2,
      '卡计数器',
      '计数器'
    ),
    mainWalletBalance: extractField(
      cleanedHexData,
      currentIndex + 17,
      4,
      '大钱包余额',
      '钱包余额'
    ),
    subsidyCounter: extractField(
      cleanedHexData,
      currentIndex + 21,
      2,
      '补助计数器',
      '计数器'
    ),
    subsidyBalance: extractField(
      cleanedHexData,
      currentIndex + 23,
      4,
      '补助钱包余额',
      '补助钱包余额'
    ),
    usageAmount: extractField(
      cleanedHexData,
      currentIndex + 27,
      4,
      '使用金额',
      '本次使用的金额'
    ),
    tapIndex: extractField(
      cleanedHexData,
      currentIndex + 31,
      2,
      '水龙头索引',
      '第一字节水龙头索引,第二字节水龙头索引补码'
    ),
    cardStatus: extractField(
      cleanedHexData,
      currentIndex + 33,
      1,
      '卡状态',
      '0 正常卡 1挂失卡 2卡不存在'
    ),
    // 更新：学工号+CRC校验共22字节
    studentWorkIdCRC: extractField(
      cleanedHexData,
      currentIndex + 34,
      22,
      '学工号+CRC校验',
      '20字节学工号+CRC校验(4字节账号+4字节卡号+2字节CRC+1字节消费类型)'
    ),
    waterUsage: extractField(
      cleanedHexData,
      currentIndex + 56,
      4,
      '用水量',
      '用水量'
    ),
    waterUsageTime: extractField(
      cleanedHexData,
      currentIndex + 60,
      4,
      '用水时间',
      '用水时间'
    ),
    userId: extractStringField(
      cleanedHexData,
      currentIndex + 64,
      15,
      '用户编号',
      '用户编号'
    ),
    userPassword: extractStringField(
      cleanedHexData,
      currentIndex + 79,
      6,
      '用户密码',
      '用户密码'
    ),
    reservationTimeSlot: extractField(
      cleanedHexData,
      currentIndex + 85,
      8,
      '预约用水时间段',
      '4字节的开始时间,4字节的结束时间'
    ),
    reservationExpiryTime: extractField(
      cleanedHexData,
      currentIndex + 93,
      2,
      '预约后失效时间',
      '预约后失效时间'
    ),
    waterTemperature: extractField(
      cleanedHexData,
      currentIndex + 95,
      2,
      '水温控制',
      '水温控制'
    ),
    timestamp: extractField(
      cleanedHexData,
      currentIndex + 97,
      4,
      '时间戳',
      '时间戳'
    ),
    userName: extractStringField(
      cleanedHexData,
      currentIndex + 101,
      10,
      '姓名',
      '用户姓名'
    )
  };

  // 更新特殊字段的显示数据
  body.cardStatus.description = getCardStatusDescription(
    body.cardStatus.dec as number
  );
  body.timestamp.dec = parseTimestampFrom2000(body.timestamp.hex);

  // Extract CRC (last 2 bytes)
  const dataLength = cleanedHexData.length / 2;
  const crc = extractField(
    cleanedHexData,
    dataLength - 2,
    2,
    'CRC校验码',
    '数据包完整性校验值'
  );

  return {
    header,
    body,
    crc,
    rawData: cleanedHexData
  };
};

/**
 * 解析微信扫码金额命令下位机响应
 */
export const parseWechatQRCodeResponse = (
  hexData: string
): WechatQRCodeResponseData => {
  // Remove any whitespace or non-hex characters
  const cleanedHexData = hexData.replace(/[^0-9A-Fa-f]/g, '');

  if (cleanedHexData.length < 50) {
    throw new Error('数据包长度不足');
  }

  // 检查是否是下位机响应（应该包含03DF0D01）
  if (!cleanedHexData.toLowerCase().includes('03df0d01')) {
    throw new Error('不是有效的微信扫码金额命令下位机响应');
  }

  // 解析协议头
  const header = parseHeader(cleanedHexData, true);

  // 计算响应数据的起始位置
  // 对于下位机响应，数据类型帧是4字节(03df0d01)，随机码是4字节
  // 所以响应数据从数据类型帧后8字节开始
  const frameTypePos = 30;
  const responseDataPos = frameTypePos + 4 + 4; // 数据类型帧(4字节) + 随机码(4字节)

  const body = {
    status: extractField(
      cleanedHexData,
      responseDataPos,
      1,
      '设备状态',
      '00设备空闲,01设备正在使用'
    ),
    cardId: extractField(
      cleanedHexData,
      responseDataPos + 1,
      4,
      '卡号',
      '正在使用的卡号'
    ),
    timestamp: extractField(
      cleanedHexData,
      responseDataPos + 5,
      4,
      '时间戳',
      '自2000年1月1日起的秒数'
    )
  };

  // 更新特殊字段的显示数据
  const statusValue = body.status.dec as number;
  const cardIdHex = body.cardId.hex;

  if (statusValue === 0) {
    body.status.description = '设备空闲';
  } else if (statusValue === 1 && cardIdHex === 'ffffffff') {
    body.status.description = '数据满,无法消费';
  } else if (statusValue === 1) {
    body.status.description = `被卡号(${body.cardId.dec})正在使用该设备`;
  }

  // 使用从2000年开始计算的时间戳
  body.timestamp.dec = parseTimestampFrom2000(body.timestamp.hex);

  // Extract CRC (last 2 bytes)
  const dataLength = cleanedHexData.length / 2;
  const crc = extractField(
    cleanedHexData,
    dataLength - 2,
    2,
    'CRC校验码',
    '数据包完整性校验值'
  );

  return {
    header,
    body,
    crc,
    rawData: cleanedHexData
  };
};

/**
 * 保留原有函数以兼容现有代码
 * Parse wechat QR code protocol data from a hex string
 */
export const parseWechatQRCodeData = (hexData: string): WechatQRCodeData => {
  // Remove any whitespace or non-hex characters
  const cleanedHexData = hexData.replace(/[^0-9A-Fa-f]/g, '');

  if (cleanedHexData.length < 200) {
    throw new Error('数据包长度不足');
  }

  // 判断是请求数据还是响应数据
  const isResponse = cleanedHexData.includes('03df0d01');

  // Parse header fields
  const header = parseHeader(cleanedHexData, isResponse);

  let body = {} as WechatQRCodeData['body'];
  let response = {} as WechatQRCodeData['response'];
  let crc: ProtocolField;

  if (!isResponse) {
    try {
      // 尝试解析为上位机请求
      const requestData = parseWechatQRCodeRequest(cleanedHexData);
      body = requestData.body;
      crc = requestData.crc;

      // 创建空的响应对象
      response = {
        status: {
          label: '设备状态',
          size: 0,
          hex: '',
          dec: '',
          description: '未收到响应'
        },
        cardId: {
          label: '卡号',
          size: 0,
          hex: '',
          dec: '',
          description: '未收到响应'
        },
        timestamp: {
          label: '时间戳',
          size: 0,
          hex: '',
          dec: '',
          description: '未收到响应'
        }
      };
    } catch (error) {
      throw new Error(
        `解析上位机请求失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  } else {
    try {
      // 尝试解析为下位机响应
      const responseData = parseWechatQRCodeResponse(cleanedHexData);
      response = responseData.body;
      crc = responseData.crc;

      // 创建空的请求体对象
      body = {
        cardType: {
          label: '帖类型',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        accountId: {
          label: '账号',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        cardId: {
          label: '卡号',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        cardCategory: {
          label: '卡类型',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        mode: {
          label: '模式',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        rate: {
          label: '费率',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        cardCounter: {
          label: '卡计数器',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        mainWalletBalance: {
          label: '大钱包余额',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        subsidyCounter: {
          label: '补助计数器',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        subsidyBalance: {
          label: '补助钱包余额',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        usageAmount: {
          label: '使用金额',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        tapIndex: {
          label: '水龙头索引',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        cardStatus: {
          label: '卡状态',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        studentWorkIdCRC: {
          label: '学工号+CRC校验',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        waterUsage: {
          label: '用水量',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        waterUsageTime: {
          label: '用水时间',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        userId: {
          label: '用户编号',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        userPassword: {
          label: '用户密码',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        reservationTimeSlot: {
          label: '预约用水时间段',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        reservationExpiryTime: {
          label: '预约后失效时间',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        waterTemperature: {
          label: '水温控制',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        timestamp: {
          label: '时间戳',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        },
        userName: {
          label: '姓名',
          size: 0,
          hex: '',
          dec: '',
          description: '响应数据无此字段'
        }
      };
    } catch (error) {
      throw new Error(
        `解析下位机响应失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  return {
    header,
    body,
    response,
    crc,
    rawData: cleanedHexData
  };
};
