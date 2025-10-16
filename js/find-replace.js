// Find and Replace specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const textOutput = document.getElementById('text-output');
    const findText = document.getElementById('find-text');
    const replaceText = document.getElementById('replace-text');
    const replaceBtn = document.getElementById('replace-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const replacementsCount = document.getElementById('replacements-count');
    const caseSensitive = document.getElementById('case-sensitive');
    const wholeWord = document.getElementById('whole-word');
    const useRegex = document.getElementById('use-regex');

    replaceBtn.addEventListener('click', performReplace);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyText);

    function performReplace() {
        const find = findText.value;
        const replace = replaceText.value;
        let text = textInput.value;

        if (!find) {
            textOutput.value = text;
            replacementsCount.textContent = '0 replacements made';
            return;
        }

        if (!text) {
            textOutput.value = '';
            replacementsCount.textContent = '0 replacements made';
            return;
        }

        let searchText = find;
        let flags = 'g';

        if (!caseSensitive.checked) {
            flags += 'i';
        }

        if (wholeWord.checked && !useRegex.checked) {
            searchText = `\\b${escapeRegex(find)}\\b`;
        }

        if (useRegex.checked) {
            try {
                const regex = new RegExp(searchText, flags);
                const result = text.replace(regex, replace);
                const matches = (text.match(regex) || []).length;
                
                textOutput.value = result;
                replacementsCount.textContent = `${matches} replacement${matches !== 1 ? 's' : ''} made`;
            } catch (error) {
                textOutput.value = `Error in regular expression: ${error.message}`;
                replacementsCount.textContent = '0 replacements made';
            }
        } else {
            const regex = new RegExp(searchText, flags);
            const result = text.replace(regex, replace);
            const matches = (text.match(regex) || []).length;
            
            textOutput.value = result;
            replacementsCount.textContent = `${matches} replacement${matches !== 1 ? 's' : ''} made`;
        }
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function clearAll() {
        textInput.value = '';
        textOutput.value = '';
        findText.value = '';
        replaceText.value = '';
        replacementsCount.textContent = '0 replacements made';
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
                    copyBtn.textContent = 'Copy Result';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
});
