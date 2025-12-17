// Focus Pulse Timer

$(document).ready(function() {
    let timerInterval = null;
    let elapsedSeconds = 0;
    let currentTask = '';
    let isRunning = false;

    updateQuickStats();
    restoreSession();

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

    $('#task-input').on('input', function() {
        const value = $(this).val().trim();
        if (value.length > 0) {
            $('#timer-display-wrapper').addClass('visible');
            $('.input-group').addClass('minimized');
        } else {
            $('#timer-display-wrapper').removeClass('visible');
            $('.input-group').removeClass('minimized');
        }
    });

    $('#task-input').on('focus', function() {
        $('.input-group').addClass('minimized');
    });

    $('#task-input').on('blur', function() {
        if ($(this).val().trim().length === 0) {
            $('.input-group').removeClass('minimized');
        }
    });

    $('#timer-display-wrapper').click(function() {
        if (!isRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    $('#stop-timer-btn').on('click', function(e) {
        e.preventDefault();
        stopTimer();
    });

    function startTimer() {
        currentTask = $('#task-input').val().trim();
        
        if (!currentTask) {
            showCustomAlert('Please enter what you\'re working on!', function() {
                $('#task-input').focus();
            });
            return;
        }

        isRunning = true;
        $('#task-input').prop('disabled', true);
        $('#session-status').text(`Focusing on: ${currentTask}`);
        $('#timer-display-wrapper').addClass('running').removeClass('paused');
        $('.session-info').removeClass('show-stop');
        
        timerInterval = setInterval(function() {
            elapsedSeconds++;
            updateDisplay();
            saveSessionState();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        $('#timer-display-wrapper').addClass('paused').removeClass('running');
        $('#session-status').text('Paused - Tap to continue');
        $('.session-info').addClass('show-stop');
    }

    function stopTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        $('#timer-display-wrapper').removeClass('running paused');
        $('.session-info').removeClass('show-stop');
        
        if (elapsedSeconds >= 60) {
            showCustomConfirm('Save this session?', function() {
                showMoodModal();
            }, function() {
                resetTimer();
            });
        } else {
            resetTimer();
        }
    }

    function updateDisplay() {
        $('#timer').text(formatTime(elapsedSeconds));
        const progress = Math.min(elapsedSeconds / 3600, 1);
        const offset = 1130 * (1 - progress);
        $('.timer-circle-progress').css('stroke-dashoffset', offset);
    }

    function formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    function showMoodModal() {
        $('#mood-modal').addClass('active');
    }

    $('.mood-btn').click(function() {
        const mood = $(this).data('mood');
        saveSession(mood);
        $('#mood-modal').removeClass('active');
        resetTimer();
        updateQuickStats();
    });

    function saveSession(mood) {
        let sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
        
        sessions.push({
            id: Date.now(),
            task: currentTask,
            duration: elapsedSeconds,
            mood: mood,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('focusSessions', JSON.stringify(sessions));
        showCustomAlert(`Great! You focused for ${Math.floor(elapsedSeconds / 60)} minutes.`);
    }

    function resetTimer() {
        elapsedSeconds = 0;
        isRunning = false;
        $('#timer').text('00:00:00');
        $('#task-input').prop('disabled', false).val('');
        $('#session-status').text('Tap the timer to start');
        $('#timer-display-wrapper').removeClass('running paused');
        $('.timer-circle-progress').css('stroke-dashoffset', 1130);
        clearSessionState();
        $('.session-info').removeClass('show-stop');
    }

    function saveSessionState() {
        const state = {
            task: currentTask,
            elapsed: elapsedSeconds,
            timestamp: Date.now()
        };
        localStorage.setItem('currentSession', JSON.stringify(state));
    }

    function restoreSession() {
        const saved = localStorage.getItem('currentSession');
        if (!saved) return;
        const state = JSON.parse(saved);
        const timeSince = Math.floor((Date.now() - state.timestamp) / 1000);
        if (timeSince < 7200) {
            currentTask = state.task;
            elapsedSeconds = state.elapsed;
            $('#task-input').val(currentTask).prop('disabled', true);
            $('#session-status').text('Paused - Tap to continue');
            $('#timer-display-wrapper').addClass('paused visible');
            $('.session-info').addClass('show-stop');
            $('.input-group').addClass('minimized');
            updateDisplay();
        } else {
            clearSessionState();
        }
    }

    function clearSessionState() {
        localStorage.removeItem('currentSession');
    }

    function updateQuickStats() {
        const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
        
        if (sessions.length === 0) {
            $('#today-time').text('0m');
            return;
        }

        const today = new Date().toDateString();
        const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);

        let todayTotal = 0;
        todaySessions.forEach(s => todayTotal += s.duration);
        
        $('#today-time').text(Math.floor(todayTotal / 60) + 'm');
    }
});

