export default function formatTime(dateTimeString: string | undefined): string {
    if (!dateTimeString){
        return ""
    }
    const now = new Date();
    const targetDate = new Date(dateTimeString);

    const timeOptions = { hour: '2-digit' as const, minute: '2-digit' as const };
    const timeString = targetDate.toLocaleTimeString([], timeOptions);

    const sameDay = now.getDate() === targetDate.getDate() &&
                    now.getMonth() === targetDate.getMonth() &&
                    now.getFullYear() === targetDate.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = yesterday.getDate() === targetDate.getDate() &&
                        yesterday.getMonth() === targetDate.getMonth() &&
                        yesterday.getFullYear() === targetDate.getFullYear();

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const isLastWeek = targetDate > lastWeek && targetDate < yesterday;

    const isSameMonth = now.getMonth() === targetDate.getMonth() &&
                        now.getFullYear() === targetDate.getFullYear() &&
                        targetDate < lastWeek;

    const isSameYear = now.getFullYear() === targetDate.getFullYear() &&
                       targetDate < lastWeek && !isSameMonth;

    if (sameDay) {
        return timeString;
    } else if (isYesterday) {
        return `Yesterday ${timeString}`;
    } else if (isLastWeek) {
        return `${getDayName(targetDate.getDay())} ${timeString}`;
    } else if (isSameMonth) {
        return `${targetDate.getDate()} ${timeString}`;
    } else if (isSameYear) {
        return `${targetDate.getDate()} ${getMonthName(targetDate.getMonth()).slice(0, 3)} ${timeString}`;
    } else {
        return `${targetDate.getDate()} ${getMonthName(targetDate.getMonth()).slice(0, 3)} ${targetDate.getFullYear()} ${timeString}`;
    }
}

function getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

function getMonthName(monthIndex: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
}
