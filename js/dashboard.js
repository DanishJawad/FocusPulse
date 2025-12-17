// Focus Pulse Dashboard

$(document).ready(function() {
    updateStats();
    showRecentSessions();
    createCharts();

    function showCustomAlert(message, callback) {
        $('#custom-modal-message').text(message);
        $('#custom-modal-buttons').html('<button id="custom-alert-ok">OK</button>');
        $('#custom-modal').addClass('active');
        $('#custom-alert-ok').click(function() {
            $('#custom-modal').removeClass('active');
            if (callback) callback();
        });
    }

    function showCustomConfirm(message, onYes, onNo) {
        $('#custom-modal-message').text(message);
        $('#custom-modal-buttons').html(
            '<button id="custom-confirm-yes">Yes</button>' +
            '<button class="cancel" id="custom-confirm-no">Cancel</button>'
        );
        $('#custom-modal').addClass('active');
        $('#custom-confirm-yes').click(function() {
            $('#custom-modal').removeClass('active');
            if (onYes) onYes();
        });
        $('#custom-confirm-no').click(function() {
            $('#custom-modal').removeClass('active');
            if (onNo) onNo();
        });
    }

    function getSessions() {
        return JSON.parse(localStorage.getItem('focusSessions') || '[]');
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    }

    function generateDemoData() {
        const tasks = ['Writing', 'Coding', 'Reading', 'Studying', 'Design', 'Meeting'];
        const moods = ['focused', 'calm', 'energized', 'distracted', 'tired'];
        const sessions = [];

        for (let day = 13; day >= 0; day--) {
            const howMany = Math.floor(Math.random() * 4);
            for (let i = 0; i < howMany; i++) {
                const date = new Date();
                date.setDate(date.getDate() - day);
                date.setHours(9 + Math.floor(Math.random() * 8));
                
                sessions.push({
                    id: Date.now() + day + i,
                    task: tasks[Math.floor(Math.random() * tasks.length)],
                    duration: (20 + Math.floor(Math.random() * 60)) * 60,
                    mood: moods[Math.floor(Math.random() * moods.length)],
                    date: date.toISOString()
                });
            }
        }
        return sessions;
    }

    function updateStats() {
        const sessions = getSessions();
        
        if (sessions.length === 0) {
            $('#total-focus-time').text('0h 0m');
            $('#dashboard-total-sessions').text('0');
            $('#dashboard-avg-duration').text('0m');
            $('#current-streak').text('0');
            return;
        }

        let total = 0;
        sessions.forEach(s => total += s.duration);
        $('#total-focus-time').text(formatTime(total));

        $('#dashboard-total-sessions').text(sessions.length);

        const avg = Math.floor(total / sessions.length);
        $('#dashboard-avg-duration').text(Math.floor(avg / 60) + 'm');

        $('#current-streak').text(calculateStreak(sessions));
    }

    function calculateStreak(sessions) {
        const uniqueDays = [...new Set(sessions.map(s => new Date(s.date).toDateString()))];
        uniqueDays.sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        for (let i = 0; i < uniqueDays.length; i++) {
            const daysDiff = Math.floor((new Date() - new Date(uniqueDays[i])) / 86400000);
            if (daysDiff === i) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    function showRecentSessions() {
        const sessions = getSessions();
        const list = $('#sessions-list');
        
        if (sessions.length === 0) {
            list.html('<p class="no-data">No sessions yet!</p>');
            return;
        }

        list.empty();
        sessions.sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .forEach(s => {
                list.append(`
                    <div class="session-item">
                        <div class="session-task">${s.task}<br><small>${new Date(s.date).toLocaleString()}</small></div>
                        <div class="session-mood">${s.mood}</div>
                        <div class="session-duration">${Math.floor(s.duration / 60)}m</div>
                    </div>
                `);
            });
    }

    function createCharts() {
        const sessions = getSessions();
        
        if (sessions.length === 0) {
            $('.chart-card').each(function() {
                const canvas = $(this).find('canvas');
                if (canvas.length && !$(this).find('.no-data').length) {
                    canvas.hide().after('<p class="no-data">No data yet. Start tracking!</p>');
                }
            });
            return;
        }

        $('.chart-card canvas').show();
        $('.chart-card .no-data').remove();
        
        makeBarChart(sessions);
        makePieChart(sessions);
        makeLineChart(sessions);
    }

    function makeBarChart(sessions) {
        const days = [];
        const minutes = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en', { weekday: 'short' }));

            const dayTotal = sessions
                .filter(s => new Date(s.date).toDateString() === date.toDateString())
                .reduce((sum, s) => sum + s.duration, 0);
            
            minutes.push(Math.floor(dayTotal / 60));
        }

        const ctx = document.getElementById('daily-chart').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(1, '#7b2cbf');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Focus Time (minutes)',
                    data: minutes,
                    backgroundColor: gradient,
                    borderColor: '#00d4ff',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1500, easing: 'easeInOutQuart' },
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#e8eaf6', font: { size: 14, weight: '600' }, padding: 15 }
                    },
                    tooltip: {
                        backgroundColor: '#1a1f2e',
                        titleColor: '#00d4ff',
                        bodyColor: '#e8eaf6',
                        borderColor: '#00d4ff',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                const mins = context.parsed.y;
                                const hours = Math.floor(mins / 60);
                                const remainMins = mins % 60;
                                return hours > 0 ? `${hours}h ${remainMins}m focused` : `${mins}m focused`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#2a2f3e', drawBorder: false },
                        ticks: { color: '#a0a4b8', font: { size: 12 }, callback: (v) => v + 'm' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#e8eaf6', font: { size: 13, weight: '600' } }
                    }
                }
            }
        });
    }

    function makePieChart(sessions) {
        const moodCount = {};
        sessions.forEach(s => {
            moodCount[s.mood] = (moodCount[s.mood] || 0) + 1;
        });

        new Chart(document.getElementById('mood-chart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(moodCount),
                datasets: [{
                    data: Object.values(moodCount),
                    backgroundColor: ['#00d4ff', '#7b2cbf', '#00ff88', '#ffa502', '#ff4757']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function makeLineChart(sessions) {
        const days = [];
        const counts = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
            
            const dayCount = sessions.filter(s => 
                new Date(s.date).toDateString() === date.toDateString()
            ).length;
            counts.push(dayCount);
        }

        new Chart(document.getElementById('weekly-chart'), {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Sessions',
                    data: counts,
                    borderColor: '#00d4ff',
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    $('#clear-data-btn').before('<button id="load-sample-btn" class="btn btn-primary" style="margin-right: 10px;">Load Demo Data</button>');

    $(document).on('click', '#load-sample-btn', function() {
        showCustomConfirm('Replace your data with demo data?', function() {
            localStorage.setItem('focusSessions', JSON.stringify(generateDemoData()));
            location.reload();
        });
    });

    $(document).on('click', '#clear-data-btn', function() {
        showCustomConfirm('Delete all your session data?', function() {
            localStorage.removeItem('focusSessions');
            location.reload();
        });
    });
});
