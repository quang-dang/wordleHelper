
export class Trie {
    constructor(name, year) {
      this.root = {};
    }

    add(word){
        if (word.length === 0) {
            return;
        }
        let node = this.root;
        for (let i = 0; i <  word.length; i++){
            if (!(word[i] in node)) {
                node[word[i]] = {};
            }
            node = node[word[i]];
        }
        node["*"] = word;
        return;
    }  

    findAllWords(bannedLetters, fixedLetters, loseLetters, requiredLetters){
        function dfs(index, node, requiredLetters) {
            if (index === 5) {
              if (requiredLetters.length === 0 && "*" in node) {
                return [node["*"]];
              }
              return [];
            }
            let ans = [];
            for (const [char, childNode] of Object.entries(node)) {
                if (index in fixedLetters) {
                    if (char === fixedLetters[index]) {
                        return dfs(index+1, childNode, requiredLetters.replace(char, ""));
                    }
                } else if (!(char in bannedLetters) && (!(index in loseLetters) || !(char in loseLetters[index]))) {
                    ans = ans.concat(dfs(index+1, childNode, requiredLetters.replace(char, "")));
                }
            }
            return ans;
        }
        return dfs(0, this.root, requiredLetters);
    }
}