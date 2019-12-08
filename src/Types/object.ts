/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import {
  TypedSchema,
  ObjectTypeDeclaration,
  OptionalObjectTypeDeclaration,
} from '../Contracts'
import { getObjectType } from '../utils/getObjectType'

/**
 * Create an object type schema node
 */
export function object (): {
  members: (<Schema extends TypedSchema>(schema: Schema) => ObjectTypeDeclaration<Schema>)
} {
  return {
    members (schema): any {
      return getObjectType(schema, false)
    },
  }
}

/**
 * Create an optional object type schema node
 */
object.optional = (): {
  members: (<Schema extends TypedSchema>(schema: Schema) => OptionalObjectTypeDeclaration<Schema>)
} => {
  return {
    members (schema): any {
      return getObjectType(schema, true)
    },
  }
}
