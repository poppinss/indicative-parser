/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { NumberTypeDeclaration, OptionalNumberTypeDeclaration, ParsedRule } from '../Contracts'
import { getLiteralType } from '../utils/getLiteralType'

/**
 * Define a number
 */
export const number = (...rules: ParsedRule[]): NumberTypeDeclaration => {
  return getLiteralType('number', rules || [], false) as unknown as NumberTypeDeclaration
}

/**
 * Define an optional number
 */
number.optional = (...rules: ParsedRule[]): OptionalNumberTypeDeclaration => {
  return getLiteralType('number', rules || [], true) as unknown as OptionalNumberTypeDeclaration
}
