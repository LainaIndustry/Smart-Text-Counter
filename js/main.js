// Main JavaScript for Smart Text Counter
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const charNoSpacesCount = document.getElementById('char-no-spaces-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const uniqueWords = document.getElementById('unique-words');
    const avgWordLength = document.getElementById('avg-word-length');
    const avgSentenceLength = document.getElementById('avg-sentence-length');
    const longestWord = document.getElementById('longest-word');
    const readingLevel = document.getElementById('reading-level');
    const speakingTime = document.getElementById('speaking-time');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    // Initial update
    updateStats();

    // Event listeners
    textInput.addEventListener('input', updateStats);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);

    // Update all statistics
    function updateStats() {
        const text = textInput.value;
        
        // Basic counts
        const words = countWords(text);
        const characters = countCharacters(text);
        const charactersNoSpaces = countCharactersNoSpaces(text);
        const sentences = countSentences(text);
        const paragraphs = countParagraphs(text);
        
        // Update basic stats
        wordCount.textContent = words;
        charCount.textContent = characters;
        charNoSpacesCount.textContent = charactersNoSpaces;
        sentenceCount.textContent = sentences;
        paragraphCount.textContent = paragraphs;
        
        // Calculate reading and speaking time
        const readTime = calculateReadingTime(words);
        const speakTime = calculateSpeakingTime(words);
        readingTime.textContent = `${readTime} min`;
        speakingTime.textContent = `${speakTime} min`;
        
        // Update detailed stats
        updateDetailedStats(text, words, sentences);
    }

    // Count words
    function countWords(text) {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    }

    // Count characters
    function countCharacters(text) {
        return text.length;
    }

    // Count characters without spaces
    function countCharactersNoSpaces(text) {
        return text.replace(/\s/g, '').length;
    }

    // Count sentences
    function countSentences(text) {
        if (!text.trim()) return 0;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return sentences.length;
    }

    // Count paragraphs
    function countParagraphs(text) {
        if (!text.trim()) return 0;
        return text.split(/\n+/).filter(p => p.trim().length > 0).length;
    }

    // Calculate reading time (average reading speed: 200-250 words per minute)
    function calculateReadingTime(words) {
        const wordsPerMinute = 200;
        return Math.ceil(words / wordsPerMinute);
    }

    // Calculate speaking time (average speaking speed: 130-150 words per minute)
    function calculateSpeakingTime(words) {
        const wordsPerMinute = 140;
        return Math.ceil(words / wordsPerMinute);
    }

    // Update detailed statistics
    function updateDetailedStats(text, wordCount, sentenceCount) {
        if (!text.trim()) {
            uniqueWords.textContent = '0';
            avgWordLength.textContent = '0';
            avgSentenceLength.textContent = '0';
            longestWord.textContent = '-';
            readingLevel.textContent = '-';
            return;
        }

        // Unique words
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWordSet = new Set(words);
        uniqueWords.textContent = uniqueWordSet.size;

        // Average word length
        const totalChars = words.reduce((sum, word) => sum + word.length, 0);
        avgWordLength.textContent = (totalChars / words.length).toFixed(1);

        // Average sentence length
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
        avgSentenceLength.textContent = avgSentence.toFixed(1);

        // Longest word
        const longest = words.reduce((longest, word) => 
            word.length > longest.length ? word : longest, '');
        longestWord.textContent = longest || '-';

        // Reading level (Flesch Reading Ease approximation)
        const readingEase = calculateReadingEase(text);
        readingLevel.textContent = getReadingLevel(readingEase);
    }

    // Calculate Flesch Reading Ease score
    function calculateReadingEase(text) {
        const words = text.match(/\b\w+\b/g) || [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const syllables = countSyllables(text);
        
        if (words.length === 0 || sentences.length === 0) return 0;
        
        const avgSentenceLength = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        
        return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    }

    // Count syllables in text (approximation)
    function countSyllables(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let syllableCount = 0;
        
        words.forEach(word => {
            syllableCount += countWordSyllables(word);
        });
        
        return syllableCount;
    }

    // Count syllables in a single word (approximation)
    function countWordSyllables(word) {
        word = word.toLowerCase();
        
        if (word.length <= 3) return 1;
        
        let processedWord = word.replace(/(?:[^laeiouy]|^)e$/, '');
        
        const vowelGroups = processedWord.match(/[aeiouy]{1,2}/g);
        
        return vowelGroups ? Math.max(1, vowelGroups.length) : 1;
    }

    // Get reading level based on Flesch score
    function getReadingLevel(score) {
        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Difficult';
        if (score >= 30) return 'Difficult';
        return 'Very Difficult';
    }

    // Clear text area
    function clearText() {
        textInput.value = '';
        updateStats();
        textInput.focus();
    }

    // Copy text to clipboard
    function copyText() {
        textInput.select();
        textInput.setSelectionRange(0, 99999);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Text';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
});
