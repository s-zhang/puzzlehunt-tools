from .search import search

class DropQuoteSnapshot:
    def __init__(self):
        self.grid = []
        self.letters = []
        self.words = []

class DropQuoteWord:
    def __init__(self, index, word, letters, start_row, start_column, possibilities):
        self.index = index
        self.word = word
        self.letters = letters
        self.start_row = start_row
        self.start_column = start_column
        self.possibilities = possibilities

def dropquote(grid, letters):
    """
    This solver will attempt to solve the drop quote puzzle and returns a set of snapshots on the iterations performed.
    >>> grid = ['    -', '  -  ', '     ']
    >>> letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    >>> snapshots = dropquote(grid, letters)
    >>> print(snapshots[0].grid) # prints the initial state of the grid
    ['    -', '  -  ', '     ']
    >>> print(snapshots[0].letters) # prints the initial state of available letters
    ['gor', 'afo', 'mn', 'ete', 'hs']
    >>> for index, words in snapshots[0].words.items():
    >>>     print(f'{index}: {words.letters} | {words.words}') # prints the index of the word, available letters, and found words
    0: ['gor', 'afo', 'mn', 'ete'] | ['gant', 'rone', 'ront', 'oont', 'gone', 'rant', 'game', 'gane']
    1: ['gor', 'afo'] | ['go', 'of']
    2: ['ete', 'hs', 'gor', 'afo', 'mn', 'ete', 'hs'] | ['thrones']
    >>> print(snapshots[-1].grid) # prints the current state of the grid
    ['game-', 'of-th', 'rones']
    """
    dropquote_validate(grid, letters)

    current_grid = []
    for row in grid:
        current_grid.append(row.lower())

    current_letters = []
    for column in letters:
        current_letters.append(list(column.lower()))

    words = dropquote_parse_words(current_grid, current_letters)

    stuck = False
    dropQuoteSnapshots = []
    while not stuck:
        stuck = True
        dropQuoteSnapshot = dropquote_search(current_grid, current_letters, words)
        dropQuoteSnapshots.append(dropQuoteSnapshot)

        for word in dropQuoteSnapshot.words:
            if len(word.possibilities) == 1:
                stuck = False
                dropquote_apply_word_at_location(current_grid, current_letters, word.possibilities[0], word.start_row, word.start_column)
                words[word.index].word = word.possibilities[0]
    
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

def dropquote_parse_words(grid, letters):
    grid[-1] += '-'
    index = 0
    current_word = ''
    current_word_start_row = 0
    current_word_start_column = 0
    current_letters = []
    new = True
    words = []
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            if grid[row][column] == '-':
                if new == False:
                    words.append(DropQuoteWord(index, current_word, current_letters, current_word_start_row, current_word_start_column, []))
                    index += 1
                    current_word = ''
                    current_letters = []
                    new = True
            else:
                if new == True:
                    current_word_start_row = row
                    current_word_start_column = column
                
                current_word += grid[row][column]
                current_letters.append(letters[column])
                new = False

    grid[-1] = grid[-1][:-1]
    return words

def dropquote_search(grid, letters, words):
    snapshot = DropQuoteSnapshot()
    snapshot.grid = grid[:]
    snapshot.letters = [''.join(column[:]) for column in letters]

    for word in words:
        possibilities = []
        if word.word.find(' ') != -1:
            # Overlapped columns could produce a superset of the actual possible words
            possibilities = dropquote_search_words(word.word, word.letters)

        snapshot.words.append(DropQuoteWord(
            word.index,
            word.word,
            [''.join(column[:]) for column in word.letters],
            word.start_row,
            word.start_column,
            possibilities))
    
    return snapshot

def dropquote_search_words(word, letters):
    pattern = '^'
    for index in range(len(word)):
        if word[index] == ' ':
            pattern += f'[{"".join(letters[index])}]'
        else:
            pattern += word[index]
    pattern += '$'
    return search(pattern)

def dropquote_apply_word(grid, letters, word_index, word):
    """
    Applies a word at the word index to the grid and removes the consumed letters.
    >>> grid = ['    -', '  -  ', '     ']
    >>> letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    >>> dropquote_apply_word(grid, letters, 2, 'thrones')
    >>> print(grid)
    ['    -', '  -th', 'rones']
    >>> print(letters)
    ['go', 'af', 'm', 'e', '']
    """
    current_letters = []
    for column in letters:
        current_letters.append(list(column.lower()))

    row, column = dropquote_locate_word(grid, letters, word_index)
    dropquote_apply_word_validate(grid, letters, word, row, column)
    dropquote_apply_word_at_location(grid, current_letters, word, row, column)

    del letters[:]
    for column in current_letters:
        letters.append(''.join(column))

def dropquote_locate_word(grid, letters, word_index):
    grid[-1] += '-'

    index = 0
    new = True
    found = False
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            if grid[row][column] == '-':
                if new == False:
                    index += 1
                    new = True
            else:
                if new == True and index == word_index:
                    found = True
                    break

                new = False
        
        if found == True:
            break

    grid[-1] = grid[-1][:-1]
    
    if found == False:
        raise ValueError('The word index is greater than the number of words.')
    
    return row, column

def dropquote_apply_word_validate(grid, letters, word, row, column):
    current_letters = letters[:]
    for letter in word:
        if grid[row][column] == '-':
            raise ValueError('The provided word was longer than the word in the grid.')

        if letter != grid[row][column] and grid[row][column] != ' ':
            raise ValueError('The word conflicts with existing letters in grid.')

        if grid[row][column] == ' ' and current_letters[column].find(letter) == -1:
            raise ValueError(f'There were not enough \'{letter}\' found in column {column}.')

        current_letters[column] = current_letters[column].replace(letter, '', 1)
        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0

def dropquote_apply_word_at_location(grid, letters, word, row, column):
    for letter in word:
        if grid[row][column] == ' ':
            grid[row] = grid[row][:column] + letter + grid[row][column + 1:]
            letters[column].remove(letter)

        column += 1
        if column >= len(grid[row]):
            row += 1
            column = 0