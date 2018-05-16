import collections
__ORD_A = ord('a')

def char_freq(word):
	frequencies = collections.OrderedDict()
	for char in word.lower():
		char_ord = ord(char) - __ORD_A
		if 0 <= char_ord and char_ord < 26:
			if char not in frequencies:
				frequencies[char] = 0
			frequencies[char] += 1
	return frequencies

def get_character_histogram(word):
	hist = [0] * 26
	for char in word:
		char_ord = ord(char) - __ORD_A
		if 0 <= char_ord and char_ord < 26:
			hist[char_ord] += 1
	return hist

def histogram_to_string(histogram):
	return ','.join(map(lambda f: str(f), histogram))

def get_a_index(string):
	indices = []
	for char in string.lower():
		char_ord = ord(char) - __ORD_A
		if 0 <= char_ord and char_ord < 26:
			indices.append(char_ord + 1)
		else:
			# Leave non-letters intact
			indices.append(char)
	return indices