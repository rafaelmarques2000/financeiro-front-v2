const formatDateAndHour = (date) => {
    let dateObject = new Date(date)

    let day = dateObject.getDate() < 10 ? "0" + dateObject.getDate() : dateObject.getDate()
    let month = dateObject.getMonth() < 10 ? "0" + (dateObject.getMonth()+1) : dateObject.getMonth()+1
    let year = dateObject.getFullYear()

    let hour = dateObject.getHours() < 10 ? "0"+ dateObject.getHours() : dateObject.getHours()
    let minutes = dateObject.getMinutes() < 10 ? "0"+ dateObject.getMinutes() : dateObject.getMinutes()

    return `${day}/${month}/${year} ${hour}:${minutes}`
}

const formatDate = (date) => {
    let dateObj = new Date(date)
    let day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate()
    let month = dateObj.getMonth()+1 < 10 ? "0" + (dateObj.getMonth()+1) : dateObj.getMonth()+1
    let year = dateObj.getFullYear()
    return `${year}-${month}-${day}`
}

const generateYears = (initial) => {
    let initYear = initial
    let currentYear = 2040
    let lengthYear = (currentYear - initYear);
    let count = lengthYear < 0 ? lengthYear * -1 : lengthYear
    let yearList = [];
    yearList.push(initYear)
    for(let i=1; i <= count;i++) {
        if(initYear > currentYear) {
            yearList.push(initYear - i)
        }else {
            yearList.push(initYear + i)
        }
    }
    return yearList
}

export {
    formatDateAndHour,
    generateYears,
    formatDate
}