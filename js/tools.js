// Shared utility functions for Smart Text Counter

// Text statistics utilities
const TextUtils = {
    // Count syllables in a word (approximation)
    countSyllables: function(word) {
        word = word.toLowerCase();
        
        if (word.length <= 3) return 1;
        
        // Exception words
        const exceptions = {
            'simile': 3,
            'forever': 3,
            'shoreline': 2
        };
        
        if (exceptions[word]) return exceptions[word];
        
        // Remove final 'e' except when preceded by 'l'
        let processedWord = word.replace(/(?:[^laeiouy]|^)e$/, '');
        
        // Count vowel groups
        const vowelGroups = processedWord.match(/[aeiouy]{1,2}/g);
        
        return vowelGroups ? Math.max(1, vowelGroups.length) : 1;
    },

    // Calculate Flesch Reading Ease score
    calculateReadingEase: function(text) {
        const words = text.match(/\b\w+\b/g) || [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const syllables = this.countTotalSyllables(text);
        
        if (words.length === 0 || sentences.length === 0) return 0;
        
        const avgSentenceLength = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        
        return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    },

    // Count total syllables in text
    countTotalSyllables: function(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let syllableCount = 0;
        
        words.forEach(word => {
            syllableCount += this.countSyllables(word);
        });
        
        return syllableCount;
    },

    // Get reading level based on Flesch score
    getReadingLevel: function(score) {
        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Difficult';
        if (score >= 30) return 'Difficult';
        return 'Very Difficult';
    },

    // Calculate speaking time
    calculateSpeakingTime: function(words, wordsPerMinute = 140) {
        return Math.ceil(words / wordsPerMinute);
    },

    // Calculate reading time
    calculateReadingTime: function(words, wordsPerMinute = 200) {
        return Math.ceil(words / wordsPerMinute);
    }
};

// Text cleaning utilities
const TextCleaner = {
    // Remove extra spaces
    removeExtraSpaces: function(text) {
        return text.replace(/\s+/g, ' ').trim();
    },

    // Remove line breaks
    removeLineBreaks: function(text) {
        return text.replace(/\n/g, ' ');
    },

    // Remove empty lines
    removeEmptyLines: function(text) {
        return text.replace(/^\s*[\r\n]/gm, '');
    },

    // Trim lines
    trimLines: function(text) {
        return text.split('\n').map(line => line.trim()).join('\n');
    },

    // Remove special characters
    removeSpecialCharacters: function(text) {
        return text.replace(/[^\w\s.,!?;:'"-]/g, '');
    },

    // Fix common encoding issues
    fixEncoding: function(text) {
        return text
            .replace(/â€œ|â€/g, '"')
            .replace(/â€˜|â€™/g, "'")
            .replace(/â€”|â€“/g, "-")
            .replace(/â€¦/g, "...")
            .replace(/Â°/g, "°")
            .replace(/Â±/g, "±")
            .replace(/Ã©/g, "é")
            .replace(/Ã¨/g, "è")
            .replace(/Ãª/g, "ê")
            .replace(/Ã±/g, "ñ")
            .replace(/Ã³/g, "ó")
            .replace(/Ãº/g, "ú")
            .replace(/Â£/g, "£")
            .replace(/Â¥/g, "¥")
            .replace(/Â¢/g, "¢")
            .replace(/Â©/g, "©")
            .replace(/Â®/g, "®")
            .replace(/Â§/g, "§")
            .replace(/Â¶/g, "¶");
    }
};

// Case conversion utilities
const CaseConverter = {
    toSentenceCase: function(text) {
        return text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
            return p1 + p2.toUpperCase();
        });
    },

    toLowerCase: function(text) {
        return text.toLowerCase();
    },

    toUpperCase: function(text) {
        return text.toUpperCase();
    },

    toTitleCase: function(text) {
        const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)$/i;
        return text.toLowerCase().replace(/([^\W_]+[^\s-]*)/g, (match, p1, index, title) => {
            if (index > 0 && index + p1.length !== title.length &&
                p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + p1.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return p1.toLowerCase();
            }
            return p1.charAt(0).toUpperCase() + p1.substr(1);
        });
    },

    toCamelCase: function(text) {
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    },

    toPascalCase: function(text) {
        const camel = this.toCamelCase(text);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    },

    toSnakeCase: function(text) {
        return text.toLowerCase().replace(/\s+/g, '_');
    },

    toKebabCase: function(text) {
        return text.toLowerCase().replace(/\s+/g, '-');
    }
};

// List sorting utilities
const ListSorter = {
    sortAlphabetically: function(items, order = 'asc', ignoreCase = true) {
        return [...items].sort((a, b) => {
            let compareA = a;
            let compareB = b;

            if (ignoreCase) {
                compareA = a.toLowerCase();
                compareB = b.toLowerCase();
            }

            if (compareA < compareB) return order === 'asc' ? -1 : 1;
            if (compareA > compareB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    },

    removeDuplicates: function(items, ignoreCase = true) {
        const uniqueItems = [];
        const seen = new Set();
        
        items.forEach(item => {
            const key = ignoreCase ? item.toLowerCase() : item;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueItems.push(item);
            }
        });
        
        return uniqueItems;
    }
};

// Word generator database
const WordDatabase = {
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
