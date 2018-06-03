from copy import deepcopy
from utils.dictionary import get_current_dictionary

def wordsearch_find(grid, words):
    normalized_words = []
    for word in words:
        normalized_words.append(word.lower())

    results = []    
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            results += wordsearch_find_point(grid, row, column, normalized_words)

    return results

def wordsearch_find_point(grid, row, column, words):
    results = []
    for direction in direction_to_increment_mapping:
        results += wordsearch_find_point_direction(grid, row, column, direction, words)

    return results

def wordsearch_find_point_direction(grid, row, column, direction, words):
    results = []
    word = ''
    row_current = row
    column_current = column
    row_increment, column_increment = direction_to_increment_mapping[direction]
    while wordsearch_is_point_inside_grid(grid, row_current, column_current):
        word += grid[row_current][column_current].lower()
        row_current += row_increment
        column_current += column_increment
        
        if word in words:
            results.append(WordSearchResult(word, row, column, direction))
    
    return results

def wordsearch_brute(grid, min_length):
    results = []
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            results += wordsearch_brute_point(grid, row, column, min_length)

    return results

def wordsearch_brute_point(grid, row, column, min_length):
    results = []
    for direction in direction_to_increment_mapping:
        results += wordsearch_brute_point_direction(grid, row, column, direction, min_length)

    return results

def wordsearch_brute_point_direction(grid, row, column, direction, min_length):
    results = []
    word = ''
    row_current = row
    column_current = column
    row_increment, column_increment = direction_to_increment_mapping[direction]
    while wordsearch_is_point_inside_grid(grid, row_current, column_current):
        word += grid[row_current][column_current].lower()
        row_current += row_increment
        column_current += column_increment

        if len(word) < min_length:
            continue
        
        if word in get_current_dictionary().words:
            results.append(WordSearchResult(word, row, column, direction))
    
    return results

def wordsearch_reduce(grid, words):
    results = wordsearch_find(grid, words)
    working_grid = deepcopy(grid)
    for result in results:
        row = result.row
        column = result.column
        row_increment, column_increment = direction_to_increment_mapping[result.direction]
        for _ in result.word:
            working_grid[row][column] = None
            row += row_increment
            column += column_increment
    
    reduced_grid = []
    for row in range(len(working_grid)):
        reduced_grid.append([])
        for char in working_grid[row]:
            if char != None:
                reduced_grid[row].append(char)
    
    return reduced_grid

def wordsearch_reduce_sentence(grid, words):
    reduced_grid = wordsearch_reduce(grid, words)
    sentence = ''
    for row in reduced_grid:
        sentence += ''.join(row)
    
    return sentence

def wordsearch_is_point_inside_grid(grid, row, column):
    return row > -1 and row < len(grid) and column > -1 and column < len(grid[row])

direction_to_increment_mapping = {
    'n': [-1, 0],
    'ne': [-1, 1],
    'e': [0, 1],
    'se': [1, 1],
    's': [1, 0],
    'sw': [1, -1],
    'w': [0, -1],
    'nw': [-1, -1]
}

class WordSearchResult:
    def __init__(self, word, row, column, direction):
        self.word = word
        self.row = row
        self.column = column
        self.direction = direction

#grid = [
#    ['M','E','S','S','A','G','E','S','E','E','L'],
#    ['E','A','T','T','E','R','S','A','T','I','N'],
#    ['T','E','N','R','S','E','C','T','I','O','N'],
#    ['S','O','R','I','E','N','D','S','D','R','A'],
#    ['W','L','N','I','F','N','E','S','B','E','L'],
#    ['T','T','W','E','E','E','N','G','U','E','L'],
#    ['O','I','D','E','D','B','S','Y','T','N','I'],
#    ['O','P','N','S','E','N','S','T','E','D','F'],
#    ['R','A','E','W','N','E','E','W','I','L','E'],
#    ['T','T','E','N','R','R','S','S','P','N','E'],
#    ['L','L','N','E','S','W','W','O','R','D','G']
#]
#words = ['opens', 'message', 'manifesting', 'into', 'fill', 'letters']
#
#results = wordsearch_brute(grid, 4)
#for result in results:
#    print(result.word)