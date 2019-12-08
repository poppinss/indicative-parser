/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { getBaseRules } from './getBaseRules'
import { ParsedRule, SchemaNodeLiteral } from '../Contracts'

export function getLiteralType (
  type: 'string' | 'boolean' | 'number',
  rules: ParsedRule[],
  isOptional: boolean,
): { rules: ParsedRule[], getTree (): SchemaNodeLiteral } {
  return {
    rules: rules,
    getTree (): SchemaNodeLiteral {
      return {
        type: 'literal',
        rules: getBaseRules(type, isOptional).concat(rules || []),
      }
    },
  }
}
