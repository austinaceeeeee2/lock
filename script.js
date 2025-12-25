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
    let kick, cowbell, highHat, bass, synth;
    let normalPart, climaxPart;
    let kickDistortion;

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
        Tone.Transport.bpm.value = 145; // Faster BPM for Phonk

        if (!transportStarted) {
            setupInstruments();
            setupParts();
            transportStarted = true;
        }

        Tone.Transport.start();
        document.body.style.animation = "pulse 0.41s infinite alternate"; // Normal pulse
    }

    function stopParty() {
        partyBtn.textContent = "🎵 开启派对模式 (Phonk)";
        document.body.classList.remove('party-mode');
        document.body.classList.remove('climax-mode'); // Remove climax class
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
        
        kickDistortion = new Tone.Distortion(0.4).toDestination();
        kick.connect(kickDistortion);

        // 2. Cowbell (Improved Phonk Style - Loud & punchy)
        // Using FM Synth to create a bell-like metallic tone
        cowbell = new Tone.FMSynth({
            harmonicity: 3.01,
            modulationIndex: 14,
            oscillator: { type: "pulse", width: 0.2 },
            envelope: {
                attack: 0.001,
                decay: 0.3,
                sustain: 0.1,
                release: 0.1
            },
            modulation: { type: "square" },
            modulationEnvelope: {
                attack: 0.002,
                decay: 0.2,
                sustain: 0,
                release: 0.2
            }
        }).toDestination();
        
        // Add a bit of reverb to space it out
        const cowbellReverb = new Tone.Reverb(1.5).toDestination(); 
        cowbell.connect(cowbellReverb);
        cowbell.volume.value = 5; // Boost volume significantly

        // 3. Hi-Hats (Fast and crispy)
        highHat = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: {
                attack: 0.001,
                decay: 0.03,
                sustain: 0
            }
        }).toDestination();

        // 4. Heavy Bass
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

        // 5. Climax Synth (Screech)
        synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 }
        }).toDestination();
        const synthDist = new Tone.Chebyshev(50).toDestination(); // Heavy distortion
        synth.connect(synthDist);
    }

    function setupParts() {
        // --- Normal Section Patterns ---
        const normalKickPattern = ["C1", null, "C1", null, "C1", "C1", null, "C1"];
        const normalCowbellPattern = [
            "C5", "C5", null, "D#5", 
            "C5", null, "A#4", "C5",
            "C5", "C5", "C5", "D#5", 
            "G5", null, "D#5", "C5"
        ];
        
        // --- Climax Section Patterns (Busier, more intense) ---
        const climaxKickPattern = ["C1", "C1", "C1", "C1", "C1", "C1", "C1", "C1"]; // 4-on-floor + fills
        const climaxCowbellPattern = [
            "C5", "C5", "D#5", "C5", 
            "F5", "D#5", "C5", "A#4",
            "C5", "C5", "C6", "C6", // High octave scream
            "G5", "F5", "D#5", "C5" 
        ];

        // Part 1: Normal Phonk Beat (4 measures)
        normalPart = new Tone.Part((time, value) => {
             // Beat
             const step = value.step;
             
             // Kick
             if (normalKickPattern[Math.floor(step/2)]) {
                 if (step % 2 === 0) kick.triggerAttackRelease("C1", "8n", time);
             }

             // Cowbell
             const note = normalCowbellPattern[step];
             if (note) cowbell.triggerAttackRelease(note, "16n", time, 1.2);

             // Hats (Every 16th)
             highHat.triggerAttackRelease("16n", time, 0.4);

             // Bass (Long notes)
             if (step === 0) bass.triggerAttackRelease("C2", "1n", time);

             // Visuals: reset to normal
             if (step === 0) {
                 document.body.classList.remove('climax-mode');
                 kickDistortion.distortion = 0.4;
             }

        }, Array.from({length: 16}, (_, i) => ({step: i})));
        
        normalPart.loop = true;
        normalPart.loopEnd = "1m";

        // Part 2: Climax / Drop (High Energy)
        climaxPart = new Tone.Part((time, value) => {
            const step = value.step;

            // Intense Kick
            kick.triggerAttackRelease("C1", "8n", time);

            // Intense Cowbell
            const note = climaxCowbellPattern[step];
            if (note) cowbell.triggerAttackRelease(note, "32n", time, 1.5);

            // Hats (Rolling)
            highHat.triggerAttackRelease("32n", time, 0.8);

            // Bass (Sliding/Pumping)
            if (step % 4 === 0) bass.triggerAttackRelease("C2", "8n", time);

            // Visuals: Climax
            if (step === 0) {
                document.body.classList.add('climax-mode');
                kickDistortion.distortion = 0.8; // Maximize distortion
            }

        }, Array.from({length: 16}, (_, i) => ({step: i})));

        climaxPart.loop = true;
        climaxPart.loopEnd = "1m";

        // Scheduler: 4 bars Normal -> 4 bars Climax -> Repeat
        Tone.Transport.scheduleRepeat((time) => {
            // Stop all parts
            normalPart.stop(time);
            climaxPart.stop(time);

            const measure = Math.floor(Tone.Transport.position.split(":")[0]);
            
            // Structure: 0-3 Normal, 4-7 Climax
            const section = measure % 8;
            
            if (section < 4) {
                normalPart.start(time);
            } else {
                climaxPart.start(time);
            }
        }, "1m");
    }
});
