from utils.dictionary import CURRENT_DICTIONARY
from utils.word import get_character_histogram, histogram_to_string

def anagram(pattern):
	words_by_character_frequency = CURRENT_DICTIONARY.words_by_character_frequency
	wildcard_stripped = list(filter(lambda c: c != "?", pattern))
	wildcard_stripped_histogram = get_character_histogram(wildcard_stripped)
	anagrams = []
	expanded_histograms = expand_wildcard(wildcard_stripped_histogram, len(pattern) - len(wildcard_stripped))
	for histogram in expanded_histograms:
		if histogram in words_by_character_frequency:
			anagrams += words_by_character_frequency[histogram]
	return anagrams

def expand_wildcard(character_histogram, num_wildcards):
	expanded_histograms = []
	if num_wildcards == 0:
		expanded_histograms.append(histogram_to_string(character_histogram))
	else:
		for i in range(26):
			character_histogram[i] += 1
			expanded_histograms += expand_wildcard(character_histogram, num_wildcards - 1)
			character_histogram[i] -= 1
	return expanded_histograms