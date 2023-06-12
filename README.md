
`create-formidable-cli`
-----------------------

`create-formidable-cli` is a command line tool that helps you create a formidable-cli project.

Installation
------------

You can install the package via `npm` or any other package manager of your choice.

```bash
npm install -g create-formidable-cli
```

Usage
-----

### Create a new project

Create a new project using the following command:

```bash
create-formidable-cli <project-name>
```

> This will create a new project in the current directory with the name you specified.

### Run the project

To run the project, you can use the following command:

#### Development

```bash
./bin/dev
```

#### Production

```bash
npm run build
./bin/run
```

### Add a new command

To add a new command, you can use the following command:

```bash
create-formidable-cli add Hello --signature="hello {?name}"
```

This will create a new command in the `src/Commands` directory with the following boilerplate:

```ts
import { Command } from '@formidablejs/framework'
import { PropList, string } from '@formidablejs/console'

export class Hello extends Command {
  get signature(): string {
    return 'hello {?name}'
  }

  get description(): string {
    return 'My command description'
  }

  get props(): PropList {
    return {
      name: string('Your name')
    }
  }

  async handle(): void {
    this.write(`<fg:green>Hello ${argument('name', 'Stranger')}</fg:green>`)

    this.exit()
  }
}
```

## Defining Input Expectations

When writing console commands, it is common to gather input from the user through arguments or options. Formidable allows you to define the commands input structure in the `signature` property. In the `signature` property you may define the name, arguments, and options for the command in a single, expressive syntax.

### Arguments

All user supplied arguments and options are wrapped in curly braces. In the following example, the command defines one required argument: `name`:

```ts
get props(): PropList {
  return {
    name: string().default('Donald')
  }
}
```

### Options

Options, like arguments, are another form of user input. Options are prefixed by two hyphens (--) when they are provided via the command line. There are two types of options: those that receive a value and those that don't. Options that don't receive a value serve as a boolean "flag". Let's take a look at an example of this type of option:

```ts
get signature(): string {
  return 'hello {name} {--time}'
}
```

In this example, the `--time` switch may be specified when calling the command. If the `--time` flag is passed, the value will of the option will be `true`. Otherwise, the value will be `false`:

```bash
./bin/dev hello Luna --time
```

#### Options With Values

Next, let's take a look at an option that expects a value. If the user must specify a value for an option, you should set the option type to `string`:

```ts
get signature(): string {
  return 'hello {name} {--time}'
}

get props(): PropList {
  return {
    name: string().default('Donald'),
    time: string()
  }
}
```

When invoking the command, you may give the `--time` flag a value:

```bash
./bin/dev hello Luna --time=19:05
```

#### Option Alias

To assign an alias when defining an option, you may specify it in the `props` property:

```ts
get props(): PropList {
  return {
    time: string().alias('t')
  }
}
```

When invoking the command, you may use `-t` instead of `--time`:

```bash
./bin/dev hello Luna -t=19:05
```

### Input Descriptions

You may assign descriptions to input arguments and options in the `props` property:

```ts
get props(): PropList {
  return {
    time: string('Current time')
  }
}
```

## Command I/O

### Retrieving Input

While your command is executing, you will likely need to access the values for the arguments and options accepted by your command. To do so, you may use the argument and option methods. If an `argument` or `option` does not exist, null will be returned:

```ts
async handle(): Promise<void> {
  const name: string = this.argument('name')
}
```

Options may be retrieved just as easily as arguments using the `option` method:

```ts
handle(): void {
  const time: string = this.option('time')
}
```

You may also pass a default value as the second parameter if the value is `null`:

```ts
handle(): void {
  const name: string = this.argument('name', 'Donald')
  const time: string = this.option('time', '19:05')
}
```

### Writing Output

To send output to the console, you may use the `message`, `info`, `succces,` `write`, `line`, and `error` methods. Each of these methods will use appropriate ANSI colors for their purpose. For example, let's display some general information to the user. Typically, the info method will display in the console as green colored text:

```ts
handle(): void {
  // ...

  this.success('The command was successful')
}
```

To display an error message, use the `error` method. Error message text is typically displayed in red:

```ts
this.error('Something went wrong!')
```

You may use the `write` method to display plain, uncolored text:

```ts
this.write('Display this on the screen')
```

#### Custom Styling

You may custom style your output, for example, to display a text in `blue` and `red`, use:

```ts
this.write('This is <fg:blue>blue</fg:blue> and this has a <bg:red>red</bg:red> background')
```

Tag          | Type       | Color
-------------|------------|-------
`bg:black`   | Background | Black
`bg:blue`    | Background | Blue
`bg:cyan`    | Background | Cyan
`bg:green`   | Background | Green
`bg:magenta` | Background | Magenta
`bg:red`     | Background | Red
`bg:white`   | Background | White
`bg:yellow`  | Background | Yellow
`fg:black`   | Color      | Black
`fg:blue`    | Color      | Blue
`fg:cyan`    | Color      | Cyan
`fg:green`   | Color      | Green
`fg:magenta` | Color      | Magenta
`fg:red`     | Color      | Red
`fg:white`   | Color      | White
`fg:yellow`  | Color      | Yellow
`dim`        | Style      | `null`
`u`          | Style      | `null`
`underline`  | Style      | `null`

#### Tables

The `table` method makes it easy to correctly format multiple rows / columns of data. All you need to do is provide the an array of objects for the table and Formidable will automatically calculate the appropriate width and height of the table for you:

```ts
this.table([
    { name: "Donald" }
    { name: "Luna" }
])
```

#### Columns

The `column` method makes it easy to correctly format rows of data. All you need to do is provide the data for the column and Formidable will automatically calculate the appropriate width of the column for you:

```ts
this.column('Name', 'Donald')
```

Security
-------

If you discover any security related issues, please email donaldpakkies@gmail.com instead of using the issue tracker.

License
-------

The MIT License (MIT). Please see [License File](LICENSE) for more information
