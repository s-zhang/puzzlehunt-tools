import sys
import caesar_args

# All input should be uppercased
CHARACTER_OFFSET = 65
ALPHABET_SIZE = 26

def shift_letter(letter, shift_count):
    char_code = ord(letter) - CHARACTER_OFFSET
    if char_code < 0:
        print("Error, invalid letter: " + letter)
    else:
        char_code = (char_code + shift_count) % ALPHABET_SIZE
    return chr(char_code + CHARACTER_OFFSET)

def shift_word(word, shift_count):
    new_word = ''
    for letter in word:
        new_word += shift_letter(letter, shift_count)
    print(new_word)
    return

def brute_force(word):
    for shift_by in range(1, ALPHABET_SIZE):
        shift_word(word, shift_by)
    return

def independent_shift(letters, shiftCounts):
    new_word = ''
    for i in range(0, len(letters)):
        new_word += shift_letter(letters[i], shiftCounts[i])
    print(new_word)
    return

def main():
    args = caesar_args.parse_args(sys.argv[1:])
    if caesar_args.validate_args(args.mode, args):
        if args.mode == caesar_args.brute_force:
            brute_force(args.word.upper())
        elif args.mode == caesar_args.word:
            shift_word(args.word.upper(), args.wordShift if args.shiftDirection == 'f' else ALPHABET_SIZE - args.wordShift)
        elif args.mode == caesar_args.letter:
            independent_shift(args.letters.upper(), list(map(lambda l: int(l) if args.shiftDirection == 'f' else ALPHABET_SIZE - int(l), args.letterShifts)))
    return

if __name__ == "__main__":
    main()
