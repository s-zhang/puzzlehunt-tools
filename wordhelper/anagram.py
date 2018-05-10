from utils.dictionary import get_current_dictionary
from utils.word import get_character_histogram, histogram_to_string

def anagram(pattern):
	pattern = AnagramPattern(pattern=pattern)
	return pattern.find()

def anagram_multi(pattern):
	pattern = AnagramPattern(pattern=pattern)
	return pattern.find_multi()

class AnagramPattern:
	def __init__(self, pattern=None, character_histogram=None, num_wildcards=None):
		if character_histogram == None:
			wildcard_stripped = list(filter(lambda c: c != "?", pattern))
			character_histogram = get_character_histogram(wildcard_stripped)
			num_wildcards = len(pattern) - len(wildcard_stripped)

		self.character_histogram = character_histogram
		self.num_wildcards = num_wildcards

	def expand_wildcard(self):
		return self.expand_wildcard_helper(0, self.num_wildcards)

	def expand_wildcard_helper(self, starting_from, num_wildcards_left):
		expanded_histograms = []
		if num_wildcards_left == 0:
			expanded_histograms.append(histogram_to_string(self.character_histogram))
		else:
			for i in range(starting_from, 26):
				self.character_histogram[i] += 1
				expanded_histograms += self.expand_wildcard_helper(i, num_wildcards_left - 1)
				self.character_histogram[i] -= 1
		return expanded_histograms

	def subtract_word(self, word):
		# Creates a copy of self.character_histogram
		new_character_histogram = list(self.character_histogram)
		new_num_wildcards = self.num_wildcards
		word_character_histogram = get_character_histogram(word)
		for i in range(26):
			new_character_histogram[i] -= word_character_histogram[i]
			if new_character_histogram[i] < 0:
				new_num_wildcards += new_character_histogram[i]
				new_character_histogram[i] = 0
				if new_num_wildcards < 0:
					return None
		return type(self)(character_histogram=new_character_histogram, num_wildcards=new_num_wildcards)

	def find(self):
		words_by_character_frequency = get_current_dictionary().words_by_character_frequency
		anagrams = []
		expanded_histograms = self.expand_wildcard()
		for histogram in expanded_histograms:
			if histogram in words_by_character_frequency:
				anagrams += words_by_character_frequency[histogram]
		return anagrams

	def find_multi(self, words_so_far=[]):
		single_word_anagrams = self.find()
		if len(single_word_anagrams) > 0:
			for i in range(len(single_word_anagrams)):
				single_word_anagrams[i] = [single_word_anagrams[i]]
				print(words_so_far + single_word_anagrams[i])
			return single_word_anagrams

		multi_word_anagrams = []
		for word in reversed(get_current_dictionary().words_sorted_by_length):
			remaining_pattern = self.subtract_word(word)
			if remaining_pattern != None:
				words_so_far.append(word)
				remaining_multi_word_anagrams = remaining_pattern.find_multi()
				words_so_far.pop()
				if len(remaining_multi_word_anagrams) != None:
					for remaining_multi_word_anagram in remaining_multi_word_anagrams:
						multi_word_anagrams.append([word] + remaining_multi_word_anagram)
		return multi_word_anagrams