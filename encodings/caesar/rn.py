import sys
import caesar_args
import caesar

def main():
    args = caesar_args.parse_args(sys.argv[1:])
    if caesar_args.validate_args(caesar_args.word, args):
        caesar.shift_word(args.word.upper(), caesar.ALPHABET_SIZE - args.wordShift)
    return

if __name__ == "__main__":
    main()
