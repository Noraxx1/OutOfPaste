// Global Variables
let editor, select, statsEl;
let initEditor = true;
const byId = (id) => document.getElementById(id);
let MinChar;
// Helper Functions
/**
 * Displays the "Copy" bar and pre-selects the text to copy.
 * @param {string} dataToCopy - The data to be copied.
 */
const showCopyBar = (dataToCopy) => {
    const copyBar = byId('copy');
    const copyLink = byId('copy-link');

    if (copyBar && copyLink) {
        copyBar.classList.remove('hidden');
        copyLink.classList.remove('hidden');
        copyLink.value = dataToCopy;
        copyLink.focus();
        copyLink.setSelectionRange(0, dataToCopy.length);
    } else {
        console.error('Copy bar or copy link element not found.');
    }
};

/**
 * Disables line wrapping in the editor.
 */
const disableLineWrapping = () => {
    byId('disable-line-wrapping').classList.add('hidden');
    byId('enable-line-wrapping').classList.remove('hidden');
    editor.setOption('lineWrapping', false);
};

/**
 * Enables line wrapping in the editor.
 */
const enableLineWrapping = () => {
    byId('enable-line-wrapping').classList.add('hidden');
    byId('disable-line-wrapping').classList.remove('hidden');
    editor.setOption('lineWrapping', true);
};

/**
 * Initializes various components on the page.
 */
const init = () => {
    initLangSelector();
    initCode();
    initClipboard();
    initModals();
    /**
    * Fetches the min char.
    */
    fetch('/min-char')
        .then(response => response.json())
        .then(data => {
            MinChar = data.MinChar;
        })
    .catch(error => console.warn('Error fetching MinChar:', error));
};

/**
 * Sets up the CodeMirror editor with optional read-only mode and initial content.
 * @param {boolean} readOnly - Whether the editor is read-only.
 * @param {string} [initialContent=''] - The initial content for the editor.
 */
const initCodeEditor = (readOnly = false, initialContent = '') => {
    CodeMirror.modeURL = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.5/mode/%N/%N.js';

    editor = new CodeMirror(byId('editor'), {
        lineNumbers: true,
        theme: 'dracula',
        readOnly: readOnly,
        lineWrapping: false,
        scrollbarStyle: 'simple',
        value: initialContent
    });

    if (readOnly) {
        document.body.classList.add('readonly');
    }

    statsEl = byId('stats');
    
    editor.on('change', () => {
        statsEl.innerHTML = `Length: ${editor.getValue().length} | Lines: ${editor.lineCount()}`;
    });
};
/**
 * Lets' you quickly hot swap between read-only and writeable.
 */
const toggleReadOnly = () => {
    const isReadOnly = editor.getOption('readOnly');
    editor.setOption('readOnly', !isReadOnly);
    document.body.classList.toggle('readonly', !isReadOnly);
};

/**
 * Initializes the language selector dropdown. (pro note: it doesn't even work)
 */
const initLangSelector = () => {
    select = new SlimSelect({
        select: '#language',
        data: CodeMirror.modeInfo.map((e) => ({
            text: e.name,
            value: shorten(e.name),
            data: { mime: e.mime, mode: e.mode },
        })),
        showContent: 'down',
        onChange: (e) => {
            const language = e.data || { mime: null, mode: null };
            editor.setOption('mode', language.mime);
            CodeMirror.autoLoadMode(editor, language.mode);
            document.title = e.text && e.text !== 'Plain Text' ? `OutOfPaste - ${e.text} code snippet` : 'OutOfPaste';
        },
    });

    const l = new URLSearchParams(window.location.search).get('l');
    select.set(l ? decodeURIComponent(l) : shorten('Plain Text'));
};

/**
 * Loads initial code into the editor if a `c` URL parameter is present.
 */
const initCode = () => {
    const code = new URLSearchParams(window.location.search).get('c');
    if (code) {
        decompress(code).then((code) => editor.setValue(code));
    }
};

/**
 * Initializes the clipboard functionality for copying content.
 */
const initClipboard = () => {
    const clipboard = new ClipboardJS('.clipboard');
    clipboard.on('success', () => {
        hideCopyBar(true);
    });
};

/**
 * Initializes the modals using MicroModal library.
 */
const initModals = () => {
    MicroModal.init();
};

/**
 * Displays the "About" modal.
 */
const showInfo = () => {
    const modal = document.getElementById('about-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
};

/**
 * Hides the "About" modal.
 */
const hideAboutModal = () => {
    const modal = document.getElementById('about-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
};

/**
 * Displays the "error" modal.
 */
const showError = () => {
    const modal = document.getElementById('error-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
};

const CustomErrorModal = (err) => {
    document.getElementById('error-message').innerHTML = `<br>${err}<br>`;
    const modal = document.getElementById('save-error-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
  
};

/**
 * Generates a unique token for identifying the paste.
 * @returns {string} - The generated token.
 */
const generateToken = () => {
    const randomNumbers = () => {
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    };

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${randomNumbers()}-${day}${month}${year}-${milliseconds}`;
};

/**
 * Sanitizes a strings by removing un-safe simbles.
 * @param {string} str - The input name to be sanitized.
 * @returns {string} - The sanitized version of the input str.
 */
const slugify = (str) =>
    str
        .trim()
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/\+/g, '-p')
        .replace(/#/g, '-sharp')
        .replace(/[^\w\-]+/g, '');


/**
 * Shortens a given name by applying transformations to make it concise and URL-friendly.
 * @param {string} name - The input name to be shortened.
 * @returns {string} - The shortened version of the input name.
 */
const shorten = (name) => {
    let n = slugify(name).replace('script', '-s').replace('python', 'py');
    const nov = (s) => s[0] + s.substr(1).replace(/[aeiouy-]/g, '');
    if (n.replace(/-/g, '').length <= 4) {
        return n.replace(/-/g, '');
    }
    if (n.split('-').length >= 2) {
        return n
            .split('-')
            .map((x) => nov(x.substr(0, 2)))
            .join('')
            .substr(0, 4);
    }
    n = nov(n);
    if (n.length <= 4) {
        return n;
    }
    return n.substr(0, 2) + n.substr(n.length - 2, 2);
};


/**
 * Generates a link based on the specified method and sends data to the server.
 * @param {string} method - The method to use for link generation (e.g., 'url', 'markdown', 'iframe').
 */
const generateLink = (method) => {
    const data = editor.getValue();
    const token = generateToken();
    toggleReadOnly()
    if (data.trim() === "") {
        CustomErrorModal("Your paste can not be empty!")
    } else if (data.trim().length < MinChar) {
        CustomErrorModal(`Your paste should contain atleast ${MinChar} characters!`)
    }
    else {
        showCopyBar(`${window.location.origin}/read/${token}`);
        console.log("Attempting to save data to server...");
        const payload = {
            save: data,
            token: token
        };
        fetch(`${window.location.origin}/create-file`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('Success:', data);
        }).catch(error => {
            console.error('Error:', error);
        });
      }

};


document.addEventListener('DOMContentLoaded', init);