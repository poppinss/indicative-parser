/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { TypedSchema, ParsedSchema } from '../Contracts'

/**
 * Parses a schema and returns it's parsed tree along with a
 * superficial object to be used as types.
 */
export function schema<
  Schema extends TypedSchema,
  ReturnType extends { [K in keyof Schema]: Schema[K]['t'] },
> (definedSchema: Schema): {
  props: ReturnType,
  schema: ParsedSchema,
} {
  return Object.keys(definedSchema).reduce((result, key) => {
    result.schema[key] = definedSchema[key].getTree()
    return result
  }, { schema: {} }) as unknown as {
    schema: ParsedSchema,
    props: ReturnType,
  }
}
