// Alphabetize List specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const sortBtn = document.getElementById('sort-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const sortOrderRadios = document.querySelectorAll('input[name="sort-order"]');
    const ignoreCaseCheckbox = document.getElementById('ignore-case');
    const removeDuplicatesCheckbox = document.getElementById('remove-duplicates');

    sortBtn.addEventListener('click', sortList);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);

    function sortList() {
        const text = textInput.value;
        if (!text.trim()) return;

        const lines = text.split('\n').filter(line => line.trim());
        const sortOrder = document.querySelector('input[name="sort-order"]:checked').value;
        const ignoreCase = ignoreCaseCheckbox.checked;
        const removeDuplicates = removeDuplicatesCheckbox.checked;

        let sortedLines = [...lines];

        // Remove duplicates if enabled
        if (removeDuplicates) {
            const uniqueLines = [];
            const seen = new Set();
            
            sortedLines.forEach(line => {
                const key = ignoreCase ? line.toLowerCase() : line;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueLines.push(line);
                }
            });
            
            sortedLines = uniqueLines;
        }

        // Sort the list
        sortedLines.sort((a, b) => {
            let compareA = a;
            let compareB = b;

            if (ignoreCase) {
                compareA = a.toLowerCase();
                compareB = b.toLowerCase();
            }

            if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        textInput.value = sortedLines.join('\n');
    }

    function clearText() {
        textInput.value = '';
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
