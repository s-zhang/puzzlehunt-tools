from .search import search

BLANK_CHARACTER = '.'
SPACE_CHARACTER = '-'

class DropQuoteSnapshot:
    def __init__(self):
        self.grid = []
        self.letters = []
        self.words = []

class DropQuoteWord:
    def __init__(self, index, word, letters, row, column, possibilities):
        self.index = index
        self.word = word
        self.letters = letters
        self.row = row
        self.column = column
        self.possibilities = possibilities

class DropQuoteSolver:
    def __init__(self, grid, letters):
        self.grid = []
        for row in grid:
            self.grid.append(row.lower())

        self.letters = []
        for column in letters:
            self.letters.append(list(column.lower()))

        self.validate()
        self.words = self.parse()

    def validate(self):
        '''
        Validates that the drop quote puzzle is in a valid format.
        '''
        row_length = len(self.grid[0])
        column_lengths = [0] * row_length
        for row in range(len(self.grid)):
            if row_length != len(self.grid[row]):
                raise ValueError(f'Row {row} did not have the same length as the first row.')
            
            for column in range(len(self.grid[row])):
                if self.grid[row][column] == BLANK_CHARACTER:
                    column_lengths[column] += 1
        
        for column in range(row_length):
            if len(self.letters[column]) != column_lengths[column]:
                raise ValueError(f'Column {column} has {len(self.letters[column])} letters but has {column_lengths[column]} blanks.')

    def parse(self):
        '''
        Extracts information about each word in the drop quote puzzle
        '''
        self.grid[-1] += SPACE_CHARACTER
        index = 0
        current_word = ''
        current_word_row = 0
        current_word_column = 0
        current_letters = []
        new = True
        words = []
        for row in range(len(self.grid)):
            for column in range(len(self.grid[row])):
                if self.grid[row][column] == SPACE_CHARACTER:
                    if new == False:
                        words.append(DropQuoteWord(index, current_word, current_letters, current_word_row, current_word_column, []))
                        index += 1
                        current_word = ''
                        current_letters = []
                        new = True
                else:
                    if new == True:
                        current_word_row = row
                        current_word_column = column
                    
                    current_word += self.grid[row][column]
                    current_letters.append(self.letters[column])
                    new = False

        self.grid[-1] = self.grid[-1][:-1]
        return words

    def solve(self):
        """
        Attempt to solve the drop quote puzzle and returns a set of snapshots on the iterations performed.
        """
        stuck = False
        dropQuoteSnapshots = []
        while not stuck:
            stuck = True
            self.search()
            dropQuoteSnapshots.append(self.snapshot())

            for word in self.words:
                if len(word.possibilities) == 1:
                    stuck = False
                    self.apply_word(word.possibilities[0], word.row, word.column)
                    word.word = word.possibilities[0]
                    word.possibilities = []
        
        return dropQuoteSnapshots

    def search(self):
        '''
        Finds possible words for the drop quote puzzle. 
        '''
        for word in self.words:
            if BLANK_CHARACTER in word.word:
                word.possibilities = self.search_word(word.word, word.letters)

    def search_word(self, word, letters):
        '''
        Finds possible words for a specific word in the drop quote puzzle.
        '''
        # Overlapped columns could produce a superset of the actual possible words
        pattern = '^'
        for index in range(len(word)):
            if word[index] == BLANK_CHARACTER:
                pattern += f'[{"".join(letters[index])}]'
            else:
                pattern += word[index]
        pattern += '$'
        return search(pattern)

    def apply_word(self, word, row, column):
        '''
        Updates the grid and available letters with the provided word at the specified row and column.
        '''
        for letter in word:
            if self.grid[row][column] == SPACE_CHARACTER:
                raise ValueError('The provided word was longer than the word in the grid.')

            if letter != self.grid[row][column] and self.grid[row][column] != BLANK_CHARACTER:
                raise ValueError('The word conflicts with existing letters in grid.')

            if self.grid[row][column] == BLANK_CHARACTER:
                self.grid[row] = self.grid[row][:column] + letter + self.grid[row][column + 1:]
                try:
                    self.letters[column].remove(letter)
                except ValueError:
                    raise ValueError(f'There were not enough \'{letter}\' found in column {column}.')

            column += 1
            if column >= len(self.grid[row]):
                row += 1
                column = 0
    
    def snapshot(self):
        """
        Creates a snapshot of the current drop quote state.
        """
        snapshot = DropQuoteSnapshot()
        snapshot.grid = self.grid[:]
        snapshot.letters = [''.join(column[:]) for column in self.letters]
        for word in self.words:
            snapshot.words.append(DropQuoteWord(
                word.index,
                word.word,
                [''.join(column[:]) for column in word.letters],
                word.row,
                word.column,
                word.possibilities))
        
        return snapshot

def dropquote(grid, letters):
    """
    This solver will attempt to solve the drop quote puzzle and returns a set of snapshots on the iterations performed.
    >>> grid = ['....-', '..-..', '.....']
    >>> letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    >>> snapshots = dropquote(grid, letters)
    >>> print(snapshots[0].grid) # prints the initial state of the grid
    ['....-', '..-..', '.....']
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
    solver = DropQuoteSolver(grid, letters)
    return solver.solve()

def dropquote_apply_word(grid, letters, word, index):
    """
    Applies a word at the word index to the grid and removes the consumed letters.
    >>> grid = ['....-', '..-..', '.....']
    >>> letters = ['gor', 'afo', 'mn', 'ete', 'hs']
    >>> dropquote_apply_word(grid, letters, 'thrones', 2)
    >>> print(grid)
    ['....-', '..-th', 'rones']
    >>> print(letters)
    ['go', 'af', 'm', 'e', '']
    """
    solver = DropQuoteSolver(grid, letters)
    solver.apply_word(word, solver.words[index].row, solver.words[index].column)
    snapshot = solver.snapshot()
    return snapshot.grid, snapshot.letters