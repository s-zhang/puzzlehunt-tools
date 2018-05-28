semaphore_clock_mapping = {
    1: 1,
    2: 1,
    3: 3,
    4: 4,
    5: 4,
    6: 6,
    7: 7,
    8: 7,
    9: 9,
    10: 10,
    11: 10,
    12: 12,
}

semaphore_compass_mapping = {
    'n': 12,
    'ne': 1,
    'e': 3,
    'se': 4,
    's': 6,
    'sw': 7,
    'w': 9,
    'nw': 10,
}

semaphore_mapping = {
    1: {
        3: 'w',
        4: 'x',
        6: 'e',
        7: 'l',
        9: 'q',
        10: 'u',
    },
    3: {
        4: 'z',
        6: 'f',
        7: 'm',
        9: 'r',
        10: 'y',
        12: 'j',
    },
    4: {
        6: 'g',
        7: 'n',
        9: 's',
        12: 'v',
    },
    6: {
        7: 'a',
        9: 'b',
        10: 'c',
        12: 'd',
    },
    7: {
        9: 'h',
        10: 'i',
        12: 'k',
    },
    9: {
        10: 'o',
        12: 'p',
    },
    10: {
        12: 't',
    },
}

def parse_position(position):
    try:
        return semaphore_clock_mapping[int(position)]
    except ValueError:
        return semaphore_compass_mapping[position]

def semaphore(position1, position2):
    """
        A flag semaphore lookup tool. Supports compass directions and clock hand positions as input.
        Example:
            semaphore('s', 'nw') -> 'c'
            semaphore(10, 3) -> 'y'
    """
    try:    
        pos1 = parse_position(position1)
        pos2 = parse_position(position2)

        if pos1 < pos2:
            return semaphore_mapping[pos1][pos2]
        else:
            return semaphore_mapping[pos2][pos1]
    except (KeyError, TypeError):
        return '?'

def semaphore_multi(positions):
    """
        A flag semaphore lookup tool that supports multiple lookups. Supports compass directions and clock hand positions as input.
        Example:
        >>> semaphore_multi(['s', 'nw', 10, 3])
        'cy'
    """
    if len(positions) % 2 == 1:
        raise ValueError('An odd number of positions were provided')
    
    letters = ""
    for i in range(0, len(positions), 2):
        letters += semaphore(positions[i], positions[i + 1])
    
    return letters