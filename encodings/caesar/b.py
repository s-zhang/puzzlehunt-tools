import sys
import caesar_args
import caesar

def main():
    args = caesar_args.parse_args(sys.argv[1:])
    if caesar_args.validate_args(caesar_args.brute_force, args):
        caesar.brute_force(args.word.upper())
    return

if __name__ == "__main__":
    main()
