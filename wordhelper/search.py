import re
from utils.dictionary import get_current_dictionary

def search(pattern):
	regex = re.compile(pattern)
	found_words = []
	for word in get_current_dictionary().words:
		if regex.match(word):
			found_words.append(word)
	return found_words