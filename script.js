document.addEventListener('DOMContentLoaded', () => {
    const diaryInput = document.getElementById('diaryInput');
    const postBtn = document.getElementById('postBtn');
    const feed = document.getElementById('feed');
    
    // Load entries from localStorage
    let entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    
    // Demo data if empty (to simulate "others' posts" for the first time)
    if (entries.length === 0) {
        entries = [
            {
                id: 1,
                content: "欢迎来到公共日记墙！在这里写下你的心情...",
                date: new Date().toISOString(),
                isPublic: true
            },
            {
                id: 2,
                content: "今天天气真不错，适合出去散步。",
                date: new Date(Date.now() - 86400000).toISOString(),
                isPublic: true
            }
        ];
        saveEntries();
    }

    renderEntries();

    // Enable/disable button based on input
    diaryInput.addEventListener('input', () => {
        postBtn.disabled = diaryInput.value.trim().length === 0;
    });

    // Post new entry
    postBtn.addEventListener('click', () => {
        const content = diaryInput.value.trim();
        if (!content) return;

        const newEntry = {
            id: Date.now(),
            content: content,
            date: new Date().toISOString(),
            isPublic: true // Default to public for this demo
        };

        entries.unshift(newEntry); // Add to beginning
        saveEntries();
        renderEntries();
        
        diaryInput.value = '';
        postBtn.disabled = true;
    });

    function saveEntries() {
        localStorage.setItem('diary_entries', JSON.stringify(entries));
    }

    function renderEntries() {
        feed.innerHTML = '';

        if (entries.length === 0) {
            feed.innerHTML = '<div class="empty-state">还没有日记，写下第一篇吧！</div>';
            return;
        }

        entries.forEach(entry => {
            const date = new Date(entry.date);
            const dateStr = date.toLocaleString('zh-CN', {
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit'
            });

            const entryEl = document.createElement('div');
            entryEl.className = 'entry';
            entryEl.innerHTML = `
                <div class="entry-header">
                    <span class="entry-date">${dateStr}</span>
                    <span class="entry-type">#公开</span>
                </div>
                <div class="entry-content">${escapeHtml(entry.content)}</div>
                <div class="entry-footer">
                    <button class="delete-btn" onclick="deleteEntry(${entry.id})">删除</button>
                </div>
            `;
            feed.appendChild(entryEl);
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Expose delete function globally
    window.deleteEntry = function(id) {
        if(confirm('确定要删除这条日记吗？')) {
            entries = entries.filter(e => e.id !== id);
            saveEntries();
            renderEntries();
        }
    };
});
