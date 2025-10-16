// Text Cleaner specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');
    const cleanBtn = document.getElementById('clean-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    // Cleaning option checkboxes
    const removeExtraSpaces = document.getElementById('remove-extra-spaces');
    const removeLineBreaks = document.getElementById('remove-line-breaks');
    const removeEmptyLines = document.getElementById('remove-empty-lines');
    const trimLines = document.getElementById('trim-lines');
    const removeSpecialChars = document.getElementById('remove-special-chars');
    const fixEncoding = document.getElementById('fix-encoding');

    cleanBtn.addEventListener('click', cleanText);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyText);

    function cleanText() {
        let text = textInput.value;

        if (!text.trim()) {
            textOutput.value = '';
            return;
        }

        // Apply cleaning operations based on selected options
        if (removeExtraSpaces.checked) {
            text = text.replace(/\s+/g, ' ');
        }

        if (removeLineBreaks.checked) {
            text = text.replace(/\n/g, ' ');
        }

        if (removeEmptyLines.checked) {
            text = text.replace(/^\s*[\r\n]/gm, '');
        }

        if (trimLines.checked) {
            text = text.split('\n').map(line => line.trim()).join('\n');
        }

        if (removeSpecialChars.checked) {
            text = text.replace(/[^\w\s.,!?;:'"-]/g, '');
        }

        if (fixEncoding.checked) {
            text = text
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

        // Final trim
        text = text.trim();

        textOutput.value = text;
    }

    function clearAll() {
        textInput.value = '';
        textOutput.value = '';
        textInput.focus();
    }

    function copyText() {
        textOutput.select();
        textOutput.setSelectionRange(0, 99999);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Cleaned Text';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
});
