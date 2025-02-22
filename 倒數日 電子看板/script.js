// 時鐘與日期更新
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    // 民國日期轉換
    const year = now.getFullYear() - 1911;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('date').textContent = `${year}/${month}/${day}`;

    // 星期轉換
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('weekday').textContent = `星期${weekdays[now.getDay()]}`;
}

setInterval(updateTime, 1000);
updateTime();

// 倒數計時功能
function updateCountdown(targetDate) {
    const now = new Date();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
        document.getElementById('countdown').textContent = '倒數結束';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent = `${days}天 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 讀取活動並顯示倒數計時
async function loadEvents() {
    try {
        const response = await fetch('events.txt');
        if (!response.ok) throw new Error('無法讀取活動檔案');

        const eventText = await response.text();
        const lines = eventText.split('\n');

        const eventList = [];
        lines.forEach(line => {
            if (line.startsWith('SHOW:')) {
                const eventDetails = line.substring(5).trim().split(';');
                if (eventDetails.length === 2) {
                    const eventName = eventDetails[0];
                    const eventDate = new Date(eventDetails[1]);
                    eventList.push({ eventName, eventDate });
                }
            }
        });

        const eventItemContainer = document.getElementById('event-item');
        let currentEventIndex = 0;

        // 顯示活動並更新倒數
        function updateEvent() {
            if (eventList.length > 0) {
                const event = eventList[currentEventIndex];
                eventItemContainer.textContent = event.eventName;
                updateCountdown(event.eventDate);
                currentEventIndex = (currentEventIndex + 1) % eventList.length;
            }
        }

        // 每 5 秒更新一次活動
        setInterval(updateEvent, 5000);
        updateEvent();  // 頁面加載時立即顯示第一個活動

    } catch (error) {
        console.error(error);
        document.getElementById('event-item').textContent = '活動加載失敗';
    }
}

loadEvents();

// 載入跑馬燈的文字
async function loadMarqueeText() {
    try {
        const response = await fetch('marquee.txt');
        if (!response.ok) throw new Error('無法讀取跑馬燈檔案');

        const marqueeText = await response.text();
        const lines = marqueeText.split('\n');

        let displayText = '';

        lines.forEach(line => {
            if (line.startsWith('SHOW:')) {
                displayText += line.substring(5) + ' ';
            }
        });

        const marqueeElement = document.querySelector('.footer marquee');
        if (displayText.trim()) {
            marqueeElement.textContent = displayText.trim();
        } else {
            marqueeElement.textContent = '跑馬燈內容加載失敗，請檢查檔案內容。';
        }

    } catch (error) {
        console.error(error);
        document.querySelector('.footer marquee').textContent = '跑馬燈內容讀取失敗';
    }
}

loadMarqueeText();