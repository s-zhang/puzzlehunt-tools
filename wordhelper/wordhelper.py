import arg_parser
import utils.dictionary
from utils.dictionary import Dictionary
from anagram import anagram, anagram_multi
from search import search

# Recommend to use this interactively by running
# >python -i wordhelper.py

def main():
	utils.dictionary.CURRENT_DICTIONARY = Dictionary("google-10000-english-usa")
	#args_list = sys.argv[1:]
	#args = arg_parser.parse_args(args_list)
	#print(anagram("qi??"))
	#print(anagram_multi("cata"))
	#print(list(search("^t.st$")))
	return

if __name__ == '__main__':
	main()
