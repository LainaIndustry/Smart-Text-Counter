// Random Word Generator specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const textOutput = document.getElementById('text-output');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const wordCountInput = document.getElementById('word-count');
    const wordLengthSelect = document.getElementById('word-length');
    const wordTypeSelect = document.getElementById('word-type');
    const uniqueWordsCheckbox = document.getElementById('unique-words');
    const customLengthDiv = document.querySelector('.custom-length');
    const minLengthInput = document.getElementById('min-length');
    const maxLengthInput = document.getElementById('max-length');

    // Word databases by type
    const wordDatabase = {
        nouns: [
            'apple', 'book', 'car', 'dog', 'house', 'tree', 'water', 'friend', 'city', 'school',
            'computer', 'phone', 'music', 'art', 'love', 'time', 'work', 'family', 'world', 'life',
            'sun', 'moon', 'star', 'ocean', 'mountain', 'river', 'flower', 'bird', 'cat', 'child'
        ],
        verbs: [
            'run', 'walk', 'talk', 'think', 'create', 'build', 'learn', 'teach', 'write', 'read',
            'sing', 'dance', 'play', 'work', 'help', 'love', 'grow', 'change', 'discover', 'explore'
        ],
        adjectives: [
            'happy', 'sad', 'beautiful', 'ugly', 'big', 'small', 'fast', 'slow', 'smart', 'dumb',
            'strong', 'weak', 'bright', 'dark', 'hot', 'cold', 'new', 'old', 'young', 'ancient'
        ],
        adverbs: [
            'quickly', 'slowly', 'happily', 'sadly', 'loudly', 'quietly', 'carefully', 'carelessly',
            'beautifully', 'brightly', 'strongly', 'weakly', 'easily', 'always', 'never', 'often'
        ]
    };

    // Show/hide custom length options
    wordLengthSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customLengthDiv.style.display = 'block';
        } else {
            customLengthDiv.style.display = 'none';
        }
    });

    generateBtn.addEventListener('click', generateWords);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);

    function generateWords() {
        const wordCount = parseInt(wordCountInput.value);
        const wordType = wordTypeSelect.value;
        const uniqueOnly = uniqueWordsCheckbox.checked;
        
        let wordPool = [];

        // Select appropriate word pool
        if (wordType === 'any') {
            Object.values(wordDatabase).forEach(words => {
                wordPool.push(...words);
            });
        } else if (wordType === 'all') {
            Object.values(wordDatabase).forEach(words => {
                wordPool.push(...words);
            });
            wordPool.push(...['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had']);
        } else {
            wordPool = [...wordDatabase[wordType]];
        }

        // Filter by length if needed
        const lengthFilter = getLengthFilter();
        if (lengthFilter) {
            wordPool = wordPool.filter(word => lengthFilter(word.length));
        }

        if (wordPool.length === 0) {
            textOutput.value = 'No words match your criteria. Please try different settings.';
            return;
        }

        // Generate words
        const generatedWords = [];
        const usedWords = new Set();

        for (let i = 0; i < wordCount; i++) {
            if (uniqueOnly && usedWords.size >= wordPool.length) {
                break;
            }

            let randomWord;
            do {
                const randomIndex = Math.floor(Math.random() * wordPool.length);
                randomWord = wordPool[randomIndex];
            } while (uniqueOnly && usedWords.has(randomWord));

            if (uniqueOnly) {
                usedWords.add(randomWord);
            }
            generatedWords.push(randomWord);
        }

        textOutput.value = generatedWords.join(', ');
    }

    function getLengthFilter() {
        const lengthType = wordLengthSelect.value;
        
        switch (lengthType) {
            case 'short':
                return len => len >= 3 && len <= 5;
            case 'medium':
                return len => len >= 6 && len <= 8;
            case 'long':
                return len => len >= 9;
            case 'custom':
                const min = parseInt(minLengthInput.value);
                const max = parseInt(maxLengthInput.value);
                return len => len >= min && len <= max;
            default:
                return null;
        }
    }

    function clearText() {
        textOutput.value = '';
    }

    function copyText() {
        textOutput.select();
        textOutput.setSelectionRange(0, 99999);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Words';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    // Generate initial words
    generateWords();
});
