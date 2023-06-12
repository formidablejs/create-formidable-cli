import { tmpdir } from 'os'
import { download } from '@formidablejs/installer/dist/utils/download'
import path = require('path')
import fs = require('fs')
const unzipper = require('unzipper')

export const scaffold = async (cmd: any, output: string, name: string) => {
  const skeleton = path.join(tmpdir(), 'formidablejs-cli-skeleton.zip')

  const response = await download(
    'https://github.com/formidablejs/create-formidable-cli-template//archive/refs/heads/dev.zip',
    skeleton
  )

  if (!response) {
    throw new Error('Unable to download the skeleton.')
  }

  const directory = await unzipper.Open.file(skeleton)

  Object.values(directory.files).forEach((entry: any) => {
    const dir = entry.path.split('/');

    dir.shift();

    const entryPath = path.join(output, dir.join('/'));

    const ignore = [
      'package-lock.json',
      'LICENSE',
    ]

    if (entry.type === 'Directory') {
      fs.mkdirSync(entryPath, { recursive: true });
    } else {
      if (!ignore.includes(entry.path.split('/').pop())) {
        entry.stream()
          .pipe(fs.createWriteStream(entryPath))
          .on('error', (error: any) => {
            cmd.error('Could not create Formidablejs CLI application');

            cmd.exit(1);
          }).on('finish', () => {
            if (entry.path.split('/').pop() === 'dev' || entry.path.split('/').pop() === 'run') {
              fs.chmodSync(entryPath, 0o755)
            }

            if (entry.path.split('/').pop() === 'package.json' || entry.path.split('/').pop() === 'cli.json') {
              const packageJson = JSON.parse(fs.readFileSync(entryPath).toString())

              packageJson.name = name

              fs.writeFileSync(entryPath, JSON.stringify(packageJson, null, 4))
            }

            if (entry.path.split('/').pop() === 'README.md') {
              const readme = fs.readFileSync(entryPath).toString()

              fs.writeFileSync(entryPath, readme.replace('create-formidable-cli', name))
            }
          })
      }
    }
  })
}
