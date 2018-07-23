from .utils.dictionary import get_current_dictionary

class WordSearchResult:
    def __init__(self, word, row, column, direction):
        self.word = word
        self.row = row
        self.column = column
        self.direction = direction

def wordsearch_reduce(grid, words):
    """
        Finds the provided words in the grid and produces an grid with the letters that were not used.
        Example:
        >>> grid = [
                'MHEL',
                'LOOS',
                'WOOU',
                'RLDN'
            ]
        >>> words = ['moon', 'sun']
        >>> wordsearch_reduce(grid, words)
        ['HEL', 'LO', 'WO', 'RLD']
    """
    results = wordsearch_find(grid, words)

    # Create a normalized grid for reference and another for keeping track of used cells
    reference_grid = []
    working_grid = []
    for row in grid:
        reference_row = [x.lower() for x in list(row)]
        reference_grid.append(reference_row)
        working_grid.append(reference_row[:])

    # Remove words from the working grid
    for result in results:
        row = result.row
        column = result.column
        row_increment, column_increment = direction_to_increment_mapping[result.direction]
        while len(result.word) > 0:
            result.word = result.word.replace(reference_grid[row][column], '', 1)
            working_grid[row][column] = None
            row += row_increment
            column += column_increment
    
    # Compress the working grid
    reduced_grid = []
    for row in range(len(working_grid)):
        reduced_grid.append('')
        for cell in working_grid[row]:
            if cell != None and not cell.isspace():
                reduced_grid[row] += cell
    
    return reduced_grid

def wordsearch_reduce_sentence(grid, words):
    """
        Finds the provided words in the grid and produces string with the letters that were not used.
        Example:
        >>> grid = [
                'MHEL',
                'LOOS',
                'WOOU',
                'RLDN'
            ]
        >>> words = ['moon', 'sun']
        >>> wordsearch_reduce_sentence(grid, words)
        'HELLOWORLD'
    """
    reduced_grid = wordsearch_reduce(grid, words)
    return ''.join(reduced_grid)

def wordsearch_find(grid, words):
    """
        Finds the provided words and returns their location and direction in the grid.
        Example:
        >>> grid = [
                'MHEL',
                'LOOS',
                'WOOU',
                'RLDN'
            ]
        >>> words = ['moon', 'sun']
        >>> wordsearch_find(grid, words)
    """
    normalized_words = []
    for word in words:
        normalized_words.append(word.lower())

    results = wordsearch_grid(grid, wordsearch_find_function, normalized_words)

    missing_words = []
    for word in words:
        found = False
        for result in results:
            if result.word == word:
                found = True
                break
        if not found:
            missing_words.append(word)
    
    if len(missing_words) > 0:
        raise ValueError(f'The following word(s) were not found: {", ".join(missing_words)}')

    return results

def wordsearch_find_function(word, row, column, direction, words):
    if word in words:
        return WordSearchResult(word, row, column, direction)

def wordsearch_brute(grid, min_length = 4):
    """
        Finds all words and returns their location and direction in the grid.
        Example:
        >>> grid = [
                'MHEL',
                'LOOS',
                'WOOU',
                'RLDN'
            ]
        >>> min_length = 4
        >>> wordsearch_brute(grid, min_length)
    """
    return wordsearch_grid(grid, wordsearch_brute_function, min_length)

def wordsearch_brute_function(word, row, column, direction, min_length):
    if len(word) >= min_length and word in get_current_dictionary().words:
        return WordSearchResult(word, row, column, direction)

def wordsearch_grid(grid, function, parameters):
    normalized_grid = []
    for row in grid:
        normalized_grid.append([x.lower() for x in list(row)])

    results = []
    for row in range(len(normalized_grid)):
        for column in range(len(normalized_grid[row])):
            results += wordsearch_point(normalized_grid, row, column, function, parameters)

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
        word += grid[row_current][column_current]
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