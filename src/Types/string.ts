/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { getLiteralType } from '../utils/getLiteralType'
import { ParsedRule, StringTypeDeclaration, OptionalStringTypeDeclaration } from '../Contracts'

/**
 * Define a string
 */
export const string = (...rules: ParsedRule[]): StringTypeDeclaration => {
  return getLiteralType('string', rules || [], false) as unknown as StringTypeDeclaration
}

/**
 * Define an optional string
 */
string.optional = (...rules: ParsedRule[]): OptionalStringTypeDeclaration => {
  return getLiteralType('string', rules || [], true) as unknown as OptionalStringTypeDeclaration
}
