import argparse

# All input should be uppercased
CHARACTER_OFFSET = 64
ALPHABET_SIZE = 26

def shift_letter(letter, shiftCount):
    charCode = ord(letter) - CHARACTER_OFFSET
    charCode = (charCode + shiftCount) % ALPHABET_SIZE
    return chr(charCode + CHARACTER_OFFSET)

def shift_word(word, shiftCount):
    new_word = ''
    for letter in word:
        new_word += shift_letter(letter, shiftCount)
    print(new_word)
    return

def brute_force(word):
    for shift_by in range(1, ALPHABET_SIZE):
        print(shift_word(word, shift_by))
    return

def independent_shift(letters, shiftCounts):
    new_word = ''
    for i in range(0, len(letters)):
        new_word += shift_letter(letters[i], shiftCounts[i])
    print(new_word)
    return

def main():
    parser = argparse.ArgumentParser(description='Casear cipher solver')
    parser.add_argument('mode', choices=['brute_force', 'word', 'letter'])
    parser.add_argument('-d', '--shiftDirection', default='f', choices=['f', 'b'])
    parser.add_argument('-w', '--word')
    parser.add_argument('-ws', '--wordShift', type=int)
    parser.add_argument('-l', '--letters', nargs='+')
    parser.add_argument('-ls', '--letterShifts', nargs='+', type=int)
    args = parser.parse_args()

    if args.mode == 'brute_force':
        if args.word is None:
            print('Need a word to brute force')
            return
        brute_force(args.word.upper())

    elif args.mode == 'word':
        if args.word is None:
            print('Need a word to shift')
            return
        if args.wordShift is None:
            print ('Need a number to shift by')
            return

        shift_word(args.word.upper(), args.wordShift if args.shiftDirection == 'f' else args.wordShift - ALPHABET_SIZE)

    elif args.mode == 'letter':
        if args.letters is None:
            print('Need letters to shift')
            return
        if args.letterShifts is None:
            print('Need numbers to shift by')
            return
        if not isinstance(args.letters, list):
            print('Need a list of letters')
            return
        if not isinstance(args.letterShifts, list):
            print('Need a list of letter shifts')
            return
        if len(args.letters) != len(args.letterShifts):
            print('Letters should be same length as shifts')
            return

        independent_shift(list(map(lambda l: l.upper(), args.letters)), list(map(lambda l: int(l) if args.shiftDirection == 'f' else int.l - ALPHABET_SIZE, args.letterShifts)))

    return

if __name__ == "__main__":
    main()
