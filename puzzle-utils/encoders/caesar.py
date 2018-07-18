from typing import List

# All input should be uppercased
CHARACTER_OFFSET = 65
ALPHABET_SIZE = 26

def shift_letter(letter: str, shift_count: int) -> int:
    """Shift a letter by some number"""
    if not isinstance(letter, str) or not letter.isalpha():
        return letter

    if not isinstance(shift_count, int):
        raise TypeError('Must shift a letter by an integer')

    char_code = ord(letter.upper()) - CHARACTER_OFFSET
    char_code = (char_code + shift_count) % ALPHABET_SIZE
    return chr(char_code + CHARACTER_OFFSET)

def caesar(word: str, shift_count: int) -> str:
    """ Caesar shift a whole word by a number

    Args:
        word: The word to shift
        shift_count: The count to shift by

    See Also:
        caesar_brute: Shift a whole word by 1 - 25
        caesar_independent: Shift a word by different numbers for each letter
    """
    new_word = ''
    for letter in word.upper():
        new_word += shift_letter(letter, shift_count)
    return new_word

def caesar_brute(word: str) -> List[str]:
    """ Caesar shift a whole word by 1 - 25

    Args:
        word: The word to shift

    See Also:
        caesar: Shift a whole word by a number
        caesar_independent: Shift a word by different numbers for each letter
    """
    shifted_words = []
    for shift_by in range(1, ALPHABET_SIZE):
        shifted_words.append(caesar(word, shift_by))
    return shifted_words

def caesar_independent(letters: str, shift_counts: List[int]) -> str:
    """Caesar shift a whole word by a number

    Args:
        letters: The word to shift
        shift_counts: A list of counts to shift by

    Raises:
        ValueError: The length of shift_counts must be equal to the number of letters

    See Also:
        caesar: Shift a whole word by a number
        caesar_brute: Shift a whole word by 1 - 25
    """
    if len(letters) != len(shift_counts):
        raise ValueError("Word length must be the same as shift counts length")

    new_word = ''
    for i in range(0, len(letters)):
        new_word += shift_letter(letters[i], shift_counts[i])
    return new_word
