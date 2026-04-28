export type PocketBaseEnvironment =
  | 'android-emulator'
  | 'physical-device'
  | 'production';

export interface PocketBaseConfig {
  baseUrl: string;
  environment: PocketBaseEnvironment;
}

const androidEmulatorConfig: PocketBaseConfig = {
  environment: 'android-emulator',
  baseUrl: 'http://10.0.2.2:8090',
};

const physicalDeviceConfig: PocketBaseConfig = {
  environment: 'physical-device',
  baseUrl: 'http://192.168.1.100:8090',
};

const productionConfig: PocketBaseConfig = {
  environment: 'production',
  baseUrl: 'https://replace-before-production.invalid',
};

export function getPocketBaseConfig(
  environment: PocketBaseEnvironment = 'android-emulator',
): PocketBaseConfig {
  if (environment === 'physical-device') {
    return physicalDeviceConfig;
  }

  if (environment === 'production') {
    return productionConfig;
  }

  return androidEmulatorConfig;
}
