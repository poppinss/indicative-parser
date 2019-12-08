/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { TypedSchema, SchemaNodeArray, DictTypeDeclarations, ParsedRule } from '../Contracts'
import { getBaseRules } from './getBaseRules'
import { getObjectType } from './getObjectType'

/**
 * Returns runtime node for an array type.
 */
export function getArrayType (
  schema: DictTypeDeclarations | TypedSchema,
  isOptional: boolean,
  rules: ParsedRule[],
): { getTree (): SchemaNodeArray } {
  return {
    getTree (): SchemaNodeArray {
      const children = typeof (schema.getTree) === 'function'
        ? schema.getTree()
        : getObjectType(schema as TypedSchema, false).getTree()

      if ((children.type as any) === 'array') {
        throw new Error('2d arrays are currently not supported')
      }

      return {
        type: 'array',
        rules: getBaseRules('array', isOptional).concat(rules),
        each: {
          '*': {
            /**
             * Nodes of array cannot be marked as required and hence `size`
             * rule must be used on array for same
             */
            rules: children.rules.filter(({ name }) => name !== 'required'),
            children: children.type === 'object' ? children.children : {},
          },
        },
      }
    },
  }
}
