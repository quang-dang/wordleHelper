import csv
from flask import current_app, render_template
from app import app

class Trie:
    def __init__(self):
        self.root = {}
    
    def add(self, word):
        if not word:
            return
        node = self.root
        for c in word:
            if c not in node:
                node[c] = {}
            node = node[c]
        node["*"] = word
trie = Trie()
@app.route('/')
@app.route('/index')
def index():
    words = []
    with current_app.open_resource('static/data.csv', "r") as f:
        csv_reader = csv.reader(f, delimiter=',')
        for row in csv_reader:
            for word in row:
                words.append(word)
                trie.add(word)
    user = {'username': 'Miguel'}
    posts = [
        {
            'author': {'username': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('index.html', title='Home', user=user, posts=posts, words = words)