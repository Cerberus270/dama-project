export const checkDates = (date1, date2) => {
    let control;
    date1 > date2 ? (control = true) : (control = false);
    return control;
};

export const timestampToDate = (valorTimestamp) => {
    let tempDate = new Date(valorTimestamp * 1000);
    let formatDate =
        (tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()) +
        "/" +
        ((tempDate.getMonth() + 1) < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    return formatDate;
};

export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}