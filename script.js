// DOM Elements
const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const sentenceCount = document.getElementById('sentence-count');
const paragraphCount = document.getElementById('paragraph-count');
const clearBtn = document.getElementById('clear-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');

// Detail elements
const detailWords = document.getElementById('detail-words');
const detailChars = document.getElementById('detail-chars');
const detailSentences = document.getElementById('detail-sentences');
const detailParagraphs = document.getElementById('detail-paragraphs');
const readingLevel = document.getElementById('reading-level');
const readingTime = document.getElementById('reading-time');
const speakingTime = document.getElementById('speaking-time');

// Text history for undo/redo
let textHistory = [''];
let historyIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    textInput.addEventListener('input', updateCounts);
    clearBtn.addEventListener('click', clearText);
    undoBtn.addEventListener('click', undoText);
    redoBtn.addEventListener('click', redoText);
    
    // Initialize counts
    updateCounts();
    
    // Set up hamburger menu if it exists
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Set up contact form if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Update all counts and details
function updateCounts() {
    const text = textInput.value;
    
    // Update history
    if (text !== textHistory[historyIndex]) {
        textHistory = textHistory.slice(0, historyIndex + 1);
        textHistory.push(text);
        historyIndex++;
        updateUndoRedoButtons();
    }
    
    // Calculate counts
    const words = countWords(text);
    const characters = countCharacters(text);
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    
    // Update main counters
    wordCount.textContent = words;
    charCount.textContent = characters;
    sentenceCount.textContent = sentences;
    paragraphCount.textContent = paragraphs;
    
    // Update details
    detailWords.textContent = words;
    detailChars.textContent = characters;
    detailSentences.textContent = sentences;
    detailParagraphs.textContent = paragraphs;
    
    // Calculate and update reading level
    const level = calculateReadingLevel(text, words, sentences);
    readingLevel.textContent = level;
    
    // Calculate and update times
    readingTime.textContent = calculateReadingTime(words);
    speakingTime.textContent = calculateSpeakingTime(words);
}

// Count words
function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

// Count characters (including spaces)
function countCharacters(text) {
    return text.length;
}

// Count sentences
function countSentences(text) {
    if (!text.trim()) return 0;
    // Split by common sentence terminators
    const sentences = text.split(/[.!?]+/);
    // Filter out empty strings
    return sentences.filter(sentence => sentence.trim().length > 0).length;
}

// Count paragraphs
function countParagraphs(text) {
    if (!text.trim()) return 0;
    // Split by new lines and filter out empty lines
    return text.split(/\n/).filter(para => para.trim().length > 0).length;
}

// Calculate reading level using Flesch-Kincaid grade level approximation
function calculateReadingLevel(text, wordCount, sentenceCount) {
    if (wordCount === 0 || sentenceCount === 0) return '-';
    
    // Count syllables (approximation)
    let syllableCount = 0;
    const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    
    words.forEach(word => {
        // Simple syllable counting heuristic
        syllableCount += word
            .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
            .replace(/^y/, '')
            .match(/[aeiouy]{1,2}/g)?.length || 1;
    });
    
    // Flesch-Kincaid grade level formula
    const gradeLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
    
    // Round and return appropriate level
    const roundedLevel = Math.round(gradeLevel);
    
    if (roundedLevel <= 6) return 'Elementary School';
    if (roundedLevel <= 8) return 'Middle School';
    if (roundedLevel <= 12) return 'High School';
    if (roundedLevel <= 16) return 'College';
    return 'Graduate';
}

// Calculate reading time (average reading speed: 225 words per minute)
function calculateReadingTime(wordCount) {
    if (wordCount === 0) return '0s';
    
    const minutes = Math.floor(wordCount / 225);
    const seconds = Math.round((wordCount % 225) / (225 / 60));
    
    if (minutes === 0) return `${seconds}s`;
    if (seconds === 0) return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
}

// Calculate speaking time (average speaking speed: 150 words per minute)
function calculateSpeakingTime(wordCount) {
    if (wordCount === 0) return '0s';
    
    const minutes = Math.floor(wordCount / 150);
    const seconds = Math.round((wordCount % 150) / (150 / 60));
    
    if (minutes === 0) return `${seconds}s`;
    if (seconds === 0) return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
}

// Clear text
function clearText() {
    textInput.value = '';
    updateCounts();
}

// Undo text change
function undoText() {
    if (historyIndex > 0) {
        historyIndex--;
        textInput.value = textHistory[historyIndex];
        updateCounts();
    }
}

// Redo text change
function redoText() {
    if (historyIndex < textHistory.length - 1) {
        historyIndex++;
        textInput.value = textHistory[historyIndex];
        updateCounts();
    }
}

// Update undo/redo buttons state
function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= textHistory.length - 1;
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}
