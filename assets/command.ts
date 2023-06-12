import { Command, PropList } from '@formidablejs/console'

export default class {{name}} extends Command {
    get signature(): string {
        return '{{signature}}'
    }

    get description(): string {
        return '{{description}}'
    }

    get props(): PropList {
        return {

        }
    }

    async handle(): Promise<void> {
        //
    }
}
