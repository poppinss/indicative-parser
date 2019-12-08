/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { getBaseRules } from './getBaseRules'
import { TypedSchema, SchemaNodeObject } from '../Contracts'

/**
 * Returns runtime node for an object type.
 */
export function getObjectType (schema: TypedSchema, isOptional: boolean): { getTree (): SchemaNodeObject } {
  return {
    getTree (): SchemaNodeObject {
      return {
        type: 'object',
        rules: getBaseRules('object', isOptional),
        children: Object.keys(schema).reduce((result, key) => {
          result[key] = schema[key].getTree()
          return result
        }, {}),
      }
    },
  }
}
