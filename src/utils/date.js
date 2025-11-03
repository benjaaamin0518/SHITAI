import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';
dayjs.extend(relativeTime);
dayjs.locale('ja');
export var formatDate = function (date, format) {
    if (format === void 0) { format = 'YYYY/MM/DD'; }
    return dayjs(date).format(format);
};
export var formatDateTime = function (date) {
    return dayjs(date).format('YYYY/MM/DD HH:mm');
};
export var getRelativeTime = function (date) {
    return dayjs(date).fromNow();
};
export var getTimeRemaining = function (deadline) {
    var now = dayjs();
    var target = dayjs(deadline);
    var diff = target.diff(now);
    if (diff < 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: true,
            text: '期限切れ',
        };
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);
    var text = '';
    if (days > 0) {
        text = "\u6B8B\u308A ".concat(days, "\u65E5 ").concat(hours, "\u6642\u9593");
    }
    else if (hours > 0) {
        text = "\u6B8B\u308A ".concat(hours, "\u6642\u9593 ").concat(minutes, "\u5206");
    }
    else if (minutes > 0) {
        text = "\u6B8B\u308A ".concat(minutes, "\u5206");
    }
    else {
        text = "\u6B8B\u308A ".concat(seconds, "\u79D2");
    }
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        expired: false,
        text: text,
    };
};
export var isDateInPast = function (date) {
    return dayjs(date).isBefore(dayjs());
};
export var addDays = function (date, days) {
    return dayjs(date).add(days, 'day').toISOString();
};
export var addHours = function (date, hours) {
    return dayjs(date).add(hours, 'hour').toISOString();
};
