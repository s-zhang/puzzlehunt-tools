import sys
import caesar_args
import caesar

def main():
    args = caesar_args.parse_args(sys.argv[1:])
    if caesar_args.validate_args(caesar_args.letter, args):
        caesar.independent_shift(args.letters.upper(), list(map(int, args.letterShifts)))
    return

if __name__ == "__main__":
    main()
