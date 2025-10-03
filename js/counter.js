// js/counter.js

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');

    // Initialize counts
    updateCounts();

    // Event listeners
    textInput.addEventListener('input', updateCounts);
    
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        updateCounts();
        textInput.focus();
    });
    
    pasteBtn.addEventListener('click', function() {
        navigator.clipboard.readText()
            .then(text => {
                textInput.value = text;
                updateCounts();
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
                alert('Unable to paste from clipboard. Please paste manually (Ctrl+V).');
            });
    });

    // Function to update all counts
    function updateCounts() {
        const text = textInput.value;
        
        // Character count (including spaces)
        charCount.textContent = text.length;
        
        // Word count
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        wordCount.textContent = words.length;
        
        // Sentence count
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentenceCount.textContent = sentences.length;
        
        // Paragraph count
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        paragraphCount.textContent = paragraphs.length;
    }
});
