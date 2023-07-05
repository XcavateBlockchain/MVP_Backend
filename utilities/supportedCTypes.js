import { personalCType } from '../cTypes/personalCType.js'
import { twitterCType } from '../cTypes/twitterCType.js'
import { companyCtype } from '../cTypes/companyCType.js'
import { driverCType } from '../cTypes/driverCType.js'

export const supportedCTypeKeys = ['personal', 'twitter', 'company', 'driver']

export const supportedCTypes = {
  personal: personalCType,
  twitter: twitterCType,
  company: companyCtype,
  driver: driverCType,
}

export const kiltCost= {
  personal: 5,
  twitter: 3,
  company: 1,
  driver: 2,
}

export function isSupportedCType(cType) {
  return supportedCTypeKeys.includes(cType)
}
