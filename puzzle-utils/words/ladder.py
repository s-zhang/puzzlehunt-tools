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
