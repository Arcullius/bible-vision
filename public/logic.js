"use strict";

// UI Helpers 

function setResult(html) {
    const el = document.getElementById('bv-result');
    if (el) el.innerHTML = html;
}

function setLoading(active) {
    const el = document.getElementById('bv-result');
    if (!el) return;
    if (active) el.innerHTML = '<p class="text-sm text-[#8B7355] italic">Loading…</p>';
}

function showError(message) {
    setResult(`<p class="text-sm text-red-600">${escapeHtml(message)}</p>`);
}

// API Calls
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok || !data.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        throw new Error(error.message || 'Network error');
    }
}

async function loadBooks() {
    return fetchJSON('/api/books');
}

async function loadBookMeta(book) {
    return fetchJSON(`/api/book/meta?book=${encodeURIComponent(book)}`);
}

async function loadChapter(book, chapter) {
    return fetchJSON(`/api/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}`);
}

async function loadVerse(book, chapter, verse) {
    return fetchJSON(`/api/verse?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}`);
}

async function searchBible(query, bookFilter, limit = 25) {
    let url = `/api/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    if (bookFilter) {
        url += `&book=${encodeURIComponent(bookFilter)}`;
    }
    return fetchJSON(url);
}

async function getRandomVerse(book, chapter) {
    let url = '/api/verse/random';
    if (book || chapter) {
        const params = [];
        if (book) params.push(`book=${encodeURIComponent(book)}`);
        if (chapter) params.push(`chapter=${chapter}`);
        url += '?' + params.join('&');
    }
    return fetchJSON(url);
}

// Helper function to convert full book titles back to abbreviations
function getBookCode(titleOrCode) {
    const titleToCode = {
        'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
        'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
        '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
        'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 
        'Psalm': 'PSA', 'Psalms': 'PSA',  
        'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
        'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
        'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
        'Micah': 'MIC', 'Nahum': 'NAH', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
        'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT',
        'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM',
        '1 Corinthians': '1CO', '2 Corinthians': '2CO', 'Galatians': 'GAL', 'Ephesians': 'EPH',
        'Philippians': 'PHP', 'Colossians': 'COL', '1 Thessalonians': '1TH', '2 Thessalonians': '2TH',
        '1 Timothy': '1TI', '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM',
        'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE',
        '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV'
    };
    
    // Return the code if it's a full title, or return as-is if it's already a code
    return titleToCode[titleOrCode] || titleOrCode.toUpperCase();
}

// Helper function to convert book codes back to full titles
function getBookTitle(code) {
    const codeToTitle = {
        'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers', 'DEU': 'Deuteronomy',
        'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
        '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
        'EZR': 'Ezra', 'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms',
        'PRO': 'Proverbs', 'ECC': 'Ecclesiastes', 'SNG': 'Song of Solomon', 'ISA': 'Isaiah',
        'JER': 'Jeremiah', 'LAM': 'Lamentations', 'EZK': 'Ezekiel', 'DAN': 'Daniel',
        'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos', 'OBA': 'Obadiah', 'JON': 'Jonah',
        'MIC': 'Micah', 'NAH': 'Nahum', 'HAB': 'Habakkuk', 'ZEP': 'Zephaniah',
        'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi', 'MAT': 'Matthew',
        'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John', 'ACT': 'Acts', 'ROM': 'Romans',
        '1CO': '1 Corinthians', '2CO': '2 Corinthians', 'GAL': 'Galatians', 'EPH': 'Ephesians',
        'PHP': 'Philippians', 'COL': 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
        '1TI': '1 Timothy', '2TI': '2 Timothy', 'TIT': 'Titus', 'PHM': 'Philemon',
        'HEB': 'Hebrews', 'JAS': 'James', '1PE': '1 Peter', '2PE': '2 Peter',
        '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', 'JUD': 'Jude', 'REV': 'Revelation'
    };
    
    return codeToTitle[code] || code;
}

// Check if a book code is part of the canonical 66 books
function isCanonicalBook(code) {
    const canonicalBooks = [
        'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
        '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
        'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
        'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT',
        'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP',
        'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE',
        '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
    ];
    return canonicalBooks.includes(code.toUpperCase());
}

// Chapter Nav

// Render chapter with navigation buttons
async function renderChapter(book, chapter, verses) {
    let totalChapters = null;
    try {
        const meta = await loadBookMeta(book);
        totalChapters = meta.chapters;
    } catch (err) {
        console.error('Could not load book metadata:', err);
    }
    
    const versesHtml = verses.map((text, index) => `<sup class="text-[#C9963E] font-bold mr-1">${index + 1}</sup>${escapeHtml(text)} `).join('');
    const hasNext = totalChapters ? chapter < totalChapters : true; // Show next button if we don't know total chapters
    
    return `
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-2xl font-serif font-bold text-[#6B5644]">${escapeHtml(getBookTitle(book))} Chapter ${chapter}</h4>
                <div class="flex gap-2">
                    ${chapter > 1 ? `<button onclick="loadPreviousChapter('${book}', ${chapter})" class="px-4 py-2 bg-[#8B7355] hover:bg-[#A0865F] text-[#F5F1E8] rounded border-2 border-[#6B5644] transition-colors text-sm whitespace-nowrap">← Previous</button>` : ''}
                    ${hasNext ? `<button onclick="loadNextChapter('${book}', ${chapter})" class="px-4 py-2 bg-[#8B7355] hover:bg-[#A0865F] text-[#F5F1E8] rounded border-2 border-[#6B5644] transition-colors text-sm whitespace-nowrap">Next →</button>` : ''}
                </div>
            </div>
            <div class="p-6 bg-gradient-to-br from-[#F4E4C1] to-[#E8DCC4] rounded-lg border-2 border-[#D4A574] shadow-md">
                <p class="text-gray-800 leading-relaxed">${versesHtml}</p>
            </div>
        </div>
    `;
}

// Navigate to previous chapter
async function loadPreviousChapter(book, currentChapter) {
    const prevChapter = parseInt(currentChapter) - 1;
    if (prevChapter < 1) return;
    
    setLoading(true);
    try {
        const data = await loadChapter(book, prevChapter);
        setResult(await renderChapter(data.book, data.chapter, data.verses));
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
}

// Navigate to next chapter
async function loadNextChapter(book, currentChapter) {
    const nextChapter = parseInt(currentChapter) + 1;
    
    setLoading(true);
    try {
        const data = await loadChapter(book, nextChapter);
        setResult(await renderChapter(data.book, data.chapter, data.verses));
    } catch (err) {
        // If next chapter doesn't exist, show error
        showError(err.message || 'No more chapters in this book');
    } finally {
        setLoading(false);
    }
}

// Get full book titles using predefined mapping based on the World English Bible files
async function getBookTitles() {
    const booksData = await loadBooks();
    
    // Predefined mapping of book codes to their full titles (from the first line of chapter files)
    const bookTitles = {
        'GEN': 'Genesis',
        'EXO': 'Exodus', 
        'LEV': 'Leviticus',
        'NUM': 'Numbers',
        'DEU': 'Deuteronomy',
        'JOS': 'Joshua',
        'JDG': 'Judges',
        'RUT': 'Ruth',
        '1SA': '1 Samuel',
        '2SA': '2 Samuel',
        '1KI': '1 Kings',
        '2KI': '2 Kings',
        '1CH': '1 Chronicles',
        '2CH': '2 Chronicles',
        'EZR': 'Ezra',
        'NEH': 'Nehemiah',
        'EST': 'Esther',
        'JOB': 'Job',
        'PSA': 'Psalms',
        'PRO': 'Proverbs',
        'ECC': 'Ecclesiastes',
        'SNG': 'Song of Solomon',
        'ISA': 'Isaiah',
        'JER': 'Jeremiah',
        'LAM': 'Lamentations',
        'EZK': 'Ezekiel',
        'DAN': 'Daniel',
        'HOS': 'Hosea',
        'JOL': 'Joel',
        'AMO': 'Amos',
        'OBA': 'Obadiah',
        'JON': 'Jonah',
        'MIC': 'Micah',
        'NAH': 'Nahum',
        'HAB': 'Habakkuk',
        'ZEP': 'Zephaniah',
        'HAG': 'Haggai',
        'ZEC': 'Zechariah',
        'MAL': 'Malachi',
        'MAT': 'Matthew',
        'MRK': 'Mark',
        'LUK': 'Luke',
        'JHN': 'John',
        'ACT': 'Acts',
        'ROM': 'Romans',
        '1CO': '1 Corinthians',
        '2CO': '2 Corinthians',
        'GAL': 'Galatians',
        'EPH': 'Ephesians',
        'PHP': 'Philippians',
        'COL': 'Colossians',
        '1TH': '1 Thessalonians',
        '2TH': '2 Thessalonians',
        '1TI': '1 Timothy',
        '2TI': '2 Timothy',
        'TIT': 'Titus',
        'PHM': 'Philemon',
        'HEB': 'Hebrews',
        'JAS': 'James',
        '1PE': '1 Peter',
        '2PE': '2 Peter',
        '1JN': '1 John',
        '2JN': '2 John',
        '3JN': '3 John',
        'JUD': 'Jude',
        'REV': 'Revelation'
    };
    
    // Biblical order mapping (matches the numeric prefix in filenames)
    const bookOrder = [
        'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
        '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER',
        'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP',
        'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL',
        'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE',
        '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
    ];
    
    // Create books with titles array - filter out non-canonical books
    const canonicalBooks = new Set([
        'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
        '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER',
        'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP',
        'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL',
        'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE',
        '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
    ]);

    const booksWithTitles = booksData.items
        .filter(item => canonicalBooks.has(item.book))  // Only keep canonical books
        .map(item => ({
            code: item.book,
            title: bookTitles[item.book] || item.book,
            chapters: item.chapters
        }));
    
    // Sort in biblical order
    const sorted = booksWithTitles.sort((a, b) => {
        const aIndex = bookOrder.indexOf(a.code);
        const bIndex = bookOrder.indexOf(b.code);
        // All books should now have valid indexes since we filtered
        return aIndex - bIndex;
    });
    
    return sorted;
}

// Wire up DOM when ready
document.addEventListener('DOMContentLoaded', async () => {
    // Clear any existing datalists first
    ['bv-verse-book', 'bv-book-name', 'bv-search-book'].forEach(id => {
        const existingDatalist = document.getElementById(`${id}-list`);
        if (existingDatalist) {
            existingDatalist.remove();
        }
    });
    
    // Load book list with full titles on page load
    try {
        const booksWithTitles = await getBookTitles();
        if (booksWithTitles && booksWithTitles.length) {
            const bookList = booksWithTitles.map(book => `
                <option value="${book.title}">${book.title}</option>
            `).join('');
            
            // Add book options to all book inputs
            ['bv-verse-book', 'bv-book-name', 'bv-search-book'].forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    // Convert input to datalist
                    const datalistId = `${id}-list`;
                    input.setAttribute('list', datalistId);
                    const datalist = document.createElement('datalist');
                    datalist.id = datalistId;
                    datalist.innerHTML = bookList;
                    input.parentNode.appendChild(datalist);
                }
            });
        }
    } catch (err) {
        console.error('Error loading book titles:', err);
        // Fallback to basic book codes with proper titles
        try {
            const data = await loadBooks();
            if (data.items && data.items.length) {
                // Use the same title mapping for fallback
                const bookTitles = {
                    'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers', 'DEU': 'Deuteronomy',
                    'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
                    '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
                    'EZR': 'Ezra', 'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms',
                    'PRO': 'Proverbs', 'ECC': 'Ecclesiastes', 'SNG': 'Song of Solomon', 'ISA': 'Isaiah',
                    'JER': 'Jeremiah', 'LAM': 'Lamentations', 'EZK': 'Ezekiel', 'DAN': 'Daniel',
                    'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos', 'OBA': 'Obadiah', 'JON': 'Jonah',
                    'MIC': 'Micah', 'NAH': 'Nahum', 'HAB': 'Habakkuk', 'ZEP': 'Zephaniah',
                    'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi', 'MAT': 'Matthew',
                    'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John', 'ACT': 'Acts', 'ROM': 'Romans',
                    '1CO': '1 Corinthians', '2CO': '2 Corinthians', 'GAL': 'Galatians', 'EPH': 'Ephesians',
                    'PHP': 'Philippians', 'COL': 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
                    '1TI': '1 Timothy', '2TI': '2 Timothy', 'TIT': 'Titus', 'PHM': 'Philemon',
                    'HEB': 'Hebrews', 'JAS': 'James', '1PE': '1 Peter', '2PE': '2 Peter',
                    '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', 'JUD': 'Jude', 'REV': 'Revelation'
                };
                
                const bookList = data.items.map(item => {
                    const fullTitle = bookTitles[item.book] || item.book;
                    return `<option value="${fullTitle}">${fullTitle}</option>`;
                }).join('');
                
                ['bv-verse-book', 'bv-book-name', 'bv-search-book'].forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        const datalistId = `${id}-list`;
                        input.setAttribute('list', datalistId);
                        const datalist = document.createElement('datalist');
                        datalist.id = datalistId;
                        datalist.innerHTML = bookList;
                        input.parentNode.appendChild(datalist);
                    }
                });
            }
        } catch (fallbackErr) {
            console.error('Error loading fallback books:', fallbackErr);
        }
    }
	// Random button handler
    const btnRandom = document.getElementById('btn-random');
    if (btnRandom) {
        btnRandom.addEventListener('click', async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                // Keep trying until we get a verse from a canonical book
                let data;
                let attempts = 0;
                const maxAttempts = 20;
                
                do {
                    data = await getRandomVerse();
                    attempts++;
                } while (!isCanonicalBook(data.book) && attempts < maxAttempts);
                
                if (!isCanonicalBook(data.book)) {
                    throw new Error('Could not find a verse from canonical books');
                }
                
                // autofill inputs with full titles for easy reference
                document.getElementById('bv-verse-book').value = getBookTitle(data.book);
                document.getElementById('bv-verse-chapter').value = data.chapter;
                document.getElementById('bv-verse-verse').value = data.verse;
                // display the verse
                setResult(`<div class="p-6 bg-gradient-to-br from-[#F4E4C1] to-[#E8DCC4] rounded-lg border-2 border-[#D4A574] shadow-md">
                    <h4 class="text-xl font-serif font-bold text-[#6B5644] mb-3">${escapeHtml(getBookTitle(data.book))} ${data.chapter}:${data.verse}</h4>
                    <p class="text-gray-800 leading-relaxed">${escapeHtml(data.text)}</p>
                </div>`);
            } catch (err) {
                showError(err.message);
            } finally {
                setLoading(false);
            }
        });
    }
	const verseForm = document.getElementById('bv-verse-form');
	const bookForm = document.getElementById('bv-book-form');
	const countForm = document.getElementById('bv-count-form');
	const searchForm = document.getElementById('bv-search-form');

    if (verseForm) verseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookInput = document.getElementById('bv-verse-book').value.trim();
        const book = getBookCode(bookInput);  // Convert title to code if needed
        const chapter = document.getElementById('bv-verse-chapter').value.trim();
        const verse = document.getElementById('bv-verse-verse').value.trim();

        if (!book) {
            showError('Please enter a book name');
            return;
        }

        setLoading(true);
        try {
            let data;
            if (verse && chapter) {
                // Load single verse if all parameters provided
                data = await loadVerse(book, chapter, verse);
                setResult(`<div class="p-6 bg-gradient-to-br from-[#F4E4C1] to-[#E8DCC4] rounded-lg border-2 border-[#D4A574] shadow-md">
                    <h4 class="text-xl font-serif font-bold text-[#6B5644] mb-3">${escapeHtml(getBookTitle(data.book))} ${data.chapter}:${data.verse}</h4>
                    <p class="text-gray-800 leading-relaxed">${escapeHtml(data.text)}</p>
                </div>`);
            } else if (chapter) {
                // Load full chapter if no verse specified
                data = await loadChapter(book, chapter);
                setResult(await renderChapter(data.book, data.chapter, data.verses));
            } else {
                showError('Please enter at least a book and chapter');
            }
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    });

	// Pagination state
	let currentPagination = null;

    if (bookForm) bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookInput = document.getElementById('bv-book-name').value.trim();
        const book = getBookCode(bookInput);  // Convert title to code if needed
        if (!book) {
            showError('Please enter a book name');
            return;
        }

        setLoading(true);
        try {
            // First load chapter 1 of the book
            const data = await loadChapter(book, 1);
            if (!data.verses.length) {
                showError('No verses found in this chapter');
                return;
            }

            setResult(await renderChapter(data.book, data.chapter, data.verses));
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    });

	// function attachLoadMore() {
    //     // Pagination removed as it's not needed with current API
    // }

    if (searchForm) searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const q = document.getElementById('bv-search-q').value.trim();
        const bookFilterInput = document.getElementById('bv-search-book').value.trim();
        const bookFilter = bookFilterInput ? getBookCode(bookFilterInput) : '';  // Convert title to code if needed

        if (!q || q.length < 2) {
            showError('Please enter at least 2 characters to search');
            return;
        }

        setLoading(true);
        try {
            const data = await searchBible(q, bookFilter, 25);
            if (!data.items.length) {
                setResult('<p class="text-sm text-[#8B7355]">No matches found.</p>');
                return;
            }

            // Create HTML for each search result
            const html = data.items.map(v => `
                <div class="mb-4 p-4 bg-gradient-to-br from-[#F4E4C1] to-[#E8DCC4] rounded border-2 border-[#D4A574]">
                    <strong class="text-[#C9963E] font-semibold">${escapeHtml(getBookTitle(v.book))} ${v.chapter}:${v.verse}</strong> — 
                    <span class="text-gray-800">${escapeHtml(v.text)}</span>
                </div>`).join('');
            
            setResult(`
                <h4 class="text-2xl font-serif font-bold text-[#6B5644] mb-4">
                    Search: "${escapeHtml(q)}" ${bookFilter ? `in ${escapeHtml(getBookTitle(bookFilter))}` : ''}
                    <small class="text-sm text-[#C9963E]">(${data.count} matches)</small>
                </h4>
                ${html}`);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    });

	function attachLoadMore() {
		const btn = document.getElementById('bv-load-more');
		if (!btn || !currentPagination) return;
		btn.addEventListener('click', async () => {
			const { type, key, page, size } = currentPagination;
			const nextPage = page + 1;
			try {
				setLoading(true);
				let data;
				if (type === 'book') data = await api(`/api/book?book=${encodeURIComponent(key)}&page=${nextPage}&size=${size}`);
				else {
					let url = `/api/search?q=${encodeURIComponent(key)}&page=${nextPage}&size=${size}`;
					if (currentPagination.book) url += `&book=${encodeURIComponent(currentPagination.book)}`;
					data = await api(url);
				}
				const items = data.verses || data.results || [];
				const html = items.map(v => {
					if (type === 'book') return `<div class="mb-4 p-4 bg-gradient-to-br from-[#F4E4C1] to-[#E8DCC4] rounded border-2 border-[#D4A574]">
						<strong class="text-[#C9963E] font-semibold">${v.chapter}:${v.verse}</strong> 
						<span class="text-gray-800">${escapeHtml(v.text)}</span>
					</div>`;
					return `<div class="mb-4 p-4 bg-gradient-to-br from-[#F4E4C1] to-[#E8DCC4] rounded border-2 border-[#D4A574]">
						<strong class="text-[#C9963E] font-semibold">${v.book} ${v.chapter}:${v.verse}</strong> — 
						<span class="text-gray-800">${escapeHtml(v.text)}</span>
					</div>`;
				}).join('');
				const container = document.getElementById('bv-result');
				if (container) container.insertAdjacentHTML('beforeend', html);
				currentPagination.page = data.page;
				if (data.total <= data.page * data.size) {
					const b = document.getElementById('bv-load-more'); if (b) b.remove();
				}
			} catch (err) {
				console.error(err);
			} finally { setLoading(false); }
		});
	}
});

function escapeHtml(s) {
	return (s + '').replace(/[&<>"']/g, function (c) {
		return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
	});
}