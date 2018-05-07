import re
from utils.dictionary import CURRENT_DICTIONARY

def search(pattern):
	regex = re.compile(pattern)
	found_words = []
	for word in CURRENT_DICTIONARY.words:
		if regex.match(word):
			found_words.append(word)
	return found_words