from copy import deepcopy
from .utils.dictionary import get_current_dictionary

class WordSearchResult:
    def __init__(self, word, row, column, direction):
        self.word = word
        self.row = row
        self.column = column
        self.direction = direction

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

def wordsearch_find(grid, words):
    normalized_words = []
    for word in words:
        normalized_words.append(word.lower())

    return wordsearch_grid(grid, wordsearch_find_function, normalized_words)

def wordsearch_find_function(word, row, column, direction, words):
    if word in words:
        return WordSearchResult(word, row, column, direction)

def wordsearch_brute(grid, min_length):
    return wordsearch_grid(grid, wordsearch_brute_function, min_length)

def wordsearch_brute_function(word, row, column, direction, min_length):
    if len(word) >= min_length and word in get_current_dictionary().words:
        return WordSearchResult(word, row, column, direction)

def wordsearch_grid(grid, function, parameters):
    results = []
    for row in range(len(grid)):
        for column in range(len(grid[row])):
            results += wordsearch_point(grid, row, column, function, parameters)

    return results

def wordsearch_point(grid, row, column, function, parameters):
    results = []
    for direction in direction_to_increment_mapping:
        results += wordsearch_point_direction(grid, row, column, direction, function, parameters)

    return results

def wordsearch_point_direction(grid, row, column, direction, function, parameters):
    results = []
    word = ''
    row_current = row
    column_current = column
    row_increment, column_increment = direction_to_increment_mapping[direction]
    while row_current > -1 and row_current < len(grid) and column_current > -1 and column_current < len(grid[row_current]):
        word += grid[row_current][column_current].lower()
        row_current += row_increment
        column_current += column_increment
        result = function(word, row, column, direction, parameters)
        if result != None:
            results.append(result)
    
    return results

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