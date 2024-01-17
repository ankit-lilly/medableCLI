# What?

CLI tool to interact with Medable Cortex API

# How to run it?

```shell
    npm install -g medable-cli
    mcli --help
```


- You can either have an .env file with following values in your homedir or the directory where you running the command from

  ```
    username=test
    password=test
    org=mdbl-org
    apiKey=keydfkjk
  ```

- Run `mcli login` to login

- It should generate a token and log you in and then you should be able to run rest of commands like get,run and scripts download

### Usage: 

```shell
 mcli get c_public_user --where '{"c_email": "user@mail.com"}'
```
You can limit number of results with -l or --limit flag

```shell
 mcli get c_public_user -l 1
```

### Transformation functions
You can also pass transformation functions to `mcli get object`. This can be any valid javascript function.

For instance, if you want to find user with c_number 5 then you could do something like this:

```shell
mcli get c_public_users --find "(item) => item.c_number === 5"
```

Similarly, you can pass a map function and transform the output according to your needs

```shell
mcli get c_public_user --map "(item) => item.c_name"
```

Type mcli get [object] --help to see all the available options.


