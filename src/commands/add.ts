import { Args, Command, Flags } from '@oclif/core'
import { color } from '@oclif/color'
const fs = require('fs')
const path = require('path')

export default class Add extends Command {
  static description = 'Generate a new command'

  static flags = {
    signature: Flags.string({ char: 's', description: 'Command signature', required: true }),
    description: Flags.string({ char: 'd', description: 'Command description', required: false }),
  }

  static args = {
    name: Args.string({ description: 'Command name', required: true }),
  }

  async run(): Promise<void> {
    if (!fs.existsSync(path.join(process.cwd(), 'src', 'Commands')) || !fs.existsSync(path.join(process.cwd(), 'cli.json'))) {
      return this.error('You must be in the root of a Formidable CLI project to run this command.')
    }

    const { args, flags } = await this.parse(Add)

    if (fs.existsSync(path.join(process.cwd(), 'src', 'Commands', `${args.name}.ts`))) {
      return this.error(`Command ${args.name} already exists.`)
    }

    const signature = flags.signature
    const description = flags.description || ''

    let stub = fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'command.ts'), 'utf8')

    stub = stub.replace('{{name}}', args.name)
    stub = stub.replace('{{signature}}', signature)
    stub = stub.replace('{{description}}', description)

    const command = path.join(process.cwd(), 'src', 'Commands', `${args.name}.ts`)

    fs.writeFileSync(command, stub)

    if (fs.existsSync(command)) {
      return this.log(color.white(`Command [${command}] created successfully.`))
    }

    return this.error('Something went wrong while creating the command.')
  }
}
