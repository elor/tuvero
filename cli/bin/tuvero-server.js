#!/usr/bin/env node

import express from 'express'
import { run, commands } from '../state.js'

const app = express()
const PORT = 8080

app.use(express.json({ type: 'application/json' }))

const allCommands = Object.keys(commands)
const allRoutes = Object.fromEntries(allCommands.map(cmd => [cmd, `/${cmd}`]))

const router = express.Router()

router.post('/:command', async function (request, response) {
  const command = request.params.command
  try {
    if (!commands[command]) {
      return response.status(400).json({
        error: 'Command not recognized',
        message: 'Available commands: ' + allCommands.join(', ')
      })
    }
    if (!request.is('application/json')) {
      return response.status(400).json({ error: 'Content-Type must be application/json' })
    }
    if (!request.body) {
      return response.status(400).json({ error: 'No JSON data received' })
    }
    const result = await run(request.body, command)
    response.json(result)
  } catch (error) {
    response.status(400).json({
      error: 'Error while processing the request',
      message: error ? error.message || String(error) : ''
    })
  }
})

router.get('/', function (_request, response) {
  response.json(allRoutes)
})

app.use('/', router)
app.listen(PORT)
console.log('listening on port ' + PORT)
