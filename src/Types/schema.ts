/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { TypedSchema, ParsedTypedSchema } from '../Contracts'

/**
 * Parses a schema and returns it's parsed tree along with a
 * superficial object to be used as types.
 */
export function schema<
  Schema extends TypedSchema,
> (definedSchema: Schema): ParsedTypedSchema<Schema> {
  return Object.keys(definedSchema).reduce((result, key) => {
    result.schema[key] = definedSchema[key].getTree()
    return result
  }, { schema: {} }) as unknown as ParsedTypedSchema<Schema>
}
