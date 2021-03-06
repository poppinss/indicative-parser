/*
* indicative-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import Pipe from 'haye/dist/haye-pipe'
import ArrayPresenter from 'haye/dist/haye-array-presenter'

import {
  Schema,
  Messages,
  ParsedRule,
  ParsedSchema,
  ParsedMessages,
  SchemaNodeArray,
  SchemaNodeObject,
  SchemaNodeLiteral,
} from './Contracts'

function toCamelCase (ruleName: string): string {
  return ruleName.replace(/_(\w)/g, (_match, group) => group.toUpperCase())
}

/**
 * Updates rules on the given node. If node is missing, then a literal node is
 * created automatically. Literal nodes can later transform into `object` and
 * `array` nodes.
 */
function setLiteral (source: ParsedSchema, key: string, rules: ParsedRule[]): SchemaNodeLiteral {
  const item = (source[key] || { type: 'literal' }) as SchemaNodeLiteral
  item.rules = rules
  source[key] = item

  return item
}

/**
 * Creates/updates literal node to an object node. Since `object` node
 * properties are different from `literal` node, we need to set those
 * properties (if missing).
 *
 * If node already exists and is an array node, then this method will raise an
 * exception
 */
function setObject (source: ParsedSchema, key: string): SchemaNodeObject {
  if (source[key] && source[key].type === 'array') {
    throw new Error(`cannot reshape ${key} array to an object`)
  }

  const item = (source[key] || { rules: [] }) as SchemaNodeObject
  item.type = 'object'
  item.children = item.children || {}

  source[key] = item
  return item
}

/**
 * Creates/updates literal node to an array node. Since `array` node
 * properties are different from `literal` node, we need to set those
 * properties (if missing).
 *
 * If node already exists and is an object node, then this method will raise an
 * exception
 */
function setArray (source: ParsedSchema, key: string, index: string): SchemaNodeArray {
  if (source[key] && source[key].type === 'object') {
    throw new Error(`cannot reshape ${key} object to an array`)
  }

  const item = (source[key] || { rules: [] }) as SchemaNodeArray
  item.each = item.each || {}
  item.each[index] = item.each[index] || { children: {}, rules: [] }
  item.type = 'array'

  source[key] = item
  return item
}

/**
 * Parses field tokens recursively to a [[ParsedSchema]] tree
 */
function parseFieldForRules (
  tokens: string[],
  rules: ParsedRule[],
  out: ParsedSchema | SchemaNodeArray,
  index = 0,
): void {
  const token = tokens[index++]

  /**
   * Finding if we are on the last item. Last item defines
   * the rules for the current node inside the tree
   */
  const isLast = tokens.length === index

  /**
   * Indexed array have `digits` like `users.0.username`
   */
  const isIndexedArray = /^\d+$/.test(tokens[index])

  /**
   * Is upcoming token an array
   */
  const isArray = tokens[index] === '*' || isIndexedArray

  /**
   * Last item was marked as array, since current token is a `*`
   * or has defined index
   */
  if (token === '*' || /^\d+$/.test(token)) {
    /**
     * Last item must update rules for each item for the array
     */
    if (isLast) {
      (out as SchemaNodeArray).each[token].rules = rules
      return
    }

    /**
     * Nested arrays
     */
    if (isArray) {
      /**
       * The code after the error works fine. However, in order to support
       * 2d arrays, we need to implement them inside the declarative
       * schema and compiler as well.
       *
       * For now, it's okay to skip this feature and later work on it
       * across all the modules.
       */
      throw new Error('2d arrays are currently not supported')
      // const item = setArray(
      //   (out as SchemaNodeArray).each[token].children,
      //   token,
      //   isIndexedArray ? tokens[index] : '*',
      // )
      // return parseFieldForRules(tokens, rules, item, index)
    }

    /**
     * Otherwise continue recursion
     */
    return parseFieldForRules(tokens, rules, (out as SchemaNodeArray).each[token].children, index)
  }

  /**
   * Last item in the list of tokens. we must
   * patch the rules here.
   */
  if (isLast) {
    setLiteral(out as ParsedSchema, token, rules)
    return
  }

  /**
   * Current item as an array
   */
  if (isArray) {
    const item = setArray(out as ParsedSchema, token, isIndexedArray ? tokens[index] : '*')
    return parseFieldForRules(tokens, rules, item, index)
  }

  /**
   * Falling back to object
   */
  const item = setObject(out as ParsedSchema, token)
  return parseFieldForRules(tokens, rules, item.children, index)
}

/**
 * Parses the schema object to a tree of parsed schema. The
 * output is optimized for executing validation rules.
 *
 * @example
 * ```
 * parser({
 *  'users.*.username': 'required'
 * })
 *
 * // output
 *
 * {
 *   users: {
 *    type: 'array',
 *    rules: [],
 *    each: {
 *      '*': {
 *        rules: [],
 *        children: {
 *          username: {
 *            type: 'literal',
 *            rules: [{
 *              name: 'required',
 *              args: []
 *            }]
 *          }
 *        }
 *      }
 *    }
 *   }
 * }
 * ```
 */
export function rulesParser (schema: Schema): ParsedSchema {
  return Object
    .keys(schema)
    .reduce((result: ParsedSchema, field: string) => {
      const rules = schema[field]
      let parsedRules: ParsedRule[] = []

      if (!rules) {
        throw new Error(`make sure to define rules for ${field}`)
      }

      if (typeof (rules) === 'string') {
        parsedRules = new Pipe(rules, new ArrayPresenter()).map((rule) => {
          return { name: toCamelCase(rule.name), args: rule.args }
        })
      } else {
        parsedRules = rules
      }

      parseFieldForRules(field.split('.'), parsedRules, result)
      return result
    }, {})
}

/**
 * Parses an object of messages to [[ParsedMessages]] list. The messages list
 * is simpler than rules tree, since compiler can use the schema tree to find
 * the appropriate messages from the flat list of messages.
 *
 * @example
 * ```
 * parser({
 *  'users.*.username.required': 'Username is required'
 * })
 *
 * // output
 *
 * {
 *   fields: {
 *    'users.*.username': {
 *      required: 'Username is required'
 *    }
 *   },
 *   rules: {},
 * }
 */
export function messagesParser (schema: Messages): ParsedMessages {
  return Object
    .keys(schema)
    .reduce((result: ParsedMessages, field: string) => {
      const message = schema[field]
      const tokens = field.split('.')
      const rule = toCamelCase(tokens.pop() as string)

      /**
       * If token length is 1, then it is a plain rule vs `field.rule`
       */
      if (!tokens.length) {
        result.rules[rule] = message
        return result
      }

      const qualifiedName = tokens.join('.')
      result.fields[qualifiedName] = result.fields[qualifiedName] || {}
      result.fields[qualifiedName][rule] = message

      return result
    }, { fields: {}, rules: {} })
}
