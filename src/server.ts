import { setUp } from './app'

const app = setUp()

app.listen(8888, () => {
  console.log('listen')
})
