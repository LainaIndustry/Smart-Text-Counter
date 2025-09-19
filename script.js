// Enhanced functionality for Word Counter

// DOM Elements
const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const sentenceCount = document.getElementById('sentence-count');
const paragraphCount = document.getElementById('paragraph-count');
const clearBtn = document.getElementById('clear-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const expandBtn = document.getElementById('expand-btn');

// Detail elements
const detailWords = document.getElementById('detail-words');
const detailChars = document.getElementById('detail-chars');
const detailSentences = document.getElementById('detail-sentences');
const detailParagraphs = document.getElementById('detail-paragraphs');
const readingLevel = document.getElementById('reading-level');
const readingTime = document.getElementById('reading-time');
const speakingTime = document.getElementById('speaking-time');
const keywordDensity = document.getElementById('keyword-density');
const readabilityScore = document.getElementById('readability-score');
const avgSentenceLength = document.getElementById('avg-sentence-length');
const contentType = document.getElementById('content-type');

// Text history for undo/redo
let textHistory = [''];
let historyIndex = 0;
let isExpanded = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    textInput.addEventListener('input', updateCounts);
    clearBtn.addEventListener('click', clearText);
    undoBtn.addEventListener('click', undoText);
    redoBtn.addEventListener('click', redoText);
    copyBtn.addEventListener('click', copyText);
    downloadBtn.addEventListener('click', downloadText);
    expandBtn.addEventListener('click', toggleExpand);
    
    // Initialize counts
    updateCounts();
    
    // Set up hamburger menu if it exists
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Set up contact form if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Add animation to stats on first load
    animateStats();
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
    
    // Update main counters with animation
    animateValue(wordCount, parseInt(wordCount.textContent) || 0, words, 500);
    animateValue(charCount, parseInt(charCount.textContent) || 0, characters, 500);
    animateValue(sentenceCount, parseInt(sentenceCount.textContent) || 0, sentences, 500);
    animateValue(paragraphCount, parseInt(paragraphCount.textContent) || 0, paragraphs, 500);
    
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
    
    // Calculate and update additional metrics
    updateAdditionalMetrics(text, words, sentences);
}

// Animate value changes
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats on first load
function animateStats() {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, index * 100);
    });
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

// Update additional metrics
function updateAdditionalMetrics(text, wordCount, sentenceCount) {
    // Calculate average sentence length
    const avgLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : '0';
    avgSentenceLength.textContent = avgLength;
    
    // Determine content type based on word count
    if (wordCount < 50) {
        contentType.textContent = 'social media';
    } else if (wordCount < 300) {
        contentType.textContent = 'short blog post';
    } else if (wordCount < 1000) {
        contentType.textContent = 'standard article';
    } else {
        contentType.textContent = 'long-form content';
    }
    
    // Calculate keyword density (simplified)
    if (wordCount > 0) {
        const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];
        const wordFreq = {};
        
        words.forEach(word => {
            if (word.length > 4) { // Only consider words longer than 4 characters
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        // Get top 3 keywords
        const topKeywords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([word, count]) => `${word} (${((count/wordCount)*100).toFixed(1)}%)`)
            .join(', ');
        
        keywordDensity.textContent = topKeywords || '-';
    } else {
        keywordDensity.textContent = '-';
    }
    
    // Set readability score based on sentence length and word count
    if (avgLength < 10) {
        readabilityScore.textContent = 'very easy';
    } else if (avgLength < 15) {
        readabilityScore.textContent = 'easy';
    } else if (avgLength < 20) {
        readabilityScore.textContent = 'fairly easy';
    } else if (avgLength < 25) {
        readabilityScore.textContent = 'standard';
    } else if (avgLength < 30) {
        readabilityScore.textContent = 'fairly difficult';
    } else {
        readabilityScore.textContent = 'difficult';
    }
}

// Clear text
function clearText() {
    textInput.value = '';
    updateCounts();
    
    // Show confirmation message
    showNotification('Text cleared successfully', 'success');
}

// Undo text change
function undoText() {
    if (historyIndex > 0) {
        historyIndex--;
        textInput.value = textHistory[historyIndex];
        updateCounts();
        
        // Show notification
        showNotification('Undo successful', 'info');
    }
}

// Redo text change
function redoText() {
    if (historyIndex < textHistory.length - 1) {
        historyIndex++;
        textInput.value = textHistory[historyIndex];
        updateCounts();
        
        // Show notification
        showNotification('Redo successful', 'info');
    }
}

// Copy text to clipboard
function copyText() {
    if (textInput.value) {
        textInput.select();
        document.execCommand('copy');
        
        // Show confirmation message
        showNotification('Text copied to clipboard', 'success');
    } else {
        showNotification('No text to copy', 'warning');
    }
}

// Download text as file
function downloadText() {
    if (textInput.value) {
        const blob = new Blob([textInput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = 'text-content.txt';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        // Show confirmation message
        showNotification('Text downloaded successfully', 'success');
    } else {
        showNotification('No text to download', 'warning');
    }
}

// Toggle expand editor
function toggleExpand() {
    const editor = document.querySelector('.editor-container');
    isExpanded = !isExpanded;
    
    if (isExpanded) {
        editor.classList.add('expanded');
        expandBtn.innerHTML = '<i class="fas fa-compress"></i>';
        expandBtn.title = 'Compress Editor';
    } else {
        editor.classList.remove('expanded');
        expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
        expandBtn.title = 'Expand Editor';
    }
}

// Update undo/redo buttons state
function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= textHistory.length - 1;
}

// Show notification
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add event listener to close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    e.target.reset();
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background-color: #28a745;
    }
    
    .notification.info {
        background-color: #17a2b8;
    }
    
    .notification.warning {
        background-color: #ffc107;
        color: #212529;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.2rem;
    }
    
    .editor-container.expanded {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background: white;
        padding: 20px;
    }
    
    .editor-container.expanded #text-input {
        min-height: calc(100vh - 150px);
    }
`;
document.head.appendChild(notificationStyles);
