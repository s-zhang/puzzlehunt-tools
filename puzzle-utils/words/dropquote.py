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

    grid_working = []
    for row in grid:
        grid_working.append(row.lower())

    letters_working = []
    for column in letters:
        letters_working.append(column.lower())

    dropQuoteSnapshots = []

    stuck = False
    while not stuck:
        stuck = True
        dropQuoteSnapshot = DropQuoteSnapshot()
        dropQuoteSnapshot.grid = grid_working[:]
        dropQuoteSnapshot.letters = letters_working[:]
        word_index = 0
        word_current = ''
        letters_current = []
        row_current = 0
        column_current = 0
        while row_current < len(grid) and column_current < len(grid[0]):
            if grid_working[row_current][column_current] == '-':
                if word_current.find(' ') != -1:
                    # Edge case: if the word is long enough to overlap columns then the word search could produce invalid results
                    words = dropquote_word(word_current, letters_current)
                    dropQuoteWords = DropQuoteWords(letters_current[:], words[:])
                    dropQuoteSnapshot.words[word_index] = dropQuoteWords
                    if len(words) == 1:
                        stuck = False
                        dropquote_apply_reverse(grid_working, letters_working, words[0], row_current, column_current)
                
                word_index += 1
                word_current = ''
                letters_current = []
            elif grid_working[row_current][column_current] == ' ':
                word_current += ' '
                letters_current.append(letters_working[column_current])
            else:
                word_current += grid_working[row_current][column_current]
                letters_current.append('')
            
            column_current += 1
            if column_current >= len(grid_working[row_current]):
                row_current += 1
                column_current = 0

        dropQuoteSnapshots.append(dropQuoteSnapshot)
    
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

def dropquote_word(word, letters):
    pattern = '^'
    for index in range(len(word)):
        if word[index] == ' ':
            pattern += f'[{letters[index]}]'
        else:
            pattern += word[index]
    pattern += '$'
    return search(pattern)

def dropquote_apply_reverse(grid, letters, word, row, column):
    quotient, remainder = divmod(len(word), len(grid[0]))
    row -= quotient
    column -= remainder
    if column < 0:
        row -= 1
        column = len(grid[0]) + column
    
    dropquote_apply(grid, letters, word, row, column)

def dropquote_apply(grid, letters, word, row, column):
    for letter in word:
        grid[row] = grid[row][:column] + letter + grid[row][column + 1:]
        letters[column] = letters[column].replace(letter, '', 1)
        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0