import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const taskFile = path.join(root, 'Task.json')

if (!fs.existsSync(taskFile)) {
  console.log(JSON.stringify({ exists: false, nextTask: null }, null, 2))
  process.exit(0)
}

const content = fs.readFileSync(taskFile, 'utf8')
const data = JSON.parse(content)
const tasks = Array.isArray(data.tasks) ? data.tasks : []
const nextTask = tasks.find((task) => task && task.isDone === true) || null

console.log(JSON.stringify({
  exists: true,
  pendingCount: tasks.filter((task) => task && task.isDone === true).length,
  nextTask
}, null, 2))
