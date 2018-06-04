# All input should be uppercased
CHARACTER_OFFSET = 65
ALPHABET_SIZE = 26

def shift_letter(letter, shift_count):
    if not isinstance(letter, str) or not letter.isalpha():
        return letter

    if not isinstance(shift_count, int):
        raise TypeError('Must shift a letter by an integer')

    char_code = ord(letter.upper()) - CHARACTER_OFFSET
    char_code = (char_code + shift_count) % ALPHABET_SIZE
    return chr(char_code + CHARACTER_OFFSET)

def shift_word(word, shift_count):
    new_word = ''
    for letter in word.upper():
        new_word += shift_letter(letter, shift_count)
    return new_word

def brute_force(word):
    shifted_words = []
    for shift_by in range(1, ALPHABET_SIZE):
        shifted_words.append(shift_word(word, shift_by))
    return shifted_words

def independent_shift(letters, shiftCounts):
    if len(letters) != len(shiftCounts):
        raise ValueError("Word length must be the same as shift counts length")

    new_word = ''
    for i in range(0, len(letters)):
        new_word += shift_letter(letters[i], shiftCounts[i])
    return new_word
