import re
import requests
import urllib.parse
from bs4 import BeautifulSoup

def crossword_clue_multi(clues, solver = "wordplays"):
    """
        A tool to solve multiple crossword clues. This tool makes requests to online crossword solvers: wordplays or dictionary.
        Examples:
        >>> crossword_clue_multi([['largest sea creature'], ['the great white north']])
        [['WHALE', 'PACIFIC OCEAN', 'STARFISH', 'SQUID', 'ORCA'], ['CANADA', 'DOUG', 'HOSER', 'JAMESEARLJONES', 'ELEANOR']]
        >>> crossword_clue_multi([['largest sea creature'], ['the great white north', '......']])
        [['WHALE', 'PACIFIC OCEAN', 'STARFISH', 'SQUID', 'ORCA'], ['CANADA', 'NORMAN', 'SHARKS', 'LATEST', 'ISALIE']]
        >>> crossword_clue_multi([['largest sea creature', 'W.A.E'], ['the great white north', '...ADA']])
        [['WHALE'], ['CANADA', 'MASADA']]
        >>> crossword_clue_multi([['largest sea creature'], ['the great white north']], solver = 'dictionary')
        [['ORCA', 'ASIA', 'ARAL', 'EEL', 'ERNE'], ['CANADA', 'SEA', 'ELM', 'FEAR', 'ELK']]
    """
    results = []
    for clue in clues:
        pattern = clue[1] if len(clue) > 1 else ''
        results.append(crossword_clue(clue[0], pattern, solver))
    return results

def crossword_clue(clue, pattern = '', solver = 'wordplays'):
    """
        A tool to solve a crossword clue. This tool makes requests to online crossword solvers: wordplays or dictionary.
        Examples:
        >>> crossword_clue('largest sea creature')
        ['WHALE', 'PACIFIC OCEAN', 'STARFISH', 'SQUID', 'ORCA']
        >>> crossword_clue('largest sea creature', '.....')
        ['WHALE', 'SQUID', 'POLYP', 'SALPA', 'WHELK']
        >>> crossword_clue('largest sea creature', 'W?A?E')
        ['WHALE']
        >>> crossword_clue('largest sea creature', solver = 'dictionary')
        ['ORCA', 'ASIA', 'ARAL', 'EEL', 'ERNE']
    """
    pattern.replace('.', '?')

    if (solver == 'wordplays'):
        return crossword_clue_wordplays(clue, pattern)
    elif (solver == 'dictionary'):
        return crossword_clue_dictionary(clue, pattern)
    else:
        raise ValueError('Invalid crossword clue solver')

def crossword_clue_wordplays(clue, pattern = ''):
    html = crossword_clue_wordplays_request(clue, pattern)
    return crossword_clue_wordplays_extract(html)

def crossword_clue_wordplays_request(clue, pattern = ''):
    encoded_clue = urllib.parse.quote_plus(clue)
    encoded_pattern = urllib.parse.quote_plus(pattern)

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'PostmanRuntime/7.1.5'
    }
    data = f'clue={encoded_clue}&pattern={encoded_pattern}&phrase={encoded_clue}&anagram-patt={encoded_pattern}&anagram-len=&roman-num=&vand=1&rejected=&cks=&ishm=&mvr=&ty=0'
    response = requests.post('https://www.wordplays.com/crossword-solver/', data = data, headers = headers)
    if response.status_code < 200 or response.status_code >= 300:
        raise Exception(f"Unexpected status code was returned, {response.status_code}.")
    
    return response.text

def crossword_clue_wordplays_extract(html):
    soup = BeautifulSoup(html, 'html.parser')
    resultElements = soup.find_all('a', { 'href': re.compile('^/crossword-clues/') })

    results = []
    for resultElement in resultElements:
        results.append(resultElement.text.strip())

    return results

def crossword_clue_dictionary(clue, pattern = ''):
    html = crossword_clue_dictionary_request(clue, pattern)
    return crossword_clue_dictionary_extract(html)

def crossword_clue_dictionary_request(clue, pattern = ''):
    encoded_clue = urllib.parse.quote_plus(clue)
    encoded_pattern = urllib.parse.quote_plus(pattern)
    pattern_length = len(pattern)
    if pattern_length == 0:
        pattern_length = 'any'

    response = requests.get(f'http://www.dictionary.com/fun/crosswordsolver?query={encoded_clue}&pattern={encoded_pattern}&l={pattern_length}')
    if response.status_code < 200 or response.status_code >= 300:
        raise Exception(f"Unexpected status code was returned, {response.status_code}.")
    
    return response.text

def crossword_clue_dictionary_extract(html):
    soup = BeautifulSoup(html, 'html.parser')
    resultElements = soup.find_all('div', { 'class': 'matching-answer' })

    results = []
    for resultElement in resultElements[1:]:
        results.append(resultElement.text.strip())

    return results