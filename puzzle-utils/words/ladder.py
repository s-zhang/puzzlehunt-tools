from .search import search

def ladder(word):
    """
    Given a word, find all "adjacent" words in the dictionary
    i.e. all words with edit distance of 1 from the given word
    """
    found_words = []
    for i in range(len(word)):
        pattern = list(word)
        pattern[i] = '.'
        search_results = search("^" + "".join(pattern) + "$")
        for result in search_results:
            if result != word and result not in found_words:
                found_words.append(result)
    return found_words

def edit_distance(left_word, right_word):
    """
    This assumes the lengths of the words are the same.
    The result is the edit distance of the two words (number of
    substitutions required to tranform left_word into right_word).
    """
    distance = 0;
    for i in range(len(left_word)):
        if left_word[i] != right_word[i]:
            distance += 1
    return distance

def follow_ladder_path(word_path, right_word, cached_searches, depth, max_depth):
    """
    Helper to recursively find a word ladder path
    """
    # We're too deep, this will take too long
    if depth > max_depth:
        return None

    # Find words closer to destination (avoiding cycles)
    current_word = word_path[-1]
    max_edit_distance = edit_distance(current_word, right_word)
    adjacent_words = []
    if current_word in list(cached_searches.keys()):
        adjacent_words = cached_searches[current_word]
    else:
        adjacent_words = ladder(current_word)
        cached_searches[current_word] = adjacent_words
    next_words = list(filter(lambda w: w not in word_path and edit_distance(w, right_word) <= max_edit_distance, adjacent_words))

    # No ladder exists this way
    if len(next_words) == 0:
        return None

    # We found a ladder!
    if right_word in next_words:
        found_path = list(word_path)
        found_path.append(right_word)
        return found_path

    found_paths = []
    for next_word in next_words:
        results = None
        next_path = list(word_path)
        next_path.append(next_word)
        results = follow_ladder_path(next_path, right_word, cached_searches, depth + 1, max_depth)

        # We have one or more paths to examine
        if results is not None:
            if isinstance(results[0], list):
                for path in results:
                    found_paths.append(path)
            else:
                found_paths.append(results)

    if len(found_paths) > 0 and len(found_paths[0]) > 0:
        return found_paths

    # We've reached a dead end
    return None


def find_ladder(left_word, right_word, max_depth = 5):
    """
    Given two words, find a "path" from left_word to right_word
    The result, is a list of words where each word is an edit distance
    of 1 from each neighbour. The list starts with left_word and ends
    with right_word
    """
    if len(left_word) != len(right_word):
        raise ValueError("Word ladder words must be same length")

    cached_searches = {}
    return follow_ladder_path([left_word.lower()], right_word.lower(), cached_searches, 1, max_depth)
