// Protocol field structure
export interface ProtocolField {
  label: string;
  size: number;
  hex: string;
  dec: number | string;
  description?: string;
}

// Protocol data structure
export interface ProtocolData {
  header: {
    staticId: ProtocolField;
    deviceId: ProtocolField;
    fromDeviceId: ProtocolField;
    protocolType: ProtocolField;
    deviceType: ProtocolField;
    dataLength: ProtocolField;
    frameType: ProtocolField;
    randomCode: ProtocolField;
  };
  body: {
    recordFrame: ProtocolField;
    consumptionType: ProtocolField;
    randomCodeData: ProtocolField;
    accountId: ProtocolField;
    cardId: ProtocolField;
    cardNo: ProtocolField;
    totalAmount: ProtocolField;
    walletBalance: ProtocolField;
    managementFee: ProtocolField;
    subsidyBalance: ProtocolField;
    mainWalletConsumption: ProtocolField;
    mainWalletCounter: ProtocolField;
    subsidyCounter: ProtocolField;
    subsidyConsumption: ProtocolField;
    consumptionTime: ProtocolField;
    recordNo: ProtocolField;
    discountFlag: ProtocolField;
    unsentRecordCount: ProtocolField;
    latestBatchBlacklist: ProtocolField;
    lastIncrementalBlacklist: ProtocolField;
    deviceStatus: ProtocolField;
    currentDeviceTime: ProtocolField;
    physicalCardNo: ProtocolField;
    usageAmount: ProtocolField;
    usageDuration: ProtocolField;
  };
  crc: ProtocolField;
  rawData: string;
}

// 微信扫码金额命令协议数据结构 - 上位机请求
export interface WechatQRCodeRequestData {
  header: {
    staticId: ProtocolField;
    deviceId: ProtocolField;
    fromDeviceId: ProtocolField;
    protocolType: ProtocolField;
    deviceType: ProtocolField;
    dataLength: ProtocolField;
    frameType: ProtocolField;
    randomCode: ProtocolField;
  };
  body: {
    cardType: ProtocolField;
    accountId: ProtocolField;
    cardId: ProtocolField;
    cardCategory: ProtocolField;
    mode: ProtocolField;
    rate: ProtocolField;
    cardCounter: ProtocolField;
    mainWalletBalance: ProtocolField;
    subsidyCounter: ProtocolField;
    subsidyBalance: ProtocolField;
    usageAmount: ProtocolField;
    tapIndex: ProtocolField;
    cardStatus: ProtocolField;
    studentWorkIdCRC: ProtocolField;
    waterUsage: ProtocolField;
    waterUsageTime: ProtocolField;
    userId: ProtocolField;
    userPassword: ProtocolField;
    reservationTimeSlot: ProtocolField;
    reservationExpiryTime: ProtocolField;
    waterTemperature: ProtocolField;
    timestamp: ProtocolField;
    userName: ProtocolField;
  };
  crc: ProtocolField;
  rawData: string;
}

// 微信扫码金额命令协议数据结构 - 下位机响应
export interface WechatQRCodeResponseData {
  header: {
    staticId: ProtocolField;
    deviceId: ProtocolField;
    fromDeviceId: ProtocolField;
    protocolType: ProtocolField;
    deviceType: ProtocolField;
    dataLength: ProtocolField;
    frameType: ProtocolField;
    randomCode: ProtocolField;
  };
  body: {
    status: ProtocolField;
    cardId: ProtocolField;
    timestamp: ProtocolField;
  };
  crc: ProtocolField;
  rawData: string;
}

// 保留原有接口以兼容现有代码
export interface WechatQRCodeData {
  header: {
    staticId: ProtocolField;
    deviceId: ProtocolField;
    fromDeviceId: ProtocolField;
    protocolType: ProtocolField;
    deviceType: ProtocolField;
    dataLength: ProtocolField;
    frameType: ProtocolField;
    randomCode: ProtocolField;
  };
  body: {
    cardType: ProtocolField;
    accountId: ProtocolField;
    cardId: ProtocolField;
    cardCategory: ProtocolField;
    mode: ProtocolField;
    rate: ProtocolField;
    cardCounter: ProtocolField;
    mainWalletBalance: ProtocolField;
    subsidyCounter: ProtocolField;
    subsidyBalance: ProtocolField;
    usageAmount: ProtocolField;
    tapIndex: ProtocolField;
    cardStatus: ProtocolField;
    studentWorkIdCRC: ProtocolField;
    waterUsage: ProtocolField;
    waterUsageTime: ProtocolField;
    userId: ProtocolField;
    userPassword: ProtocolField;
    reservationTimeSlot: ProtocolField;
    reservationExpiryTime: ProtocolField;
    waterTemperature: ProtocolField;
    timestamp: ProtocolField;
    userName: ProtocolField;
  };
  response: {
    status: ProtocolField;
    cardId: ProtocolField;
    timestamp: ProtocolField;
  };
  crc: ProtocolField;
  rawData: string;
}
