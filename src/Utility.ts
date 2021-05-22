export function millisToFormattedTime(millis: number): string {
    var ms = millis % 1000;
    millis = (millis - ms) / 1000;
    var secs = millis % 60;
    millis = (millis - secs) / 60;
    var mins = millis % 60;
    var hrs = (millis - mins) / 60;

    return hrs + "h " + mins + "m " + secs + "s";
}
