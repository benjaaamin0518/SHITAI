export var linkifyText = function (text) {
    var urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, function (url) {
        return "<a href=\"".concat(url, "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 underline break-all\">").concat(url, "</a>");
    });
};
