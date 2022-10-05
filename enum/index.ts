export enum PlatFormEnum {
  ANDROID = 'android',
  IOS = 'ios',
}

export enum PinRequiredEnum {
  ENABLE_PIN_CODE = 'ENABLE_PIN_CODE',
  DISABLE_PIN_CODE = 'DISABLE_PIN_CODE',
  CHANGE_PIN_CODE = 'CHANGE_PIN_CODE',
  NULL = '',
}

export enum BiometricTypeEnum {
  BIOMETRIC_TYPE_FACE = 'BIOMETRIC_TYPE_FACE',
  BIOMETRIC_TYPE_FINGERPRINT = 'BIOMETRIC_TYPE_FINGERPRINT',
  ONLY_PIN_CODE = 'ONLY_PIN_CODE', // default
}

export enum TabFilterEnum {
  NFT = 'NFT',
  TOKEN = 'TOKEN',
  HISTORY = 'HISTORY',
}

export enum GoogleClientIdEnum {
  IOS = '221986677902-e1f9p5uu9p264ps5ucucmgjh6h6dmvfi.apps.googleusercontent.com',
  WEB = '221986677902-v9iphnjhr6hsulo9pl04ov2e7q2gg8op.apps.googleusercontent.com',
}
