/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { ParsedRule } from '../Contracts'

export function getBaseRules (
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array',
  isOptional: boolean,
): ParsedRule[] {
  const requiredRule = { name: 'required', args: [] }
  const dataTypeRule = { name: dataType, args: [] }

  return isOptional ? [dataTypeRule] : [requiredRule, dataTypeRule]
}
