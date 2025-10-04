Date.prototype.toRelativeTime = function() {
    const seconds = Math.floor((new Date() - this) / 1000)

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }

    for (const [name, seconds_in_interval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / seconds_in_interval)

        if (interval >= 1) {
            return interval === 1
                ? `1 ${name} ago`
                : `${interval} ${name}s ago`
        }
    }

    return 'Just now'
}