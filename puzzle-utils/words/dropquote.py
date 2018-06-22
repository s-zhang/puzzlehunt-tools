from .search import search

class DropQuoteSnapshot:
    def __init__(self):
        self.grid = []
        self.letters = []
        self.words = {}

class DropQuoteWords:
    def __init__(self, letters, words):
        self.letters = letters
        self.words = words

def dropquote(grid, letters):
    dropquote_validate(grid, letters)

    current_grid = []
    for row in grid:
        current_grid.append(row.lower())

    current_letters = []
    for column in letters:
        current_letters.append(column.lower())

    stuck = False
    dropQuoteSnapshots = []
    while not stuck:
        stuck = True
        dropQuoteSnapshot = dropquote_search(current_grid, current_letters)
        dropQuoteSnapshots.append(dropQuoteSnapshot)

        for index, words in dropQuoteSnapshot.words.items():
            if len(words.words) == 1:
                stuck = False
                dropquote_apply_word(current_grid, current_letters, words.words[0], index)
    
    return dropQuoteSnapshots

def dropquote_validate(grid, letters):
    row_length = len(grid[0])
    column_lengths = [0] * row_length
    for row in range(len(grid)):
        if row_length != len(grid[row]):
            raise ValueError(f'Row {row} did not have the same length as the first row.')
        
        for column in range(len(grid[row])):
            if grid[row][column] == ' ':
                column_lengths[column] += 1
    
    for column in range(row_length):
        if len(letters[column]) != column_lengths[column]:
            raise ValueError(f'Column {column} has {len(letters[column])} letters but has {column_lengths[column]} blanks.')

def dropquote_search(grid, letters):
    dropQuoteSnapshot = DropQuoteSnapshot()
    dropQuoteSnapshot.grid = grid[:]
    dropQuoteSnapshot.letters = letters[:]

    row = 0
    column = 0
    word_index = 0
    current_word = ''
    current_letters = []
    while row < len(grid) and column < len(grid[0]):
        if grid[row][column] == '-':
            if current_word.find(' ') != -1:
                # Edge case: if the word is long enough to overlap columns then the word search could produce invalid results
                words = dropquote_search_words(current_word, current_letters)
                dropQuoteWords = DropQuoteWords(current_letters[:], words[:])
                dropQuoteSnapshot.words[word_index] = dropQuoteWords
            
            word_index += 1
            current_word = ''
            current_letters = []
        elif grid[row][column] == ' ':
            current_word += ' '
            current_letters.append(letters[column])
        else:
            current_word += grid[row][column]
            current_letters.append('')
        
        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0

    return dropQuoteSnapshot

def dropquote_search_words(word, letters):
    pattern = '^'
    for index in range(len(word)):
        if word[index] == ' ':
            pattern += f'[{letters[index]}]'
        else:
            pattern += word[index]
    pattern += '$'
    return search(pattern)

def dropquote_apply_word(grid, letters, word, word_index):
    row = 0
    column = 0
    current_word_index = 0
    new_word = True
    while row < len(grid) and column < len(grid[0]):
        if grid[row][column] == '-' and new_word == False:
            current_word_index += 1
            new_word = True
        
        if grid[row][column] != '-' and new_word == True:
            new_word = False
            if current_word_index == word_index:
                break

        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0
    
    dropquote_apply_word_validate(grid, letters, word, row, column)
    dropquote_apply_word_at_location(grid, letters, word, row, column)

def dropquote_apply_word_validate(grid, letters, word, row, column):
    current_letters = letters[:]
    for letter in word:
        if current_letters[column].find(letter) == -1:
            raise ValueError(f'There were not enough \'{letter}\' found in column {column}.')

        current_letters[column] = current_letters[column].replace(letter, '', 1)
        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0

def dropquote_apply_word_at_location(grid, letters, word, row, column):
    for letter in word:
        grid[row] = grid[row][:column] + letter + grid[row][column + 1:]
        letters[column] = letters[column].replace(letter, '', 1)
        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0