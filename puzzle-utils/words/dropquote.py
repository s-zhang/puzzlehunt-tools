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
    
    def print(self):
        print(f'{self.index}:\tWord: {self.word}')
        print(f'\tLetters: {self.letters}')
        print(f'\tRow: {self.row}')
        print(f'\tColumn: {self.column}')
        print(f'\tPossibilities: {self.possibilities}')

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
        self.snapshots = []

    def validate(self):
        '''
        Validates that the drop quote puzzle is in a valid format.
        '''
        # Checks the number of blanks matches the number of available letters in each column
        for column in range(len(self.letters)):
            blanks = 0
            for row in range(len(self.grid)):
                if len(self.grid[row]) > column and self.grid[row][column] == BLANK_CHARACTER:
                    blanks += 1
            
            if blanks != len(self.letters[column]):
                raise ValueError(f'Column {column} has {len(self.letters[column])} letters but has {blanks} blanks.')
        
        # Checks there aren't any rows that are longer than the number of columns
        longest_row = 0
        for row in range(len(self.grid)):
            if len(self.grid[row]) > longest_row:
                longest_row = len(self.grid[row])

        if longest_row > len(self.letters):
            raise ValueError(f'There are {len(self.letters)} columns of letters but the longest row has {longest_row} columns.')

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
        '''	
        Attempt to solve the drop quote puzzle and returns a set of snapshots on the iterations performed.
        '''	
        stuck = False
        while not stuck:
            stuck = True
            self.search()
            self.snapshots.append(self.snapshot())

            for word in self.words:
                if len(word.possibilities) == 1:
                    stuck = False
                    self.apply_word(word.possibilities[0], word.index)

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

    def apply_word(self, word, index):
        '''
        Updates the grid and available letters with the provided word at the specified row and column.
        '''
        self.words[index].word = word
        self.words[index].possibilities = []
        row = self.words[index].row
        column = self.words[index].column

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
        
        self.snapshots.append(self.snapshot())
    
    def snapshot(self):
        '''	
        Creates a snapshot of the current drop quote state.
        '''	
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
    
    def print(self):
        print('========== LETTERS ==========')
        longest_column = 0
        for column in self.letters:
            if longest_column < len(column):
                longest_column = len(column)
        
        for letter_row in range(longest_column - 1, -1, -1):
            for column in self.letters:
                if letter_row < len(column):
                    print(column[letter_row], end='')
                else:
                    print(' ', end='')
            print()
        
        print()

        print('========== GRID ==========')
        for row in self.grid:
            print(row)
        
        print()

        print('========== REMAINING WORDS ==========')
        for word in self.words:
            if BLANK_CHARACTER in word.word:
                word.print()