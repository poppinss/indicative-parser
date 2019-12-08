/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import {
  ParsedRule,
  DictTypeDeclarations,
  TupleTypeDeclaration,
  OptionalTupleTypeDeclaration,
} from '../Contracts'
import { getTupleType } from '../utils/getTupleType'

/**
 * Create an array with fixed number of children
 */
export function tuple (...rules: ParsedRule[]): {
  members: (
    <Schema extends DictTypeDeclarations[]>(
      ...schema: Schema
    ) => TupleTypeDeclaration<Schema>
  )
} {
  return {
    members (...schema): any {
      return getTupleType(schema, false, rules)
    },
  }
}

/**
 * Create an optional array with fixed number of children
 */
tuple.optional = (...rules: ParsedRule[]): {
  members: (
  <Schema extends DictTypeDeclarations[]>(
    ...schema: Schema
  ) => OptionalTupleTypeDeclaration<Schema>
  )
} => {
  return {
    members (...schema): any {
      return getTupleType(schema, true, rules)
    },
  }
}
