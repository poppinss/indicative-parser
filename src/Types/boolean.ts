/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { BooleanTypeDeclaration, OptionalBooleanTypeDeclaration, ParsedRule } from '../Contracts'
import { getLiteralType } from '../utils/getLiteralType'

/**
 * Define a boolean
 */
export const boolean = (...rules: ParsedRule[]): BooleanTypeDeclaration => {
  return getLiteralType('boolean', rules || [], false) as unknown as BooleanTypeDeclaration
}

/**
 * Define an optional boolean
 */
boolean.optional = (...rules: ParsedRule[]): OptionalBooleanTypeDeclaration => {
  return getLiteralType('boolean', rules || [], true) as unknown as OptionalBooleanTypeDeclaration
}
