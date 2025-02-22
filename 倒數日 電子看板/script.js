let events = []; // 存活動列表
let currentIndex = 0; // 當前顯示的活動索引

// 更新時鐘
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById("clock").innerHTML = `⏰ ${hours}:${minutes}:${seconds}`;
}

// 更新日期
function updateDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById("date").innerHTML = `📅 ${now.toLocaleDateString('zh-TW', options)}`;
}

// 更新倒數計時
function updateCountdown(event) {
    const eventDate = new Date(event.date);
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
        document.getElementById("countdown").innerHTML = `📢 <b>${event.name}</b> 已開始！`;
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = 
        `⏳ <b>${event.name}</b> 還有 <b>${days}</b> 天 <b>${hours}</b> 小時 <b>${minutes}</b> 分鐘 <b>${seconds}</b> 秒`;
}

// 載入活動清單
function fetchEvents() {
    fetch("events.txt")
    .then(response => response.text())
    .then(data => {
        events = data.trim().split("\n").map(line => {
            const [action, eventName, eventDate] = line.split(",");
            return { action: action.trim(), name: eventName.trim(), date: eventDate.trim() };
        }).filter(event => event.action === "SHOW"); // 只顯示SHOW的活動

        if (events.length > 0) {
            showNextEvent(); // 顯示第一個活動
            setInterval(showNextEvent, 5000); // 每 5 秒切換活動
        }
    });
}

// 顯示下一個活動
function showNextEvent() {
    if (events.length === 0) return;
    updateCountdown(events[currentIndex]);
    currentIndex = (currentIndex + 1) % events.length;
}

// 載入跑馬燈內容
function fetchMarquee() {
    fetch("marquee.txt")
    .then(response => response.text())
    .then(data => {
        const marqueeContainer = document.querySelector(".marquee-container");
        const lines = data.trim().split("\n");
        const showLines = lines.filter(line => line.startsWith("SHOW:")).map(line => line.replace("SHOW:", "").trim());
        if (showLines.length > 0) {
            marqueeContainer.innerHTML = `<marquee width="480" direction="left" scrollamount="3">${showLines.join(' | ')}</marquee>`;
        }
    });
}

setInterval(updateClock, 1000);
setTimeout(() => location.reload(), 60000); // 1 分鐘自動刷新

window.onload = () => {
    updateClock();
    updateDate();
    fetchEvents();
    fetchMarquee();
};