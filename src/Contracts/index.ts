/*
* indicative-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

/**
 * Parsed rule is created by parsing a single rule defination
 * like `required` or `min:4`
 */
export type ParsedRule = {
  name: string,
  args: any[],
}

/**
 * Array node defines the fields which uses one of the following
 * array expressions.
 *
 * 1. users.*.username
 * 2. users.*
 * 3. users.0.username
 * 4. users.0
 */
export type SchemaNodeArray = {
  type: 'array',
  rules: ParsedRule[],
  each: {
    [index: string]: {
      rules: ParsedRule[],
      children: ParsedSchema,
    },
  },
}

/**
 * Object node defines the fields which uses one of the following
 * object expressions.
 *
 * 1. user.username
 */
export type SchemaNodeObject = {
  type: 'object',
  rules: ParsedRule[],
  children: ParsedSchema,
}

/**
 * Literal are leaf nodes inside the tree. A literal can exist
 * on an array or object or direct leafs of a flat tree
 */
export type SchemaNodeLiteral = {
  type: 'literal',
  rules: ParsedRule[],
}

/**
 * Shape of the schema defined by the end user. In the later version
 * we may drop the `string` based rules
 */
export type Schema = {
  [field: string]: string | ParsedRule[],
}

/**
 * The shape of schema after parser parses it
 */
export type ParsedSchema = {
  [field: string]: SchemaNodeArray | SchemaNodeLiteral | SchemaNodeObject,
}

/**
 * Shape of a single validation message. The functions are evaluated at runtime
 */
export type Message = string | ((field: string, validation: string, args: any[]) => string)

/**
 * ------------------------------------------------------------------------
 * Types for the declarative schema
 * ------------------------------------------------------------------------
 */

/**
 * Typed string
 */
export type OpaqueString = string & { readonly __opaque__: 'string' }
export type StringTypeDeclaration = {
  t: OpaqueString,
  getTree (): SchemaNodeLiteral
}
export type OptionalStringTypeDeclaration = {
  t?: OpaqueString,
  getTree (): SchemaNodeLiteral
}

/**
 * Typed number
 */
export type OpaqueNumber = number & { readonly __opaque__: 'number' }
export type NumberTypeDeclaration = {
  t: OpaqueNumber,
  getTree (): SchemaNodeLiteral
}
export type OptionalNumberTypeDeclaration = {
  t?: OpaqueNumber,
  getTree (): SchemaNodeLiteral
}

/**
 * Typed boolean
 */
export type OpaqueBoolean = boolean & { readonly __opaque__: 'boolean' }
export type BooleanTypeDeclaration = {
  t: OpaqueBoolean,
  getTree (): SchemaNodeLiteral
}
export type OptionalBooleanTypeDeclaration = {
  t?: OpaqueBoolean,
  getTree (): SchemaNodeLiteral
}

/**
 * Typed object
 */
export type ObjectTypeDeclaration<T extends TypedSchema> = {
  t: { [P in keyof T]: T[P]['t'] },
  getTree (): SchemaNodeObject
}
export type OptionalObjectTypeDeclaration<T extends TypedSchema> = {
  t?: { [P in keyof T]: T[P]['t'] },
  getTree (): SchemaNodeObject
}

/**
 * Typed array
 */
export type ArrayTypeDeclaration<T extends DictTypeDeclarations> = {
  t: T['t'][],
  getTree (): SchemaNodeArray
}
export type OptionalArrayTypeDeclaration<T extends DictTypeDeclarations> = {
  t?: T['t'][],
  getTree (): SchemaNodeArray
}

/**
 * Typed tuple
 */
export type TupleTypeDeclaration<T extends DictTypeDeclarations[]> = {
  t: { [P in keyof T]: T[P] extends DictTypeDeclarations ? T[P]['t'] : never },
  getTree (): SchemaNodeArray
}
export type OptionalTupleTypeDeclaration<T extends DictTypeDeclarations[]> = {
  t?: { [P in keyof T]: T[P] extends DictTypeDeclarations ? T[P]['t'] : never },
  getTree (): SchemaNodeArray
}

/**
 * Union of literal and object only schema types
 */
export type DictTypeDeclarations =
StringTypeDeclaration |
OptionalStringTypeDeclaration |
BooleanTypeDeclaration |
OptionalBooleanTypeDeclaration |
NumberTypeDeclaration |
OptionalNumberTypeDeclaration |
ObjectTypeDeclaration<TypedSchema> |
OptionalObjectTypeDeclaration<TypedSchema>

/**
 * A union of types the types schema accepts
 */
export type TypeDeclarations =
DictTypeDeclarations |
ArrayTypeDeclaration<any> |
OptionalArrayTypeDeclaration<any> |
TupleTypeDeclaration<any> |
OptionalTupleTypeDeclaration<any>

/**
 * Shape of typed schema
 */
export type TypedSchema = { [key: string]: TypeDeclarations }

/**
 * Shape of typed schema after getting parsed
 */
export type ParsedTypedSchema<T extends TypedSchema> = {
  schema: ParsedSchema,
  props: { [P in keyof T]: T[P]['t'] },
}

/**
 * ------------------------
 * Shape of messages
 * ------------------------
 */

/**
 * Shape of user defined messages schema
 */
export type Messages = {
  [field: string]: Message,
}

/**
 * Shape of parsed messages for a given node
 */
export type ParsedRulesMessages = { [rule: string]: Message }

/**
 * Parsed messages tree
 */
export type ParsedFieldsMessages = {
  [field: string]: ParsedRulesMessages,
}

/**
 * Final tree for messages. The `rules` object has flat list of messages
 * for a given rule. However, `fields` are scoped inside a field name.
 */
export type ParsedMessages = {
  fields: ParsedFieldsMessages,
  rules: ParsedRulesMessages,
}
