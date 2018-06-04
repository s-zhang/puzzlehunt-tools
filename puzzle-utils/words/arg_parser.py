import argparse

def parse_args(args):
    parser = argparse.ArgumentParser(prog='word-utils')
    sub_parsers = parser.add_subparsers(help='sub-command help')

    # Common parsers
    word_list_parser = argparse.ArgumentParser(add_help=False)
    word_list_parser.add_argument('-d', '--dictionary', required=False, default="Collins Scrabble Words (2015)")

    anagram_parser = sub_parsers.add_parser('anagram', parents=[word_list_parser])
    anagram_parser.add_argument('pattern')
    return parser.parse_args(args)

"""    
    args = parser.parse_args(['anagram', 'test', '-d', 'asdf'])
    print(args.dictionary, args.pattern)
    args = parser.parse_args(['anagram', 'test'])
    print(args.dictionary, args.pattern)
"""