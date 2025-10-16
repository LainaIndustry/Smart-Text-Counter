// Character Counter specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const charNoSpacesCount = document.getElementById('char-no-spaces-count');
    const wordCount = document.getElementById('word-count');
    const lineCount = document.getElementById('line-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    // Initial update
    updateStats();

    // Event listeners
    textInput.addEventListener('input', updateStats);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);

    function updateStats() {
        const text = textInput.value;
        
        // Character counts
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        
        // Word count
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        // Line count
        const lines = text ? text.split('\n').length : 0;
        
        // Paragraph count
        const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
        
        // Update displays
        charCount.textContent = characters;
        charNoSpacesCount.textContent = charactersNoSpaces;
        wordCount.textContent = words;
        lineCount.textContent = lines;
        paragraphCount.textContent = paragraphs;
    }

    function clearText() {
        textInput.value = '';
        updateStats();
        textInput.focus();
    }

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
