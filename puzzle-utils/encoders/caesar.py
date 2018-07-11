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

def caesar(word, shift_count):
    """
    Caesar shift a whole word by a number

    Params:
    word        (required) - The word to shift
    shift_count (required) - The count to shift by

    Alternatives:
    brute_caesar       - Shift a whole word by 1 - 25
    independent_caesar - Shift a word by different numbers for each letter
    """
    new_word = ''
    for letter in word.upper():
        new_word += shift_letter(letter, shift_count)
    return new_word

def brute_caesar(word):
    """
    Caesar shift a whole word by 1 - 25

    Params:
    word        (required) - The word to shift

    Alternatives:
    caesar             - Shift a whole word by a number
    independent_caesar - Shift a word by different numbers for each letter
    """
    shifted_words = []
    for shift_by in range(1, ALPHABET_SIZE):
        shifted_words.append(caesar(word, shift_by))
    return shifted_words

def independent_caesar(letters, shift_counts):
    """
    Caesar shift a whole word by a number

    Params:
    letters      (required) - The word to shift
    shift_counts (required) - A list of counts to shift by

    Alternatives:
    caesar       - Shift a whole word by a number
    brute_caesar - Shift a whole word by 1 - 25
    """
    if len(letters) != len(shift_counts):
        raise ValueError("Word length must be the same as shift counts length")

    new_word = ''
    for i in range(0, len(letters)):
        new_word += shift_letter(letters[i], shift_counts[i])
    return new_word
