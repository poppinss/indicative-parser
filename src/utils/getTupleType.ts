/*
 * indicative-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SchemaNodeArray, DictTypeDeclarations, ParsedRule } from '../Contracts'
import { getBaseRules } from './getBaseRules'

/**
 * Returns runtime node for an array type.
 */
export function getTupleType (
  schemas: DictTypeDeclarations[],
  isOptional: boolean,
  rules: ParsedRule[],
): { getTree (): SchemaNodeArray } {
  return {
    getTree (): SchemaNodeArray {
      const payload: SchemaNodeArray = {
        type: 'array',
        rules: getBaseRules('array', isOptional)
          .concat([{ name: 'size', args: [schemas.length] }]) // Enforce length
          .concat(rules),
        each: {},
      }

      schemas.forEach((schema, index) => {
        const children = schema.getTree()

        if ((children.type as any) === 'array') {
          throw new Error('2d arrays are currently not supported')
        }

        payload.each[index] = {
          /**
           * Nodes of array cannot be marked as required and hence `size`
           * rule must be used on array for same
           */
          rules: children.rules.filter(({ name }) => name !== 'required'),
          children: children.type === 'object' ? children.children : {},
        }
      })

      return payload
    },
  }
}
