import discord from 'discord.js'
import { scheduleJob as schedule } from 'node-schedule'
import moment from 'moment'
import { argv } from 'yargs'

const client = new discord.Client()

if (!argv.token) {
  console.error('missing bot --token')
  process.exit(2)
}

if (!argv.channel) {
  console.error('missing at least one --channel name')
  process.exit()
}

if (!argv.ttl) {
  console.error('missing --ttl (in seconds)')
  process.exit()
}

if (typeof argv.channel === 'string') {
  argv.channel = [argv.channel]
}

client.on('ready', () => {
  console.log('ready')
})

client.on('message', async message => {
  if (message.type !== 'DEFAULT') return
  if (!argv.channel.includes(message.channel.name)) return

  // prettier-ignore
  const deleteAt = moment().add(argv.ttl, 'seconds').toDate()

  schedule(deleteAt, async () => {
    await message.delete()
    console.log(`Message ${message.id} deleted`)
  })

  console.log(
    `Scheduled message ${message.id} to delete at ${deleteAt.toISOString()}`
  )
})

client.login(argv.token)
process.on('SIGINT', () => process.exit())
