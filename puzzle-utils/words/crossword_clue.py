import re
import requests
import urllib.parse
from bs4 import BeautifulSoup

class CrosswordClueResult:
    def __init__(self, answer, ranking):
        self.answer = answer
        self.ranking = ranking

def crossword_clue(clue, pattern = '', solver = 'wordplays'):
    """
        A tool to solve a crossword clue. This tool can make requests to online crossword solvers: wordplays.com (wordplays) or dictionary.com (dictionary).
        Examples:
        >>> crossword_clue('largest sea creature')
        ['WHALE', 'PACIFIC OCEAN', 'STARFISH', 'SQUID', 'ORCA']
        >>> crossword_clue('largest sea creature', '?????')
        ['WHALE', 'SQUID', 'POLYP', 'SALPA', 'WHELK']
        >>> crossword_clue('largest sea creature', 'W?A?E')
        ['WHALE']
        >>> crossword_clue('largest sea creature', solver = 'dictionary')
        ['ORCA', 'ASIA', 'ARAL', 'EEL', 'ERNE']
    """
    if (solver == 'wordplays'):
        results = crossword_clue_wordplays(clue, pattern)
    elif (solver == 'dictionary'):
        results = crossword_clue_dictionary(clue, pattern)
    else:
        raise ValueError('Invalid crossword clue solver')
    
    return [result.answer for result in results]

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
    resultsTableElement = soup.find('table', id='wordlists')
    resultsTableBodyElement = resultsTableElement.find('tbody')
    resultElements = resultsTableBodyElement.find_all('tr')

    results = []
    for resultElement in resultElements[1:]:
        resultColumnElements = list(resultElement.children)
        ranking = len(resultColumnElements[0].find('div', { 'class': 'stars' }).find_all('div')) / 5
        answer = resultColumnElements[1].text.strip()
        results.append(CrosswordClueResult(answer, ranking))

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
    resultElements = soup.find_all('div', { 'class': 'result-row' })

    results = []
    for resultElement in resultElements[1:]:
        resultColumnElements = resultElement.find_all('div')
        ranking = int(resultColumnElements[0].text.strip().strip('%')) / 100
        answer = resultColumnElements[1].text.strip()
        results.append(CrosswordClueResult(answer, ranking))

    return results

def crossword_clue_multi(clues, patterns = [], solver = "wordplays"):
    """
        A tool to solve multiple crossword clues. This tool can make requests to online crossword solvers: wordplays.com (wordplays) or dictionary.com (dictionary).
        Examples:
        >>> crossword_clue_multi(['largest sea creature', 'the great white north'])
        [['WHALE', 'PACIFIC OCEAN', 'STARFISH', 'SQUID', 'ORCA'], ['CANADA', 'DOUG', 'HOSER', 'JAMESEARLJONES', 'ELEANOR']]
        >>> crossword_clue_multi(['largest sea creature', 'the great white north'], ['', '??????'])
        [['WHALE', 'PACIFIC OCEAN', 'STARFISH', 'SQUID', 'ORCA'], ['CANADA', 'NORMAN', 'SHARKS', 'LATEST', 'ISALIE']]
        >>> crossword_clue_multi(['largest sea creature', 'the great white north'], ['W?A?E', '???ADA'])
        [['WHALE'], ['CANADA', 'MASADA']]
        >>> crossword_clue_multi(['largest sea creature', 'the great white north'], solver = 'dictionary')
        [['ORCA', 'ASIA', 'ARAL', 'EEL', 'ERNE'], ['CANADA', 'SEA', 'ELM', 'FEAR', 'ELK']]
    """
    results = []
    if len(patterns) == 0:
        for i in range(len(clues)):
            results.append(crossword_clue(clues[i], solver = solver))
    elif len(clues) == len(patterns):
        for i in range(len(clues)):
            results.append(crossword_clue(clues[i], patterns[i], solver = solver))
    else:
        print('Mismatched number of clues and patterns')
    return results