import arg_parser
import utils.dictionary
from utils.dictionary import Dictionary
from anagram import anagram, anagram_multi
from search import search

# Recommend to use this interactively by running
# >python -i wordhelper.py

def main():
	"""
		Examples:
		utils.dictionary.CURRENT_DICTIONARY = Dictionary("google-10000-english-usa")
		utils.dictionary.CURRENT_DICTIONARY = Dictionary("Peter Norvig in Collins")
		print(anagram("qi??"))
		print(anagram_multi("irobot"))
		print(search("^t.st$"))
	"""
	return

if __name__ == '__main__':
	main()
