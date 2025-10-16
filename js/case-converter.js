// Case Converter specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const caseButtons = document.querySelectorAll('.case-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    
    let currentCase = 'sentence';
    
    // Case conversion functions
    const caseConverters = {
        sentence: (text) => {
            return text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
                return p1 + p2.toUpperCase();
            });
        },
        lower: (text) => text.toLowerCase(),
        upper: (text) => text.toUpperCase(),
        title: (text) => {
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
        camel: (text) => {
            return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
        },
        pascal: (text) => {
            const camel = caseConverters.camel(text);
            return camel.charAt(0).toUpperCase() + camel.slice(1);
        },
        snake: (text) => {
            return text.toLowerCase().replace(/\s+/g, '_');
        },
        kebab: (text) => {
            return text.toLowerCase().replace(/\s+/g, '-');
        }
    };
    
    // Event listeners
    caseButtons.forEach(button => {
        button.addEventListener('click', function() {
            caseButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCase = this.getAttribute('data-case');
            convertCase();
        });
    });
    
    textInput.addEventListener('input', convertCase);
    clearBtn.addEventListener('click', clearText);
    copyBtn.addEventListener('click', copyText);
    
    function convertCase() {
        const text = textInput.value;
        if (text && caseConverters[currentCase]) {
            textInput.value = caseConverters[currentCase](text);
        }
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
