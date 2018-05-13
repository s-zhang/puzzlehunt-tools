import requests
import urllib.parse
from bs4 import BeautifulSoup

def crossword_clue(clue, pattern):
    encoded_clue = urllib.parse.quote_plus(clue)
    encoded_pattern = urllib.parse.quote_plus(pattern)
    pattern_length = len(pattern)

    response = requests.get(f'http://www.dictionary.com/fun/crosswordsolver?query={encoded_clue}&pattern={encoded_pattern}&l={pattern_length}')
    soup = BeautifulSoup(response.text, 'html.parser')
    resultElements = soup.find_all("div", {'class': 'matching-answer'})
    results = []
    for resultElement in resultElements[1:]:
        results.append(resultElement.text.strip())
    return results