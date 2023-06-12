import { execSync } from "child_process"

export const install = (output: string) => {
  execSync(`npm install --no-audit`, {
    cwd: output,
    stdio: 'inherit',
  })
}
