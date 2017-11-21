# jwplayer-jest

An attempt to load jwplayer with jsdom for testing with jest.

## Setup

### 1. Fork the repo then

````sh
# Clone your fork of the repo into the current directory
git clone https://github.com/<your-username>/jwplayer-jest
# Navigate to the newly cloned directory
cd jwplayer-jest
# Assign the original repo to a remote called "upstream"
git remote add upstream https://github.com/barsh/jwplayer-jest
````

### 2. Install dependencies

[Install Yarn if necessary](https://yarnpkg.com/en/docs/install)

```sh
yarn install
```

## Running Tests

```sh
# all tests
yarn test

# watch
yarn test --watch

```

## Debugging

You must be running Node v9.2.0 or higher.

1. Open repo folder in Visual Studio Code

1. Set a breakpoint or insert `debugger` command in `./tests.ts`

1. Press <kbd>F5<kbd>
