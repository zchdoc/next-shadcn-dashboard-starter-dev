import { ProtocolData, ProtocolField } from './types';

/**
 * Convert hex string to decimal number
 */
const hexToDec = (hex: string): number => {
  return parseInt(hex, 16);
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
    return 'Invalid date format';
  }

  const year = parseInt(hex.substring(0, 2), 16);
  const month = parseInt(hex.substring(2, 4), 16);
  const day = parseInt(hex.substring(4, 6), 16);
  const hour = parseInt(hex.substring(6, 8), 16);
  const minute = parseInt(hex.substring(8, 10), 16);
  const second = parseInt(hex.substring(10, 12), 16);

  // Format: 20YY-MM-DD HH:MM:SS
  return `20${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
};

/**
 * Parse protocol data from a hex string
 */
export const parseProtocolData = (hexData: string): ProtocolData => {
  // Remove any whitespace or non-hex characters
  hexData = hexData.replace(/[^0-9A-Fa-f]/g, '');

  if (hexData.length < 200) {
    throw new Error('Data packet is too short');
  }

  // Parse header fields
  const header = {
    staticId: extractField(hexData, 0, 16, 'Static ID'),
    deviceId: extractField(hexData, 16, 4, 'Device ID'),
    fromDeviceId: extractField(hexData, 20, 4, 'From Device ID'),
    protocolType: extractField(hexData, 24, 2, 'Protocol Type'),
    deviceType: extractField(hexData, 26, 2, 'Device Type'),
    dataLength: extractField(hexData, 28, 2, 'Data Length'),
    frameType: extractField(hexData, 30, 2, 'Frame Type'),
    randomCode: extractField(hexData, 32, 4, 'Random Code')
  };

  // Parse body fields - starting from index 36 (after header)
  const body = {
    recordFrame: extractField(hexData, 36, 1, 'Record Frame'),
    consumptionType: extractField(hexData, 37, 1, 'Consumption Type'),
    randomCodeData: extractField(hexData, 38, 4, 'Random Code Data'),
    accountId: extractField(hexData, 42, 4, 'Account ID'),
    cardId: extractField(hexData, 46, 4, 'Card ID'),
    cardNo: extractField(hexData, 50, 1, 'Card No'),
    totalAmount: extractField(hexData, 51, 4, 'Total Amount'),
    walletBalance: extractField(hexData, 55, 4, 'Wallet Balance'),
    managementFee: extractField(hexData, 59, 4, 'Management Fee'),
    subsidyBalance: extractField(hexData, 63, 4, 'Subsidy Balance'),
    mainWalletConsumption: extractField(
      hexData,
      67,
      4,
      'Main Wallet Consumption'
    ),
    mainWalletCounter: extractField(hexData, 71, 2, 'Main Wallet Counter'),
    subsidyCounter: extractField(hexData, 73, 2, 'Subsidy Counter'),
    subsidyConsumption: extractField(hexData, 75, 4, 'Subsidy Consumption')
  };

  // Extract consumption time as a special case (BCD format)
  const consumptionTimeHex = hexData.substring(79 * 2, (79 + 6) * 2);
  body.consumptionTime = {
    label: 'Consumption Time',
    size: 6,
    hex: consumptionTimeHex,
    dec: parseBCDDateTime(consumptionTimeHex)
  };

  // Continue with remaining body fields
  body.recordNo = extractField(hexData, 85, 2, 'Record No');
  body.discountFlag = extractField(hexData, 87, 1, 'Discount Flag');
  body.unsentRecordCount = extractField(hexData, 88, 2, 'Unsent Record Count');
  body.latestBatchBlacklist = extractField(
    hexData,
    90,
    2,
    'Latest Batch Blacklist'
  );
  body.lastIncrementalBlacklist = extractField(
    hexData,
    92,
    4,
    'Last Incremental Blacklist'
  );
  body.deviceStatus = extractField(hexData, 96, 1, 'Device Status');

  // Extract current device time (BCD format)
  const currentDeviceTimeHex = hexData.substring(97 * 2, (97 + 6) * 2);
  body.currentDeviceTime = {
    label: 'Current Device Time',
    size: 6,
    hex: currentDeviceTimeHex,
    dec: parseBCDDateTime(currentDeviceTimeHex)
  };

  body.physicalCardNo = extractField(hexData, 103, 4, 'Physical Card No');
  body.usageAmount = extractField(hexData, 107, 4, 'Usage Amount');
  body.usageDuration = extractField(hexData, 111, 4, 'Usage Duration');

  // Extract CRC (last 2 bytes)
  const dataLength = hexData.length / 2;
  const crc = extractField(hexData, dataLength - 2, 2, 'CRC Checksum');

  return {
    header,
    body,
    crc,
    rawData: hexData
  };
};

/**
 * Get a description for a consumption type value
 */
export const getConsumptionTypeDescription = (value: number): string => {
  switch (value) {
    case 1:
      return 'Main Wallet Consumption';
    case 2:
      return 'Subsidy Wallet Consumption';
    case 3:
      return 'Mixed Consumption';
    default:
      return 'Unknown';
  }
};

/**
 * Get a description for a device status value
 */
export const getDeviceStatusDescription = (value: number): string => {
  const descriptions = [];

  if (value & 0x01) {
    descriptions.push('Blacklist sent completely');
  }

  if (value & 0x02) {
    descriptions.push('Terminal has subsidy authorization');
  }

  if (value & 0x04) {
    descriptions.push('Terminal has online registration authorization');
  }

  return descriptions.length > 0 ? descriptions.join(', ') : 'No flags set';
};

/**
 * Get a description for a discount flag value
 */
export const getDiscountFlagDescription = (value: number): string => {
  return value & 0x80 ? 'Discount applied' : 'Service fee applied';
};
