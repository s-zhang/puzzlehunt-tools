semaphoreClockMapping = {
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

semaphoreCompassMapping = {
    'n': 12,
    'ne': 1,
    'e': 3,
    'se': 4,
    's': 6,
    'sw': 7,
    'w': 9,
    'nw': 10,
}

semaphoreMapping = {
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

def parsePosition(position):
    try:
        return semaphoreClockMapping[int(position)]
    except ValueError:
        return semaphoreCompassMapping[position]

def semaphore(position1, position2):
    try:    
        pos1 = parsePosition(position1)
        pos2 = parsePosition(position2)

        if pos1 < pos2:
            return semaphoreMapping[pos1][pos2]
        else:
            return semaphoreMapping[pos2][pos1]
    except (KeyError, TypeError):
        return '?'

def semaphoremulti(positions):
    if len(positions) % 2 == 1:
        print("An odd number of positions were provided")
        return
    
    letters = ""
    iterator = iter(positions)
    for position in iterator:
        letters += semaphore(position, next(iterator))
    
    return letters