let timeLeft, timerId = null, currentMode = 'focus', focusCycles = 0, totalSecondsFocused = 0;

const config = {
    focus: { min: 25, color: '#ff5b5b', bg: '#1a0a0a' },
    short: { min: 5, color: '#40e0d0', bg: '#0a1a1a' },
    long: { min: 15, color: '#9d7aff', bg: '#0e091a' }
};

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;

function setMode(mode) {
    currentMode = mode;
    timeLeft = config[mode].min * 60;
    document.documentElement.style.setProperty('--bg', config[mode].bg);
    document.documentElement.style.setProperty('--accent', config[mode].color);
    document.getElementById('modeName').textContent = mode.toUpperCase().replace('SHORT', 'SHORT BREAK').replace('LONG', 'LONG BREAK');
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.id === 'btn-' + mode));
    updateDisplay();
}

function updateDisplay() {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById('timer').textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    circle.style.strokeDashoffset = circumference - (timeLeft / (config[currentMode].min * 60) * circumference);
}

// ฟังก์ชันเริ่มนับเวลา (ตัวหัวใจหลักที่ทำให้ Auto-start)
function startTicking() {
    if (timerId) clearInterval(timerId);
    document.getElementById('playIcon').textContent = 'pause';
    
    timerId = setInterval(() => {
        timeLeft--;
        if (currentMode === 'focus') {
            totalSecondsFocused++;
            updateTotalTimeDisplay();
        }
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            handleLoop(); // จบแล้วไป Loop ต่อ
        }
    }, 1000);
}

function handleLoop() {
    // เล่นเสียง
    const alarm = document.getElementById('bell');
    alarm.play().catch(() => console.log("คลิก Play ครั้งแรกเพื่อเปิดเสียง"));

    // สลับโหมด
    if (currentMode === 'focus') {
        focusCycles++;
        updateDotsUI();
        if (focusCycles % 4 === 0) setMode('long'); else setMode('short');
    } else {
        setMode('focus');
    }

    // สั่งเริ่มทันที!
    setTimeout(() => {
        startTicking();
    }, 1500);
}

function toggleTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('playIcon').textContent = 'play_arrow';
    } else {
        startTicking();
    }
}

function updateDotsUI() {
    const dots = document.querySelectorAll('.dot');
    const activeCount = focusCycles % 4 === 0 && focusCycles !== 0 ? 4 : focusCycles % 4;
    dots.forEach((d, i) => d.classList.toggle('active', i < activeCount));
}

function updateTotalTimeDisplay() {
    const h = Math.floor(totalSecondsFocused/3600), mi = Math.floor((totalSecondsFocused%3600)/60), se = totalSecondsFocused%60;
    document.getElementById('totalTimeDisplay').textContent = `${h.toString().padStart(2,'0')}:${mi.toString().padStart(2,'0')}:${se.toString().padStart(2,'0')}`;
}

function resetEverything() {
    clearInterval(timerId); timerId = null;
    document.getElementById('playIcon').textContent = 'play_arrow';
    focusCycles = 0; totalSecondsFocused = 0;
    updateTotalTimeDisplay();
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    setMode('focus');
}

function skipStep() {
    clearInterval(timerId);
    timerId = null;
    handleLoop();
}

// เริ่มต้นหน้าเว็บ
setMode('focus');

