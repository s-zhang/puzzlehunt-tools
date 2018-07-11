from .search import search

def ladder(word):
    """
    Given a word, find all "adjacent" words in the dictionary
    i.e. all words with edit distance of 1 from the given word

    Params:
    word (required) - The base word

    Alternatives:
    find_ladders        - Find all ladders between two words
    find_ladders_pretty - Print all unique ladders between two words nicely
    """
    found_words = set()
    for i in range(len(word)):
        pattern = list(word)
        pattern[i] = '.'
        search_results = search("^" + "".join(pattern) + "$")
        for result in search_results:
            if result != word and result not in found_words:
                found_words.add(result)
    return found_words

def edit_distance(left_word, right_word):
    """
    This assumes the lengths of the words are the same.
    The result is the edit distance of the two words (number of
    substitutions required to tranform left_word into right_word).
    """
    if len(left_word) != len(right_word):
        raise ValueError("Word ladder words must be same length")

    distance = 0;
    for i in range(len(left_word)):
        if left_word[i] != right_word[i]:
            distance += 1
    return distance

def follow_ladder_path(word_path, right_word, cached_searches, depth, exact_depth, max_depth, use_heuristic):
    """
    Helper to recursively find a word ladder path
    """
    # We're too deep, this will take too long
    if depth > max_depth:
        return None

    # We don't care about this, we want a specific depth
    if exact_depth is not None and depth > exact_depth:
        return None

    # Find words closer to destination (avoiding cycles)
    current_word = word_path[-1]
    max_edit_distance = edit_distance(current_word, right_word) if use_heuristic else len(current_word)
    adjacent_words = []
    if current_word in list(cached_searches.keys()):
        adjacent_words = cached_searches[current_word]
    else:
        adjacent_words = list(ladder(current_word))
        cached_searches[current_word] = adjacent_words
    next_words = list(filter(lambda w: w not in word_path and edit_distance(w, right_word) <= max_edit_distance, adjacent_words))

    # No ladder exists this way
    if len(next_words) == 0:
        return None

    # We found a ladder! Append if it's the right depth
    if right_word in next_words:
        if exact_depth is None or depth == exact_depth:
            found_path = list(word_path)
            found_path.append(right_word)
            return found_path

    found_paths = []
    for next_word in next_words:
        results = None
        next_path = list(word_path)
        next_path.append(next_word)
        results = follow_ladder_path(next_path, right_word, cached_searches, depth + 1, exact_depth, max_depth, use_heuristic)

        # We have one or more paths to examine
        if results is not None:
            if isinstance(results[0], list):
                for path in results:
                    found_paths.append(path)
            else:
                found_paths.append(results)

    if len(found_paths) > 0:
        return found_paths

    # We've reached a dead end
    return None


def find_ladders(left_word, right_word, exact_depth = None, max_depth = 10, use_heuristic = True):
    """
    Given two words, find every "path" from left_word to right_word
    Each path is a list of words where each word is an edit distance
    of 1 from each neighbour. The list starts with left_word and ends
    with right_word

    max_depth indicates the maximum length of the "path" including the
    start and end words

    Params:
    left_word     (required) - The start word
    right_word    (required) - The end word
    exact_depth   (optional) - The desired length of the path (default None)
    max_depth     (optional) - The maximum depth of the path (default 10)
    use_heuristic (optional) - Use potentially erroneous heuristics to limit search space (default True)

    Alternatives:
    ladder              - Find adjacent words
    find_ladders_pretty - Print all unique ladders between two words nicely
    """
    if len(left_word) != len(right_word):
        raise ValueError("Word ladder words must be same length")

    cached_searches = {}
    return follow_ladder_path([left_word.lower()], right_word.lower(), cached_searches, 2, exact_depth, max_depth, use_heuristic)

def find_ladders_pretty(left_word, right_word, exact_depth = None, max_depth = 10, use_heuristic = True):
    """
    See documentation for find_ladders for details

    This version prints out results in a more readable format and removes
    paths that are identical except for ordering differences

    Alternatives:
    ladder       - Find adjacent words
    find_ladders - Find all ladders between two words
    """
    # Find all ladders and sort by length
    found_ladders = find_ladders(left_word, right_word, exact_depth, max_depth, use_heuristic)
    if found_ladders is None:
        return

    unique_ladders = set(map(lambda x: frozenset(x), found_ladders))
    pretty_ladders = []
    for found_ladder in found_ladders:
        if set(found_ladder) in unique_ladders:
            pretty_ladders.append(found_ladder)
            unique_ladders.remove(set(found_ladder))

    pretty_ladders.sort(key=len)
    for pretty_ladder in pretty_ladders:
        print(pretty_ladder)
