import itertools
from utils.dictionary import get_current_dictionary
from utils.word import get_character_histogram, histogram_to_string

class AnagramPattern:
	num_of_letters = 26
	__words_sorted_by_length_then_lex = None
	def __init__(self, pattern=None, character_histogram=None, num_wildcards=None):
		"""
		:param pattern: anagram pattern to look up. consists of lower case chars and ? for wildcard
		:type pattern: string
		:param character_histogram: (internal-use only) array of ints denoting character frequencies in pattern, wildcard excluded
		:type character_histogram: list[int]
		:param num_wildcards: (internal-use only) number of wildcards in pattern.
		:type num_wildcards: int
		"""
		if character_histogram == None:
			wildcard_stripped = list(filter(lambda c: c != "?", pattern))
			character_histogram = get_character_histogram(wildcard_stripped)
			num_wildcards = len(pattern) - len(wildcard_stripped)

		self.character_histogram = character_histogram
		self.num_wildcards = num_wildcards

	def expand_wildcard(self):
		return self.expand_wildcard_helper(0, self.num_wildcards)

	def expand_wildcard_helper(self, starting_from, num_wildcards_left):
		"""
		Computes a list of character histograms that are covered by the the current histogram and wildcards

		:param starting_from: index of letter to start expanding wildcards from, we keep track of this in order to avoid repeats
		:type starting_from: int
		:param num_wildcards_left: number of wildcards left to expand
		:type num_wildcards_left: int
		"""
		expanded_histograms = []
		if num_wildcards_left == 0:
			expanded_histograms.append(histogram_to_string(self.character_histogram))
		else:
			for i in range(starting_from, self.num_of_letters):
				self.character_histogram[i] += 1
				expanded_histograms += self.expand_wildcard_helper(i, num_wildcards_left - 1)
				self.character_histogram[i] -= 1
		return expanded_histograms

	@classmethod
	def __get_words_sorted_by_length_then_lex(cls):
		if cls.__words_sorted_by_length_then_lex == None:
			cls.__words_sorted_by_length_then_lex = reversed(get_current_dictionary().words_sorted_by_length_then_lex)
		return cls.__words_sorted_by_length_then_lex

	def subtract_word(self, word):
		"""
		Creates a new AnagramPattern that has the characters from word removed from its characters.
		If not enough characters in the pattern, then use wildcards.
		If not enough wildcards, then we cannot subtract the from the pattern so give up and return None

		:param word: word to subtract
		:type word: string
		"""
		# Creates a copy of self.character_histogram
		new_character_histogram = list(self.character_histogram)
		new_num_wildcards = self.num_wildcards
		word_character_histogram = get_character_histogram(word)
		for i in range(self.num_of_letters):
			new_character_histogram[i] -= word_character_histogram[i]
			if new_character_histogram[i] < 0:
				# if the pattern does not have enough characters to match the word, we try to use the wildcards to match
				new_num_wildcards += new_character_histogram[i]
				new_character_histogram[i] = 0
				if new_num_wildcards < 0:
					return None
		return type(self)(character_histogram=new_character_histogram, num_wildcards=new_num_wildcards)

	def find(self):
		"""
		Finds the single word anagrams of the pattern
		:rtype: list[string]
		"""
		words_by_character_frequency = get_current_dictionary().words_by_character_frequency
		anagrams = []
		expanded_histograms = self.expand_wildcard()
		for histogram in expanded_histograms:
			if histogram in words_by_character_frequency:
				anagrams += words_by_character_frequency[histogram]
		return anagrams

	def find_multi_helper(self, use_words_until, words_so_far):
		"""
		Helper function for find_multi
		:param use_words_until: will only search words between indices [0, use_words_until] inclusive in the dictionary. This prevents re-searching the same word
		:type use_words_until: int
		:param words_so_far: matched words so far. Used for printing solutions as we find them
		:type words_so_far: list[string]
		:rtype: list[list[string]]
		"""
		single_word_anagrams = self.find()
		largest_word = get_current_dictionary().words_sorted_by_length_then_lex[use_words_until]
		single_word_anagrams_deduped = []
		for single_word_anagrams in single_word_anagrams:
			if len(single_word_anagrams) < len(largest_word) or \
				(len(single_word_anagrams) == len(largest_word) and single_word_anagrams <= largest_word):
				# prints out solutions as we find them since the whole algo is very slow
				print(words_so_far + [single_word_anagrams])
				single_word_anagrams_deduped.append([single_word_anagrams])
		if len(single_word_anagrams_deduped) > 0:
			# Terminate once we found a single word anagram for the rest of the pattern. We might miss some words but this makes the run faster
			return single_word_anagrams_deduped

		multi_word_anagrams = []
		# Looping from back to front in order to prioritize longer words first since those tends to be more relevant
		for i in range(use_words_until, -1, -1):
			word = get_current_dictionary().words_sorted_by_length_then_lex[i]
			remaining_pattern = self.subtract_word(word)
			if remaining_pattern != None:
				words_so_far.append(word)
				remaining_multi_word_anagrams = remaining_pattern.find_multi_helper(i, words_so_far)
				words_so_far.pop()
				for remaining_multi_word_anagram in remaining_multi_word_anagrams:
					multi_word_anagrams.append([word] + remaining_multi_word_anagram)
		return multi_word_anagrams

	def find_multi(self):
		"""
		Finds the multi word anagrams of the pattern
		:rtype: list[list[string]]
		"""
		return self.find_multi_helper(len(get_current_dictionary().words_sorted_by_length_then_lex) - 1, [])

	def __str__(self):
		return "<hist:[" + histogram_to_string(self.character_histogram) + "], wild:[" + str(self.num_wildcards) + "]>"


def anagram(pattern):
	"""
	Finds the single word anagrams of the pattern
	:rtype: list[string]
	"""
	pattern = AnagramPattern(pattern=pattern)
	return pattern.find()

def anagram_multi(pattern):
	"""
	Finds the multi word anagrams of the pattern
	:rtype: list[list[string]]
	"""
	pattern = AnagramPattern(pattern=pattern)
	return pattern.find_multi()
