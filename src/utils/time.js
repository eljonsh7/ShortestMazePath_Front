export default {
    formatTime(time) {
        const parts = time.split(':').map(Number);
        let [hours, minutes, seconds] = parts;

        // Adjust for cases where only minutes and seconds are provided
        if (parts.length === 2) {
            seconds = minutes;
            minutes = hours;
            hours = 0;
        }

        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours}h `;
        }
        if (minutes > 0) {
            formattedTime += `${minutes}min `;
        }
        if (seconds > 0) {
            formattedTime += `${seconds}s`;
        }

        return formattedTime.trim();
    },
}