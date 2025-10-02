class SmartTextCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.sentenceCount = document.getElementById('sentenceCount');
        this.paragraphCount = document.getElementById('paragraphCount');
        this.charNoSpaces = document.getElementById('charNoSpaces');
        this.readingTime = document.getElementById('readingTime');
        this.speakingTime = document.getElementById('speakingTime');
        this.longestWord = document.getElementById('longestWord');
        this.keywordDensity = document.getElementById('keywordDensity');
        
        this.init();
    }

    init() {
        this.textInput.addEventListener('input', () => this.updateCounts());
        this.setupSampleText();
    }

    updateCounts() {
        const text = this.textInput.value;
        
        // Basic counts
        const words = this.countWords(text);
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const sentences = this.countSentences(text);
        const paragraphs = this.countParagraphs(text);
        
        // Update DOM
        this.wordCount.textContent = words;
        this.charCount.textContent = characters;
        this.sentenceCount.textContent = sentences;
        this.paragraphCount.textContent = paragraphs;
        this.charNoSpaces.textContent = charactersNoSpaces;
        
        // Advanced metrics
        this.updateAdvancedMetrics(text, words);
        this.updateKeywordDensity(text);
    }

    countWords(text) {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    }

    countSentences(text) {
        if (!text.trim()) return 0;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return sentences.length;
    }

    countParagraphs(text) {
        if (!text.trim()) return 0;
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        return paragraphs.length;
    }

    updateAdvancedMetrics(text, wordCount) {
        // Reading time (average 200 words per minute)
        const readingTimeMinutes = Math.ceil(wordCount / 200);
        this.readingTime.textContent = `${readingTimeMinutes} min`;
        
        // Speaking time (average 150 words per minute)
        const speakingTimeMinutes = Math.ceil(wordCount / 150);
        this.speakingTime.textContent = `${speakingTimeMinutes} min`;
        
        // Longest word
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const longest = words.reduce((longest, word) => 
            word.length > longest.length ? word : longest, '');
        this.longestWord.textContent = longest || '-';
    }

    updateKeywordDensity(text) {
        if (!text.trim()) {
            this.keywordDensity.innerHTML = '<p>Start typing to see keyword analysis...</p>';
            return;
        }

        // Remove common stop words and get word frequencies
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
        
        const wordFreq = {};
        words.forEach(word => {
            if (!stopWords.has(word) && word.length > 2) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        // Convert to array and sort by frequency
        const sortedWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        // Update DOM
        if (sortedWords.length === 0) {
            this.keywordDensity.innerHTML = '<p>No significant keywords found.</p>';
        } else {
            this.keywordDensity.innerHTML = sortedWords.map(([word, count]) => 
                `<span class="keyword-tag">${word} (${count})</span>`
            ).join('');
        }
    }

    setupSampleText() {
        document.getElementById('sampleBtn').addEventListener('click', () => {
            const sampleText = `This is a sample text for testing the Smart Text Counter tool. 
You can see how it analyzes different aspects of your writing.

The tool counts words, characters, sentences, and paragraphs. It also provides advanced metrics like reading time and keyword density.

Try pasting your own text to see the analysis in action!`;
            
            this.textInput.value = sampleText;
            this.updateCounts();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.textInput.value = '';
            this.updateCounts();
        });

        document.getElementById('pasteBtn').addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                this.textInput.value = text;
                this.updateCounts();
            } catch (err) {
                alert('Unable to paste from clipboard. Please paste manually (Ctrl+V).');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartTextCounter();
});
