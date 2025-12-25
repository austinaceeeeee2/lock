document.addEventListener('DOMContentLoaded', () => {
    const diaryInput = document.getElementById('diaryInput');
    const postBtn = document.getElementById('postBtn');
    const feed = document.getElementById('feed');
    const partyBtn = document.getElementById('partyBtn');
    
    // Load entries from localStorage
    let entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    
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

    diaryInput.addEventListener('input', () => {
        postBtn.disabled = diaryInput.value.trim().length === 0;
    });

    postBtn.addEventListener('click', () => {
        const content = diaryInput.value.trim();
        if (!content) return;

        const newEntry = {
            id: Date.now(),
            content: content,
            date: new Date().toISOString(),
            isPublic: true
        };

        entries.unshift(newEntry);
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

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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
    let kickDistortion, cowbellReverb, bassDist, synthDist;

    partyBtn.addEventListener('click', async () => {
        if (!isPlaying) {
            try {
                await startParty();
            } catch (err) {
                console.error(err);
                alert("播放失败，请尝试刷新页面: " + err);
                partyBtn.textContent = "❌ 播放错误";
            }
        } else {
            stopParty();
        }
    });

    async function startParty() {
        partyBtn.textContent = "⌛ 加载中...";
        
        // Ensure AudioContext is running
        await Tone.start();
        if (Tone.context.state !== 'running') {
            await Tone.context.resume();
        }

        partyBtn.textContent = "⏹ 停止派对";
        document.body.classList.add('party-mode');
        isPlaying = true;

        Tone.Transport.bpm.value = 145;

        // Cleanup previous if exists
        cleanupAudio();
        
        setupInstruments();
        setupParts();
        transportStarted = true;

        Tone.Transport.start();
        document.body.style.animation = "pulse 0.41s infinite alternate"; 
    }

    function stopParty() {
        partyBtn.textContent = "🎵 开启派对模式 (Phonk)";
        document.body.classList.remove('party-mode');
        document.body.classList.remove('climax-mode');
        isPlaying = false;
        
        Tone.Transport.stop();
        Tone.Transport.cancel(); // Clear scheduled events
        document.body.style.animation = "";
        
        // Optional: we can choose to cleanup audio here or keep it for next time
        // cleanupAudio(); 
    }

    function cleanupAudio() {
        if (transportStarted) {
             Tone.Transport.stop();
             Tone.Transport.cancel();
             
             if(normalPart) normalPart.dispose();
             if(climaxPart) climaxPart.dispose();
             
             if(kick) kick.dispose();
             if(cowbell) cowbell.dispose();
             if(highHat) highHat.dispose();
             if(bass) bass.dispose();
             if(synth) synth.dispose();
             
             // Dispose effects if they exist
             // Note: in previous version effects were local variables or not tracked
             // We need to track them to dispose them properly
        }
    }

    function setupInstruments() {
        // 1. Kick
        kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: "sine" },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
        }).toDestination();
        
        // 2. Cowbell - Using MetalSynth as it's more reliable for this sound
        cowbell = new Tone.MetalSynth({
            frequency: 800,
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        cowbell.volume.value = 0; // Standard volume

        // 3. Hi-Hats
        highHat = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.03, sustain: 0 }
        }).toDestination();
        highHat.volume.value = -5;

        // 4. Bass
        bass = new Tone.MonoSynth({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 },
            filterEnvelope: { attack: 0.001, decay: 0.7, sustain: 0.1, baseFrequency: 200, octaves: 2.6 }
        }).toDestination();
        
        // 5. Climax Synth
        synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 }
        }).toDestination();
        
        // Apply effects
        kickDistortion = new Tone.Distortion(0.4).toDestination();
        kick.connect(kickDistortion);
        
        const cowbellDelay = new Tone.FeedbackDelay("8n", 0.3).toDestination();
        cowbell.connect(cowbellDelay);
        
        const bassDist = new Tone.Distortion(0.2).toDestination();
        bass.connect(bassDist);
        
        const synthDist = new Tone.Chebyshev(50).toDestination();
        synth.connect(synthDist);
    }

    function setupParts() {
        const normalKickPattern = ["C1", null, "C1", null, "C1", "C1", null, "C1"];
        const normalCowbellPattern = [
            "C5", "C5", null, "D#5", 
            "C5", null, "A#4", "C5",
            "C5", "C5", "C5", "D#5", 
            "G5", null, "D#5", "C5"
        ];
        
        const climaxCowbellPattern = [
            "C5", "C5", "D#5", "C5", 
            "F5", "D#5", "C5", "A#4",
            "C5", "C5", "C6", "C6", 
            "G5", "F5", "D#5", "C5" 
        ];

        normalPart = new Tone.Part((time, value) => {
             const step = value.step;
             if (normalKickPattern[Math.floor(step/2)]) {
                 if (step % 2 === 0) kick.triggerAttackRelease("C1", "8n", time);
             }
             const note = normalCowbellPattern[step];
             if (note) cowbell.triggerAttackRelease(note, "16n", time, 1.2);
             highHat.triggerAttackRelease("16n", time, 0.4);
             if (step === 0) bass.triggerAttackRelease("C2", "1n", time);
             
             if (step === 0) {
                 document.body.classList.remove('climax-mode');
                 if(kickDistortion) kickDistortion.distortion = 0.4;
             }
        }, Array.from({length: 16}, (_, i) => ({step: i})));
        normalPart.loop = true; normalPart.loopEnd = "1m";

        climaxPart = new Tone.Part((time, value) => {
            const step = value.step;
            kick.triggerAttackRelease("C1", "8n", time);
            const note = climaxCowbellPattern[step];
            if (note) cowbell.triggerAttackRelease(note, "32n", time, 1.5);
            highHat.triggerAttackRelease("32n", time, 0.8);
            if (step % 4 === 0) bass.triggerAttackRelease("C2", "8n", time);
            
            if (step === 0) {
                document.body.classList.add('climax-mode');
                if(kickDistortion) kickDistortion.distortion = 0.8;
            }
        }, Array.from({length: 16}, (_, i) => ({step: i})));
        climaxPart.loop = true; climaxPart.loopEnd = "1m";

        Tone.Transport.scheduleRepeat((time) => {
            normalPart.stop(time);
            climaxPart.stop(time);
            const measure = Math.floor(Tone.Transport.position.split(":")[0]);
            const section = measure % 8;
            if (section < 4) normalPart.start(time);
            else climaxPart.start(time);
        }, "1m");
    }
});
