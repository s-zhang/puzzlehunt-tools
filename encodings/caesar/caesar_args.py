import argparse

# Constants for modes
brute_force = 'brute_force'
word = 'word'
letter = 'letter'

def parse_args(input_args):
    parser = argparse.ArgumentParser(description='Casear cipher solver')
    parser.add_argument('-m', '--mode', default=brute_force, choices=[brute_force, word, letter])
    parser.add_argument('-d', '--shiftDirection', default='f', choices=['f', 'b'])
    parser.add_argument('-w', '--word')
    parser.add_argument('-ws', '--wordShift', type=int)
    parser.add_argument('-l', '--letters')
    parser.add_argument('-ls', '--letterShifts', nargs='+', type=int)

    return parser.parse_args(input_args)

def validate_args(mode, args):
    # Input validation
    input_valid = True
    if mode == brute_force:
        if args.word is None:
            print('Need a word to brute force')
            input_valid = False
    elif mode == word:
        if args.word is None:
            print('Need a word to shift')
            input_valid = False
        if args.wordShift is None:
            print ('Need a number to shift by')
            input_valid = False
    elif mode == letter:
        if args.letters is None:
            print('Need letters to shift')
            input_valid = False
        if args.letterShifts is None:
            print('Need numbers to shift by')
            input_valid = False
        if not isinstance(args.letterShifts, list):
            print('Need a list of letter shifts')
            input_valid = False
        if len(args.letters) != len(args.letterShifts):
            print('Letters should be same length as shifts')
            input_valid = False
    else:
        print('Invalid mode: ' + mode)
        input_valid = False

    return input_valid
