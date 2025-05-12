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
