import os
from shutil import copyfile
import json
from .word import get_character_histogram, histogram_to_string

class Dictionary:
	dictionariesDir = os.path.join(os.getcwd(), "dictionaries")

	@classmethod
	def import_dictionary(cls, words_list_path, dictionary_name):
		if not os.path.exists(words_list_path):
			raise Exception("Words list [{}] not found".format(words_list_path))
		dictionary_dir = os.path.join(cls.dictionariesDir, dictionary_name)
		cls.create_dir(dictionary_dir)
		copyfile(words_list_path, os.path.join(dictionary_dir, "words.txt"))
		words = cls.load_words_list(words_list_path)
		words_by_character_frequency = cls.compute_character_frequencies(words)
		cls.save_dictionary({ "words": words, "words_by_character_frequency": words_by_character_frequency },
			os.path.join(dictionary_dir, "dictionary.json"))

	@staticmethod
	def create_dir(dir):
		try: 
			os.makedirs(dir)
		except OSError:
			if not os.path.isdir(dir):
				raise

	@staticmethod
	def load_words_list(words_list_path):
		# Use sets for dedupping
		words_list = set([])
		with open(words_list_path) as words_list_file:
			for line in words_list_file:
				# Only working with lowercase words
				words_list.add(line.strip().lower())
		return list(words_list)

	@staticmethod
	def save_dictionary(dictionary, path):
		with open(path, 'w') as dictionary_file:
			json.dump(dictionary, dictionary_file)

	@staticmethod
	def compute_character_frequencies(words):
		words_by_char_frequency = {}
		for word in words:
			histogram = histogram_to_string(get_character_histogram(word))
			if histogram not in words_by_char_frequency:
				words_by_char_frequency[histogram] = []
			words_by_char_frequency[histogram].append(word)
		return words_by_char_frequency
	
	def __init__(self, name):
		self.__words = None
		self.__dictionary = None
		self.__words_sorted_by_length = None
		self.__dictionary_path = os.path.join(self.dictionariesDir, name, "dictionary.json")
		if not os.path.exists(self.__dictionary_path):
			raise Exception("Dictionary [{}] not found".format(self.__dictionary_path))

	def __get_dictionary(self):
		if self.__dictionary == None:
			with open(self.__dictionary_path) as dictionary_file:
				self.__dictionary = json.load(dictionary_file)
		return self.__dictionary

	@property
	def words(self):
		if self.__words == None:
			self.__words = set(filter(lambda w: w not in EXCLUSIONS, self.__get_dictionary()["words"]))
		return self.__words

	@property
	def words_sorted_by_length_then_lex(self):
		if self.__words_sorted_by_length == None:
			self.__words_sorted_by_length = sorted(self.words, key=lambda word: (len(word), word))
		return self.__words_sorted_by_length

	@property
	def words_by_character_frequency(self):
		return self.__get_dictionary()["words_by_character_frequency"]


def get_current_dictionary():
	return CURRENT_DICTIONARY

CURRENT_DICTIONARY = Dictionary("Collins Scrabble Words (2015)")
#CURRENT_DICTIONARY = Dictionary("google-10000-english-usa")

EXCLUSIONS = set([
	"pa",
	"el",
	"ma",
	"mm",
	"ed",
	"un",
	"mi",
	"na",
	"os",
	"ex",
	"po",
	"di",
	"ar",
	"mo",
	"da",
	"em",
	"ne",
	"es",
	"aa",
	"ch",
	"op",
	"ab",
	"ha",
	"ea",
	"ky",
	"lo",
	"ut",
	"si",
	"ag",
	"ba",
	"ee",
	"er",
	"li",
	"ya",
	"te",
	"fe",
	"ah",
	"ja",
	"bi",
	"ta",
	"gi",
	"ho",
	"sh",
	"ae",
	"pi",
	"ai",
	"pe",
	"fy",
	"ef",
	"ti",
	"oo",
	"um",
	"ye",
	"yo",
	"fa",
	"jo",
	"oe",
	"ur",
	"nu",
	"ou",
	"xi",
	"za",
	"yu",
	"om",
	"ka",
	"eh",
	"uh",
	"bo",
	"io",
	"mu",
	"ko",
	"aw",
	"ob",
	"hm",
	"od",
	"ki",
	"ax",
	"ug",
	"gu",
	"ay",
	"wo",
	"oi",
	"ow",
	"ox",
	"xu",
	"qi",
	"oy",
	"zo",
])