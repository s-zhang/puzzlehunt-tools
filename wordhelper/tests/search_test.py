from search import search

def test_search():
	assert "test" in search("^t.st$")