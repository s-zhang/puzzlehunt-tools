# Super Secret Puzzle Tools to Win [![Build Status](https://travis-ci.com/s-zhang/puzzlehunt-tools.svg?branch=master)](https://travis-ci.com/s-zhang/puzzlehunt-tools)

## puzzle-utils

## Features/To-Dos
(Sign up for whatever you decide to work on here so we don't duplicate work)

Basically what I want is all the random online tools in one easy lightweight place or in script version.

- Word Ladder tools
    - "Next Word" (adjacent) word generator
    - Ladder solver (or link to a ladder solver)
    - [Example](http://ceptimus.co.uk/wordladder.php)
- Decode/Encode tools
    - Caesar Ciphper (Nick)
        - Shift letters by independent numbers
        - Shift phrase by number
        - Shift phrase brute force
        - Or just use [this](https://www.dcode.fr/shift-cipher)
    - Morse Code Translator (Nick)
        - [Example](https://morsecode.scphillips.com/translator.html)
    - Braille Translator (Nick)
    - Semaphore Translator
    - Number/Hex to Letter
- Improvements to wordhelper (TODO)
    - Insert/Remove/Replace a string
- Anagram solver
    - single word and multi-word anagram solver
- Word lookup
    - find a word with regex
- We can put all these tools on a handy, simple website

### Prerequisites

(Once) Install the following items
1. Python 3+
1. [pipenv](https://docs.pipenv.org/)
    ```
    >pip install pipenv
    ```

### Setup

(Once per code sync)
Install all the dependencies by running
```
>.\setup.bat
```

For Mac Users, run
```
>sh macsetup.sh
```

### Usage

(Once per use)
Start `puzzle-utils` interactively by running
```
>.\run.bat
>>> anagram("silent")
['listen', 'inlets', 'tinsel', 'elints', 'silent', 'intels', 'enlist']
```

For Mac Users, run
```
>sh macrun.sh
>>> anagram("silent")
['listen', 'inlets', 'tinsel', 'elints', 'silent', 'intels', 'enlist']
```

## Build and Test

Refer to [puzzle-utils/README.md](puzzle-utils/README.md) for details.

## Contributing

Refer to [puzzle-utils/README.md](puzzle-utils/README.md) for details.

## Authors

See [contributors](https://github.com/s-zhang/puzzlehunt-tools/contributors).

## License

See [LICENSE](LICENSE)
