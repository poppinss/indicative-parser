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
  TypedSchema,
  DictTypeDeclarations,
  ArrayTypeDeclaration,
  ObjectTypeDeclaration,
  OptionalArrayTypeDeclaration,
} from '../Contracts'

import { getArrayType } from '../utils/getArrayType'

/**
 * Create an array type schema node
 */
export function array (...rules: ParsedRule[]): {
  members: (
    <Schema extends DictTypeDeclarations | TypedSchema>(
      schema: Schema,
    ) => ArrayTypeDeclaration<Schema extends TypedSchema ? ObjectTypeDeclaration<Schema> : Schema>
  )
} {
  return {
    members (schema): any {
      return getArrayType(schema, false, rules)
    },
  }
}

/**
 * Create an optional array type schema node
 */
array.optional = (...rules: ParsedRule[]): {
  members: (
  <Schema extends DictTypeDeclarations | TypedSchema>(
    schema: Schema,
  ) => OptionalArrayTypeDeclaration<Schema extends TypedSchema ? ObjectTypeDeclaration<Schema> : Schema>
  )
} => {
  return {
    members (schema): any {
      return getArrayType(schema, true, rules)
    },
  }
}
