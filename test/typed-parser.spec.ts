'use strict'

/*
* indicative
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import test from 'japa'
import { array } from '../src/Types/array'
import { tuple } from '../src/Types/tuple'
import { number } from '../src/Types/number'
import { schema } from '../src/Types/schema'
import { string } from '../src/Types/string'
import { object } from '../src/Types/object'

test.group('Typed Parser | schema', () => {
  test('parse simple field rules', (assert) => {
    const output = schema({
      username: string(),
    })

    assert.deepEqual(output.schema, {
      username: {
        type: 'literal',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'string',
            args: [],
          },
        ],
      },
    })
  })

  test('mark string as optional', (assert) => {
    const output = schema({
      username: string.optional(),
    })

    assert.deepEqual(output.schema, {
      username: {
        type: 'literal',
        rules: [
          {
            name: 'string',
            args: [],
          },
        ],
      },
    })
  })

  test('attach extra rules to string', (assert) => {
    const output = schema({
      username: string({ name: 'range', args: ['10', '20'] }),
    })

    assert.deepEqual(output.schema, {
      username: {
        type: 'literal',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'string',
            args: [],
          },
          {
            name: 'range',
            args: ['10', '20'],
          },
        ],
      },
    })
  })

  test('attach extra rules to optional string', (assert) => {
    const output = schema({
      username: string.optional({ name: 'range', args: ['10', '20'] }),
    })

    assert.deepEqual(output.schema, {
      username: {
        type: 'literal',
        rules: [
          {
            name: 'string',
            args: [],
          },
          {
            name: 'range',
            args: ['10', '20'],
          },
        ],
      },
    })
  })

  test('define object schema', (assert) => {
    const output = schema({
      user: object().members({
        profile: string(),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          profile: {
            rules: [
              {
                name: 'required',
                args: [],
              },
              {
                name: 'string',
                args: [],
              },
            ],
            type: 'literal',
          },
        },
      },
    })
  })

  test('define optional object schema', (assert) => {
    const output = schema({
      user: object.optional().members({
        profile: string(),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          profile: {
            rules: [
              {
                name: 'required',
                args: [],
              },
              {
                name: 'string',
                args: [],
              },
            ],
            type: 'literal',
          },
        },
      },
    })
  })

  test('define nested schema', (assert) => {
    const output = schema({
      user: object().members({
        profile: object().members({
          username: string(),
        }),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          profile: {
            type: 'object',
            rules: [
              {
                name: 'required',
                args: [],
              },
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
                type: 'literal',
              },
            },
          },
        },
      },
    })
  })

  test('define nested optional schema', (assert) => {
    const output = schema({
      user: object.optional().members({
        profile: object.optional().members({
          username: string(),
        }),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          profile: {
            type: 'object',
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
                type: 'literal',
              },
            },
          },
        },
      },
    })
  })

  test('handle array based expressions', (assert) => {
    const output = schema({
      users: array().members(object().members({
        username: string(),
      })),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('handle optional array based expressions', (assert) => {
    const output = schema({
      users: array.optional().members(object().members({
        username: string(),
      })),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'array',
            args: [],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('define object inside array members', (assert) => {
    const output = schema({
      users: array().members({
        username: string(),
      }),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('define object inside optional array members', (assert) => {
    const output = schema({
      users: array.optional().members({
        username: string(),
      }),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'array',
            args: [],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('parse arrays inside nested object', (assert) => {
    const output = schema({
      user: object().members({
        accounts: array().members(object().members({
          username: string(),
        })),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          accounts: {
            type: 'array',
            rules: [
              {
                name: 'required',
                args: [],
              },
              {
                name: 'array',
                args: [],
              },
            ],
            each: {
              '*': {
                rules: [
                  {
                    name: 'object',
                    args: [],
                  },
                ],
                children: {
                  username: {
                    type: 'literal',
                    rules: [
                      {
                        name: 'required',
                        args: [],
                      },
                      {
                        name: 'string',
                        args: [],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    })
  })

  test('parse * expression targeting literal values', (assert) => {
    const output = schema({
      users: array().members(string()),
    })

    assert.deepEqual(output.schema, {
      users: {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'string',
                args: [],
              },
            ],
            children: {},
          },
        },
      },
    })
  })

  test('parse multiple rules with complex members', (assert) => {
    const output = schema({
      users: array().members(object().members({
        profile: object().members({
          age: string({ name: 'max', args: ['60'] }),
        }),
      })),
    })

    assert.deepEqual(output.schema, {
      users: {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              profile: {
                type: 'object',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'object',
                    args: [],
                  },
                ],
                children: {
                  age: {
                    type: 'literal',
                    rules: [
                      {
                        name: 'required',
                        args: [],
                      },
                      {
                        name: 'string',
                        args: [],
                      },
                      {
                        name: 'max',
                        args: ['60'],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    })
  })

  test('add rules to deeply nested child', (assert) => {
    const output = schema({
      user: object().members({
        profile: object().members({
          type: string(),
        }),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          profile: {
            type: 'object',
            rules: [
              {
                name: 'required',
                args: [],
              },
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              type: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('add optional rules to deeply nested child', (assert) => {
    const output = schema({
      user: object.optional().members({
        profile: object.optional().members({
          type: string(),
        }),
      }),
    })

    assert.deepEqual(output.schema, {
      user: {
        type: 'object',
        rules: [
          {
            name: 'object',
            args: [],
          },
        ],
        children: {
          profile: {
            type: 'object',
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              type: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('add rules on array node itself', (assert) => {
    const output = schema({
      users: array({ name: 'size', args: ['4'] }).members(string()),
    })

    assert.deepEqual(output.schema, {
      users: {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
          {
            name: 'size',
            args: ['4'],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'string',
                args: [],
              },
            ],
            children: {},
          },
        },
      },
    })
  })

  test('add optional rules on array node itself', (assert) => {
    const output = schema({
      users: array.optional({ name: 'size', args: ['4'] }).members(string()),
    })

    assert.deepEqual(output.schema, {
      users: {
        type: 'array',
        rules: [
          {
            name: 'array',
            args: [],
          },
          {
            name: 'size',
            args: ['4'],
          },
        ],
        each: {
          '*': {
            rules: [
              {
                name: 'string',
                args: [],
              },
            ],
            children: {},
          },
        },
      },
    })
  })

  test('handle tuple expression', (assert) => {
    const output = schema({
      users: tuple().members(object().members({
        username: string(),
      })),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
          {
            name: 'size',
            args: [1],
          },
        ],
        each: {
          '0': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('handle optional tuple expression', (assert) => {
    const output = schema({
      users: tuple.optional().members(object().members({
        username: string(),
      })),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'array',
            args: [],
          },
          {
            name: 'size',
            args: [1],
          },
        ],
        each: {
          '0': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('handle tuple expression with multiple children', (assert) => {
    const output = schema({
      users: tuple().members(
        object().members({ username: string() }),
        object().members({ age: number() }),
      ),
    })

    assert.deepEqual(output.schema, {
      'users': {
        type: 'array',
        rules: [
          {
            name: 'required',
            args: [],
          },
          {
            name: 'array',
            args: [],
          },
          {
            name: 'size',
            args: [2],
          },
        ],
        each: {
          '0': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'string',
                    args: [],
                  },
                ],
              },
            },
          },
          '1': {
            rules: [
              {
                name: 'object',
                args: [],
              },
            ],
            children: {
              age: {
                type: 'literal',
                rules: [
                  {
                    name: 'required',
                    args: [],
                  },
                  {
                    name: 'number',
                    args: [],
                  },
                ],
              },
            },
          },
        },
      },
    })
  })

  test('dis-allow 2d arrays', (assert) => {
    const output = (): any => schema({
      users: array().members(array().members(string()) as any),
    })

    assert.throw(output, '2d arrays are currently not supported')
  })

  test('dis-allow 2d tuples', (assert) => {
    const output = (): any => schema({
      users: tuple().members(array().members(string()) as any),
    })

    assert.throw(output, '2d arrays are currently not supported')
  })
})
