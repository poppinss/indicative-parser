import { rulesParser, t } from '..'
import { deepEqual } from 'assert'

const schema = rulesParser(t.schema({
  username: t.string(),
  account: t.object().members({
    type: t.string({ name: 'in', args: ['email', 'social'] }),
  }),
}))

const consiceSchema = rulesParser({
  username: 'required|string',
  'account': 'required|object',
  'account.type': 'required|string|in:email,social',
})

deepEqual(schema, consiceSchema)
console.log(JSON.stringify(schema, null, 2))
