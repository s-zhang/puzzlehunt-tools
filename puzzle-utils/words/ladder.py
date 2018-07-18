from .search import search
from typing import List, Dict, Optional

def ladder(word: str) -> List[str]:
    """ Find all possibilities for the next word in the ladder

    Given a word, find all "adjacent" words in the dictionary
    i.e. all words with edit distance of 1 from the given word

    Args:
        word: The current word in the ladder

    Returns:
        A list of possible words in the word ladder

    See Also:
        find_ladders: Find all ladders between two words
        find_ladders_pretty: Print all unique ladders between two words nicely
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

def edit_distance(left_word: str, right_word: str) -> int:
    """ The difference between same-length words in number of edits

    The result is the edit distance of the two words (number of
    substitutions required to tranform left_word into right_word).

    Args:
        left_word: One word to compare
        right_word: The other word to compare

    Returns:
        An integer representing the edit distance

    Raises:
        ValueError: If the lengths of the word args are different
    """
    if len(left_word) != len(right_word):
        raise ValueError("Word ladder words must be same length")

    distance = 0;
    for i in range(len(left_word)):
        if left_word[i] != right_word[i]:
            distance += 1
    return distance

def follow_ladder_path(word_path: List[str], right_word: str, cached_searches: Dict, depth: int, exact_depth: Optional[int], max_depth: int, use_heuristic: bool) -> List[List[str]]:
    """ Helper to recursively find a word ladder path (see find_ladders)

    This function runs a recursive depth first search to find a word ladder.
    We cache word search lookups when we can to save time.

    Args:
        word_path: A list of words in the path so far
        right_word: The destination word
        cached_searches: A dictionary of adjacency searches
        depth: The current depth of the search
        exact_depth: The target depth of the search, if any
        max_depth: The maximum depth of the search
        use_heuristics: Flag to indicate if we decrease our search space

    Returns:
        A list of valid word paths or an empty list if we hit a dead end
    """
    # Base case
    current_word = word_path[-1]
    if current_word == right_word:
        return [list(word_path)]

    # We're too deep, this will take too long
    if depth > max_depth:
        return []

    # We don't care about this, we want a specific depth
    if exact_depth is not None and depth > exact_depth:
        return []

    # Find words closer to destination (avoiding cycles)
    max_edit_distance = edit_distance(current_word, right_word) if use_heuristic else len(current_word)
    adjacent_words = set()
    if current_word in cached_searches.keys():
        adjacent_words = cached_searches[current_word]
    else:
        adjacent_words = ladder(current_word)
        cached_searches[current_word] = adjacent_words
    used_words = set(word_path)
    next_words = list(filter(lambda w: w not in used_words and edit_distance(w, right_word) <= max_edit_distance, adjacent_words))

    # No ladder exists this way
    if len(next_words) == 0:
        return []

    found_paths = []
    for next_word in next_words:
        word_path.append(next_word)
        results = follow_ladder_path(word_path, right_word, cached_searches, depth + 1, exact_depth, max_depth, use_heuristic)
        word_path.pop()

        # We have one or more paths to examine
        if len(results) != 0:
            for path in results:
                found_paths.append(path)

    return found_paths

def find_ladders(left_word: str, right_word: str, exact_depth: Optional[int] = None, max_depth: int = 10, use_heuristic: bool = True) -> List[List[str]]:
    """ Find a word ladder

    Given two words, find every "path" from left_word to right_word
    Each path is a list of words where each word is an edit distance
    of 1 from each neighbour. The list starts with left_word and ends
    with right_word

    Args:
        left_word: The start word
        right_word: The end word
        exact_depth: The desired length of the path
        max_depth: The maximum depth of the path
        use_heuristic: Flag to use potentially erroneous heuristics to limit search space

    Returns:
        A list of valid word paths or an empty list if we hit a dead end

    Raises:
        ValueError: If the lengths of the word args are different

    See Also:
        ladder: Find adjacent words
        find_ladders_pretty: Print all unique ladders between two words nicely
    """
    if len(left_word) != len(right_word):
        raise ValueError("Word ladder words must be same length")

    cached_searches = {}
    return follow_ladder_path([left_word.lower()], right_word.lower(), cached_searches, 2, exact_depth, max_depth, use_heuristic)

def find_ladders_pretty(left_word: str, right_word: str, exact_depth: Optional[int] = None, max_depth: int = 10, use_heuristic: bool = True):
    """ Print unique word ladders (see find_ladders)

    See Also:
        ladder: Find adjacent words
        find_ladders: Find all ladders between two words
    """
    # Find all ladders and sort by length
    found_ladders = find_ladders(left_word, right_word, exact_depth, max_depth, use_heuristic)
    if len(found_ladders) == 0:
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
