document.addEventListener('DOMContentLoaded', () => {
    const diaryInput = document.getElementById('diaryInput');
    const postBtn = document.getElementById('postBtn');
    const feed = document.getElementById('feed');
    const partyBtn = document.getElementById('partyBtn');
    
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

    /* ----------------------------------------------------
       BRAZILIAN PHONK GENERATOR (Tone.js)
       ---------------------------------------------------- */
    let isPlaying = false;
    let transportStarted = false;

    // Instruments
    let kick, cowbell, highHat, bass;
    let loopKick, loopCowbell, loopHats, loopBass;

    partyBtn.addEventListener('click', async () => {
        if (!isPlaying) {
            await startParty();
        } else {
            stopParty();
        }
    });

    async function startParty() {
        partyBtn.textContent = "⏹ 停止派对";
        document.body.classList.add('party-mode');
        isPlaying = true;

        await Tone.start();
        Tone.Transport.bpm.value = 135; // Phonk BPM

        if (!transportStarted) {
            setupInstruments();
            setupLoops();
            transportStarted = true;
        }

        Tone.Transport.start();
        
        // Add visual pulsing effect to body
        document.body.style.animation = "pulse 0.44s infinite alternate"; // Sync approx with 135 BPM
    }

    function stopParty() {
        partyBtn.textContent = "🎵 开启派对模式 (Phonk)";
        document.body.classList.remove('party-mode');
        isPlaying = false;
        
        Tone.Transport.stop();
        document.body.style.animation = "";
    }

    function setupInstruments() {
        // 1. Distorted 808 Kick
        kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
                attackCurve: "exponential"
            }
        }).toDestination();
        
        const kickDistortion = new Tone.Distortion(0.4).toDestination();
        kick.connect(kickDistortion);

        // 2. Cowbell (The "Dudada" element)
        // Using MetalSynth to simulate 808 cowbell
        cowbell = new Tone.MetalSynth({
            frequency: 800,
            envelope: {
                attack: 0.001,
                decay: 0.1,
                release: 0.01
            },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        
        const cowbellDelay = new Tone.FeedbackDelay("8n", 0.3).toDestination();
        cowbell.connect(cowbellDelay);

        // 3. Hi-Hats (Fast and crispy)
        highHat = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: {
                attack: 0.001,
                decay: 0.03,
                sustain: 0
            }
        }).toDestination();

        // 4. Heavy Bass (Reese bass style)
        bass = new Tone.MonoSynth({
            oscillator: { type: "sawtooth" },
            envelope: {
                attack: 0.1,
                decay: 0.3,
                sustain: 0.4,
                release: 0.8
            },
            filterEnvelope: {
                attack: 0.001,
                decay: 0.7,
                sustain: 0.1,
                baseFrequency: 200,
                octaves: 2.6
            }
        }).toDestination();
        
        const bassDist = new Tone.Distortion(0.2).toDestination();
        bass.connect(bassDist);
    }

    function setupLoops() {
        // Kick Pattern: Simple driving beat with some syncopation
        loopKick = new Tone.Sequence((time, note) => {
            kick.triggerAttackRelease(note, "8n", time);
        }, ["C1", null, "C1", null, "C1", "C1", null, "C1"], "4n").start(0);

        // Cowbell Melody ("Dudada" feel)
        // High pitched, repetitive
        const bellPattern = [
            "C5", "C5", null, "D#5", 
            "C5", null, "A#4", "C5",
            "C5", "C5", "C5", "D#5", 
            "G5", null, "D#5", "C5"
        ];
        
        loopCowbell = new Tone.Sequence((time, note) => {
            if (note) cowbell.triggerAttackRelease(note, "16n", time, 1.2); // Velocity high
        }, bellPattern, "8n").start(0);

        // Hi-Hats: Fast 16th notes with some rolls
        loopHats = new Tone.Loop((time) => {
            highHat.triggerAttackRelease("16n", time, 0.5);
        }, "16n").start(0);

        // Bass Line: Following the root
        loopBass = new Tone.Sequence((time, note) => {
            if (note) bass.triggerAttackRelease(note, "2n", time);
        }, ["C2", null, "G1", null], "1m").start(0);
    }
});
