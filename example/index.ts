import { rulesParser } from '..'

console.log(JSON.stringify(rulesParser({
  username: 'required',
  'account.type': 'required|in:email,social',
}), null, 2))
