import { color } from '@oclif/color'
import { input } from '@inquirer/prompts'
import { Args, Command, Flags } from '@oclif/core'
import { welcome } from '@formidablejs/installer/dist/utils/welcome'
import { isDirEmpty } from '@formidablejs/installer/dist/utils/isDirEmpty'
import { dim } from '@formidablejs/installer/dist/utils/dim'
import { scaffold } from '../utils/scaffold'
import path = require('path')
import fs = require('fs')

export default class New extends Command {
  static description = 'Create a new CLI'

  static flags = {}

  static args = {
    name: Args.string({ description: 'Application name', required: false }),
  }

  async run(): Promise<void> {
    const { args } = await this.parse(New)

    const settings = {
      application: '',
    }

    if (!args.name) {
      const name = await input({
        message: 'What is the name of your CLI application?',
      });

      args.name = name
    }

    welcome('FormidableJs CLI')

    if (/[^a-z0-9-_]/gi.test(args.name) && !['.', './'].includes(args.name)) {
      return this.error(`${color.red('Invalid Application name.')}`)
    }

    settings.application = path.join(process.cwd(), !['.', './'].includes(args.name) ? args.name : '')

    if ((fs.existsSync(settings.application) && !['.', './'].includes(args.name)) || ['.', './'].includes(args.name) && !isDirEmpty(settings.application)) {
      return this.error(color.red('Application already exists!'))
    }

    if (['.', './'].includes(args.name)) {
      args.name = path.basename(settings.application)
    }

    await scaffold(this, settings.application, args.name)

    this.log(color.green(`\n Your application is ready! 🎉\n`))
		this.log(color.cyan(' Get started with the following commands:'))

    const space = '   ';

    if (process.cwd() !== settings.application) {
			this.log(dim(`${space}$ cd ${args.name}`))
		}

    this.log(dim(`${space}$ npm install`))
    this.log(dim(`${space}$ ./bin/dev hello world`))
  }
}
