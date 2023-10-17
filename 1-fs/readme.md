# Node Filesystem

![pet-shop](https://i.imgur.com/9tvF4Lx.jpg)

A local pet shop keeps a database for all the pets they have in stock. However, they need you to build a command-line application in Node to handle a variety of subcommands and log the results to the console.

The subcommands will be in the form of create, read, update, and destroy (CRUD). These subcommands will manage their database, which is a JSON-formatted `pets.json` file. Once the subcommand is correctly handled, the app will need to log an appropriate result to the console. Details of the subcommands the app will need to handle and their output can be found below.

## Getting started

After you fork and clone this repository to your development environment, change into the project directory and install any dependencies.

```shell
cd path/to/project
npm install
```

All work will be done in the `fs.js` file.

## Assignment

Your first task is to build a command-line application that displays its usage, ideally to the [standard error](https://nodejs.org/api/console.html#consoleerrordata-args) channel, when invoked without a subcommand. The app should [exit the process](https://nodejs.org/api/process.html#processexitcode) with a non-zero exit code to indicate that it failed to complete any work.

```shell
$ node fs.js
Usage: node fs.js [read | create | update | destroy]
```

Your next task is to refactor the application to handle the `read` subcommand via the [process arguments](https://nodejs.org/api/process.html#processargv), read the `pets.json` file, parse its data to a native JavaScript object, and log it to the console. If the call to the filesystem fails for any reason, it should throw the resulting error.

```shell
$ node fs.js read
[
  { age: 7, kind: 'dog', name: 'fido' },
  { age: 5, kind: 'snake', name: 'Buttons' }
]
```

Additionally, your application must handle the `read` subcommand when given an index. In this case, it must read the `pets.json` file, parse its data to a native JavaScript object, access the correct record, and log it to the console. If the call to the filesystem fails for any reason, it should throw the resulting error.

```shell
$ node fs.js read 0
{ age: 7, kind: 'dog', name: 'fido' }

$ node fs.js read 1
{ age: 5, kind: 'snake', name: 'Buttons' }
```

Additionally, your application must handle the `read` subcommand when given an out-of-bound index. In this case, it must display a more specific usage to the standard error channel and exit with a non-zero exit code.

```shell
$ node fs.js read 2
Usage: node fs.js read INDEX

$ node fs.js read -1
Usage: node fs.js read INDEX
```

Finally, your application must also handle the `create` subcommand. Only when given an `age`, `kind`, and `name` will it create a record in the database. Remember to convert the `age` into an integer. For example:

```shell
$ node fs.js create
Usage: node fs.js create AGE KIND NAME

$ node fs.js create 3
Usage: node fs.js create AGE KIND NAME

$ node fs.js create 3 parakeet
Usage: node fs.js create AGE KIND NAME

$ node fs.js create 3 parakeet Cornflake
{ age: 3, kind: 'parakeet', name: 'Cornflake' }

$ node fs.js read 2
{ age: 3, kind: 'parakeet', name: 'Cornflake' }
```

If the `pets.json` file ever becomes corrupted, you can reset it with the `git checkout` command.

```shell
$ git checkout -- pets.json
```

## Bonus

Refactor your app to also update records in the database when given the `update` subcommand. Remember to convert the `age` into an integer. For example:

```shell
$ node fs.js update
Usage: node fs.js update INDEX AGE KIND NAME

$ node fs.js update 1
Usage: node fs.js update INDEX AGE KIND NAME

$ node fs.js update 1 9
Usage: node fs.js update INDEX AGE KIND NAME

$ node fs.js update 1 9 cat
Usage: node fs.js update INDEX AGE KIND NAME

$ node fs.js update 1 9 cat Rosey
{ age: 9, kind: 'cat', name: 'Rosey' }

$ node fs.js read 1
{ age: 9, kind: 'cat', name: 'Rosey' }
```

## Bonus

Refactor your app to also destroy records in the database when given the `destroy` subcommand. For example:

```shell
$ node fs.js destroy
Usage: node fs.js destroy INDEX

$ node fs.js destroy 1
{ age: 5, kind: 'snake', name: 'Buttons' }

$ node fs.js read
[ { age: 7, kind: 'dog', name: 'fido' } ]
```

## Bonus

Add a shebang (`#!`) to the start of the `fs.js` file and modify its permissions so it can be run from the command-line without the `node` command. For example:

```shell
$ ./fs.js read
[ { age: 7, kind: 'dog', name: 'fido' },
  { age: 5, kind: 'snake', name: 'Buttons' } ]

$ ./fs.js read 0
{ age: 7, kind: 'dog', name: 'fido' }

$ ./fs.js create 3 parakeet Cornflake
{ age: 3, kind: 'parakeet', name: 'Cornflake' }

$ ./fs.js read
[ { age: 7, kind: 'dog', name: 'fido' },
  { age: 5, kind: 'snake', name: 'Buttons' },
  { age: 3, kind: 'parakeet', name: 'Cornflake' } ]
```
