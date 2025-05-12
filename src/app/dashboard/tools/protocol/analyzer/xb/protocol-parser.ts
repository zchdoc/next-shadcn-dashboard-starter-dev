import type { ProtocolData, ProtocolField } from './types';

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
 * Parse a hex string as a date-time value (BCD format)
 */
const parseBCDDateTime = (hex: string): string => {
  if (hex.length !== 12) {
    return '日期格式无效';
  }
  // 240103203220
  // const year = Number.parseInt(hex.substring(0, 2), 16);
  // const month = Number.parseInt(hex.substring(2, 4), 16);
  // const day = Number.parseInt(hex.substring(4, 6), 16);
  // const hour = Number.parseInt(hex.substring(6, 8), 16);
  // const minute = Number.parseInt(hex.substring(8, 10), 16);
  // const second = Number.parseInt(hex.substring(10, 12), 16);
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
 * Parse protocol data from a hex string
 */
export const parseProtocolData = (hexData: string): ProtocolData => {
  // Remove any whitespace or non-hex characters
  const cleanedHexData = hexData.replace(/[^0-9A-Fa-f]/g, '');

  if (cleanedHexData.length < 200) {
    throw new Error('数据包长度不足');
  }

  // Parse header fields
  const header = {
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
      30,
      2,
      '数据类型帧',
      '也称为关键帧'
    ),
    randomCode: extractField(
      cleanedHexData,
      32,
      4,
      '随机码',
      '数据包的随机标识符'
    )
  };

  // Parse body fields - starting from index 30 (after header)
  const body = {
    recordFrame: extractField(
      cleanedHexData,
      30,
      1,
      '记录帧',
      '数据帧类型标识'
    ),
    consumptionType: extractField(
      cleanedHexData,
      31,
      1,
      '消费类型',
      '1:大钱包消费; 2:补助钱包消费; 3:混合消费'
    ),
    randomCodeData: extractField(
      cleanedHexData,
      32,
      4,
      '随机码数据',
      '内部随机标识符'
    ),
    accountId: extractField(cleanedHexData, 36, 4, '账号', '用户账号标识'),
    cardId: extractField(cleanedHexData, 40, 4, '卡号', '卡片唯一标识'),
    cardNo: extractField(cleanedHexData, 44, 1, '卡序号', '卡片序列号'),
    totalAmount: extractField(cleanedHexData, 45, 4, '卡总额', '卡片总金额'),
    walletBalance: extractField(
      cleanedHexData,
      49,
      4,
      '钱包余额',
      '钱包当前余额'
    ),
    managementFee: extractField(
      cleanedHexData,
      53,
      4,
      '管理费金额',
      '优惠打折或手续费'
    ),
    subsidyBalance: extractField(
      cleanedHexData,
      57,
      4,
      '补助余额',
      '补助钱包当前余额'
    ),
    mainWalletConsumption: extractField(
      cleanedHexData,
      61,
      4,
      '大钱包消费金额',
      '本次从主钱包消费的金额'
    ),
    mainWalletCounter: extractField(
      cleanedHexData,
      65,
      2,
      '大钱包计数器',
      '主钱包消费计数'
    ),
    subsidyCounter: extractField(
      cleanedHexData,
      67,
      2,
      '补助计数器',
      '补助钱包消费计数'
    ),
    subsidyConsumption: extractField(
      cleanedHexData,
      69,
      4,
      '补助消费金额',
      '本次从补助钱包消费的金额'
    ),
    consumptionTime: extractField(
      cleanedHexData,
      73,
      6,
      '消费时间',
      'BCD格式的消费时间'
    ),
    recordNo: extractField(
      cleanedHexData,
      79,
      2,
      '记录序号',
      '消费记录唯一序号'
    ),
    discountFlag: extractField(
      cleanedHexData,
      81,
      1,
      '打折优惠',
      '最高位为1表示优惠，为0表示加上的手续费'
    ),
    unsentRecordCount: extractField(
      cleanedHexData,
      82,
      2,
      '未发送记录条数',
      '设备中未上传的记录数量'
    ),
    latestBatchBlacklist: extractField(
      cleanedHexData,
      84,
      2,
      '最新批次黑名单',
      '最新的黑名单批次号'
    ),
    lastIncrementalBlacklist: extractField(
      cleanedHexData,
      86,
      4,
      '最后一个增量黑名单',
      '最后处理的增量黑名单标识'
    ),
    deviceStatus: extractField(
      cleanedHexData,
      90,
      1,
      '设备状态',
      'bit0:黑名单发送完毕 bit1:终端有补助授权 bit2:终端有联机注册授权'
    ),
    currentDeviceTime: extractField(
      cleanedHexData,
      91,
      6,
      '当前设备时间',
      'BCD格式的设备当前时间'
    ),
    physicalCardNo: extractField(
      cleanedHexData,
      97,
      4,
      '物理卡号',
      '卡片的物理识别号'
    ),
    usageAmount: extractField(
      cleanedHexData,
      101,
      4,
      '使用量',
      '设备使用的资源量'
    ),
    usageDuration: extractField(
      cleanedHexData,
      105,
      4,
      '使用时长',
      '设备使用的时长'
    )
  };

  // 更新特殊字段的显示数据
  // 消费类型
  body.consumptionType.description = getConsumptionTypeDescription(
    body.consumptionType.dec as number
  );

  // 设备状态
  body.deviceStatus.description = getDeviceStatusDescription(
    body.deviceStatus.dec as number
  );

  // 打折优惠
  body.discountFlag.description = getDiscountFlagDescription(
    body.discountFlag.dec as number
  );

  // 消费时间
  const consumptionTimeHex = cleanedHexData.substring(73 * 2, (73 + 6) * 2);
  body.consumptionTime = {
    label: '消费时间',
    size: 6,
    hex: consumptionTimeHex,
    dec: parseBCDDateTime(consumptionTimeHex),
    description: 'BCD格式的时间戳'
  };

  // 当前设备时间
  const currentDeviceTimeHex = cleanedHexData.substring(91 * 2, (91 + 6) * 2);
  body.currentDeviceTime = {
    label: '当前设备时间',
    size: 6,
    hex: currentDeviceTimeHex,
    dec: parseBCDDateTime(currentDeviceTimeHex),
    description: 'BCD格式的时间戳'
  };

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
 * Get a description for a consumption type value
 */
export const getConsumptionTypeDescription = (value: number): string => {
  switch (value) {
    case 1:
      return '大钱包消费';
    case 2:
      return '补助钱包消费';
    case 3:
      return '混合消费';
    default:
      return '未知消费类型';
  }
};

/**
 * Get a description for a device status value
 */
export const getDeviceStatusDescription = (value: number): string => {
  const descriptions = [];

  if (value & 0x01) {
    descriptions.push('黑名单已发送完毕');
  }

  if (value & 0x02) {
    descriptions.push('终端有补助授权');
  }

  if (value & 0x04) {
    descriptions.push('终端有联机注册授权');
  }

  return descriptions.length > 0 ? descriptions.join('，') : '无标志位设置';
};

/**
 * Get a description for a discount flag value
 */
export const getDiscountFlagDescription = (value: number): string => {
  return value & 0x80 ? '优惠已应用' : '服务费已应用';
};
