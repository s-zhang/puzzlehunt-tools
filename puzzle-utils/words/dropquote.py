from .search import search

class DropQuoteSnapshot:
    def __init__(self):
        self.grid = []
        self.letters = []
        self.words = {}
    
    def print(self):
        print(self.grid)
        print(self.letters)
        for index, words in self.words.items():
            print(f'{index}: {words.letters} | {words.words}')
        print()

class DropQuoteWords:
    def __init__(self, letters, words):
        self.letters = letters
        self.words = words

def dropquote(grid, letters):
    """
    This solver will attempt to drop quote puzzle and returns a set of snapshots on the iterations performed.
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
                dropquote_apply_word(current_grid, current_letters, index, words.words[0])
    
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
    snapshot = DropQuoteSnapshot()
    snapshot.grid = grid[:]
    snapshot.letters = letters[:]

    row = 0
    column = 0
    word_index = 0
    current_word = ''
    current_letters = []
    while row < len(grid) and column < len(grid[0]):
        if grid[row][column] == '-':
            # Edge case: back to back '-' will result in an extra increment in the word
            if current_word.find(' ') != -1:
                # Edge case: if the word is long enough to overlap columns then the word search could produce invalid results
                snapshot.words[word_index] = DropQuoteWords(current_letters[:], dropquote_search_words(current_word, current_letters))
            
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
    
    if current_word.find(' ') != -1:
        # Edge case: if the word is long enough to overlap columns then the word search could produce invalid results
        snapshot.words[word_index] = DropQuoteWords(current_letters[:], dropquote_search_words(current_word, current_letters))

    return snapshot

def dropquote_search_words(word, letters):
    pattern = '^'
    for index in range(len(word)):
        if word[index] == ' ':
            pattern += f'[{letters[index]}]'
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
    # TODO: Validate the length of the words match (check if we run into '-')
    # TODO: Validate the word matches any existing letters in the grid
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