(function() {
    if (document.getElementById('yak-v30')) document.getElementById('yak-v30').remove();

    let state = { bot: false, lastClick: 0 };

    const style = document.createElement('style');
    style.innerHTML = `
        #yak-v30 { 
            position: fixed; top: 0; right: 0; width: 45px; height: 100%;
            background: #202124; border-left: 1px solid #3c4043; color: #f1f3f4;
            font-family: 'Segoe UI', sans-serif; z-index: 9999999;
            display: flex; flex-direction: column; transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden; box-shadow: -2px 0 10px rgba(0,0,0,0.5);
        }
        #yak-v30:hover, #yak-v30:focus-within { width: 220px; }
        
        .v30-drag { 
            background: #292a2d; height: 35px; min-width: 220px;
            display: flex; align-items: center; padding: 0 12px; 
            font-size: 10px; font-weight: bold; color: #8ab4f8; cursor: move; white-space: nowrap;
        }
        .v30-btn { 
            display: flex; align-items: center; padding: 15px 12px;
            cursor: pointer; border-bottom: 1px solid #292a2d; transition: background 0.2s;
            white-space: nowrap; min-width: 220px;
        }
        .v30-btn:hover { background: #35363a; }
        .v30-icon { font-size: 18px; width: 20px; margin-right: 20px; text-align: center; }
        .v30-label { font-size: 12px; opacity: 0; transition: opacity 0.2s; color: #bdc1c6; }
        #yak-v30:hover .v30-label { opacity: 1; }
        
        .v30-pop { background: #292a2d; padding: 0; height: 0; overflow: hidden; transition: 0.3s; }
        .v30-pop.open { height: 80px; padding: 10px; border-bottom: 1px solid #3c4043; }
        
        .v30-input { background: #121212; border: 1px solid #3c4043; color: #fff; padding: 8px; width: 100%; font-size: 11px; outline: none; }
        .v30-terminal { flex: 1; display: flex; flex-direction: column; background: #1a1a1c; margin-top: auto; }
        #v30-out { flex: 1; padding: 10px; font-family: 'Consolas', monospace; font-size: 10px; overflow-y: auto; color: #9aa0a6; }
        #v30-in { background: #202124; border: none; border-top: 1px solid #3c4043; color: #fff; padding: 10px; font-size: 11px; outline: none; }
    `;
    document.head.appendChild(style);

    const gui = document.createElement('div');
    gui.id = 'yak-v30';
    gui.innerHTML = `
        <div class="v30-drag" id="v30-d">BORINGYAK_V30 // AUDITOR</div>
        
        <div class="v30-btn" id="t-bot">
            <span class="v30-icon">🤖</span><span class="v30-label">Toggle Auto-Answer</span>
        </div>
        
        <div class="v30-btn" id="t-mon">
            <span class="v30-icon">💰</span><span class="v30-label">Edit Currency</span>
        </div>
        <div class="v30-pop" id="pop-mon">
            <input type="number" id="mon-val" class="v30-input" placeholder="Value...">
            <button id="mon-set" style="width:100%; margin-top:5px; background:#8ab4f8; border:none; cursor:pointer; font-size:10px; padding:5px;">PATCH MEMORY</button>
        </div>

        <div class="v30-btn" id="t-fox">
            <span class="v30-icon">🦊</span><span class="v30-label">Unlock All (Chromas+)</span>
        </div>

        <div class="v30-btn" id="t-clr">
            <span class="v30-icon">🧹</span><span class="v30-label">Clear Console Logs</span>
        </div>

        <div class="v30-terminal">
            <div id="v30-out">System ready...</div>
            <input type="text" id="v30-in" placeholder="Terminal command..." spellcheck="false">
        </div>
    `;
    document.body.appendChild(gui);

    const log = (m, c="#9aa0a6") => {
        const out = document.getElementById('v30-out');
        out.innerHTML += `<div style="color:${c}; margin-bottom:2px;">> ${m}</div>`;
        out.scrollTop = out.scrollHeight;
    };

    // Button Logic
    document.getElementById('t-bot').onclick = function() {
        state.bot = !state.bot;
        this.style.borderLeft = state.bot ? "3px solid #81c995" : "none";
        log(`Bot: ${state.bot ? 'ON' : 'OFF'}`);
    };

    document.getElementById('t-mon').onclick = () => document.getElementById('pop-mon').classList.toggle('open');

    document.getElementById('mon-set').onclick = () => {
        const n = getReact();
        const v = parseInt(document.getElementById('mon-val').value) || 0;
        if(n && !n.isProps) {
            n.setState({ gold: v, money: v, crypto: v, totalMoney: v });
            log(`Memory patch applied: ${v}`, "#81c995");
        }
    };

    document.getElementById('t-fox').onclick = () => {
        const n = getReact();
        if(n && !n.isProps) {
            // Expanded list including Chroma-tier IDs
            const b = ["All", "King", "Mega Bot", "Ghost", "Spooky Ghost", "Timmy", "Phantom King"];
            n.setState({ unlocks: b, inventory: b, blooks: b });
            log("Full Chroma injection successful.", "#81c995");
        }
    };

    document.getElementById('t-clr').onclick = () => document.getElementById('v30-out').innerHTML = '';

    // Dragging
    const head = document.getElementById('v30-d');
    head.onmousedown = (e) => {
        let xOff = e.clientX - gui.offsetLeft;
        let yOff = e.clientY - gui.offsetTop;
        document.onmousemove = (ev) => {
            gui.style.left = (ev.clientX - xOff) + 'px';
            gui.style.top = (ev.clientY - yOff) + 'px';
        };
        document.onmouseup = () => { document.onmousemove = null; };
    };

    function getReact() {
        try {
            const r = document.querySelector('#app > div > div');
            const f = r[Object.keys(r).find(k => k.startsWith('__reactFiber'))];
            let c = f; while (c) {
                if (c.stateNode && c.stateNode.state) return c.stateNode;
                if (c.memoizedProps && c.memoizedProps.question) return { state: c.memoizedProps, isProps: true };
                c = c.return || c.child;
            }
        } catch(e){} return null;
    }

    setInterval(() => {
        const n = getReact(); if (!n) return;
        const q = n.isProps ? n.state.question : n.state.question;
        const ans = document.querySelectorAll('div[role="button"], [class*="answerText"]');
        
        if (q && q.correctAnswers && ans.length > 0) {
            const corr = q.correctAnswers[0];
            ans.forEach(a => {
                if (a.innerText.trim() === corr.trim()) {
                    if (state.bot && (Date.now() - state.lastClick > 1000)) {
                        state.lastClick = Date.now();
                        a.click(); if (a.parentElement) a.parentElement.click();
                    }
                }
            });
        }

        if (state.bot && !n.isProps && n.state.choices) {
            const boxes = document.querySelectorAll('div[class*="Box"], div[class*="choice"]');
            if (boxes.length > 0 && (Date.now() - state.lastClick > 1000)) {
                let bestIdx = 0;
                n.state.choices.forEach((c, i) => {
                    if (c.type === "swap" || c.type === "triple" || c.val > n.state.choices[bestIdx].val) bestIdx = i;
                });
                state.lastClick = Date.now();
                boxes[bestIdx].click();
            }
        }
    }, 600);

})();
