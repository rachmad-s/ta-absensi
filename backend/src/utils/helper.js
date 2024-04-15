const {
  getUserAttendanceByMonth,
} = require("../api/attendance/attendance.services");
const moment = require("moment");
const {
  getPublicHoliday,
} = require("../api/publicHoliday/publicHoliday.services");

function getRandomRolor() {
  var letters = "012345".split("");
  var color = "";
  color += letters[Math.round(Math.random() * 5)];
  letters = "0123456789ABCDEF".split("");
  for (var i = 0; i < 5; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

function getAttendanceSummary({ userId, month, year }) {
  return new Promise(async (resolve, reject) => {
    try {
      const adjutedMonth = String(Number(month) - 1);
      const publicHolidays = await getPublicHoliday({
        month: adjutedMonth,
        year,
      });
      const attendances = await getUserAttendanceByMonth({
        userId,
        month: adjutedMonth,
        year,
      });

      let startDate = moment({
        month: adjutedMonth,
        year,
      }).startOf("M");

      const endDate = moment(new Date()).isAfter(moment({
        month: adjutedMonth,
        year,
      }).endOf("M"), "date") ? moment({
        month: adjutedMonth,
        year,
      }).endOf("M") :  moment(new Date())
      
      const dates = [];

      let totalMinutes = 0;
      let totalAttendDays = 0;
      let totalLates = 0;

      let minimumWorkDays = 0;
      const minimumWorkMinutes = 60 * 9;

      while (startDate < endDate) {
        const isWeekend = startDate.day() === 0 || startDate.day() === 6;
        const isHoliday = Boolean(
          publicHolidays.find(
            (publicHoliday) =>
              publicHoliday.date.toISOString() === startDate.toISOString()
          )
        );
        const clockIn =
          (!isHoliday &&
            attendances.find(
              (attendance) =>
                attendance.type === "IN" &&
                startDate.toDate().getDate() === attendance.date.getDate()
            )) ||
          null;

        const clockOut =
          (!isHoliday &&
            attendances.find(
              (attendance) =>
                attendance.type === "OUT" &&
                startDate.toDate().getDate() === attendance.date.getDate()
            )) ||
          null;

        const isRejected =  Boolean(clockIn && clockIn.status === "REJECTED")

        const totalWorkMinuteInDay =
          clockOut && clockIn
            ? isRejected ? 0 : moment(clockOut.date).diff(clockIn.date, "minutes")
            : null;

        totalMinutes += totalWorkMinuteInDay || 0;
        minimumWorkDays = minimumWorkDays + (isWeekend || isHoliday ? 0 : 1);
        totalAttendDays = totalAttendDays + (totalWorkMinuteInDay ? 1 : 0);

        totalLates =
          totalLates +
          (clockIn
            ? moment(clockIn.date).isAfter({
                date: clockIn.date.getDate(),
                month: clockIn.date.getMonth(),
                year: clockIn.date.getFullYear(),
                hour: "09",
                minute: "00",
                second: "00",
              })
              ? 1
              : 0
            : 0);

        dates.push({
          date: startDate.toDate(),
          day: startDate.day(),
          totalWorkMinute: totalWorkMinuteInDay,
          isPublicHoliday: isHoliday || isWeekend,
          isUserTimeOff: false,
          attendance: {
            in: clockIn,
            out: clockOut,
          },
        });
        startDate.add(1, "days");
      }

      resolve({
        period: {
          start: moment({
            month: adjutedMonth,
            year,
          }).startOf("M"),
          end: endDate
        },
        totalMinutes,
        totalAttendDays,
        totalLates,
        averageWorkMinutes: totalMinutes / totalAttendDays,
        minimumWorkDays,
        minimumWorkMinutes: minimumWorkMinutes * minimumWorkDays,
        data: dates,
      });
    } catch (e) {
      reject(e);
    }
  });
}

function getMinimumAttendance({ month, year }) {
  return new Promise(async (resolve, reject) => {
    try {
      const adjutedMonth = String(Number(month) - 1);
      const publicHolidays = await getPublicHoliday({
        month: adjutedMonth,
        year,
      });
      let startDate = moment({
        month: adjutedMonth,
        year,
      }).startOf("M");
      let endDate = moment({
        month: adjutedMonth,
        year,
      }).endOf("M");

      let workDays = 0;
      const minimumDuration = 60 * 9;

      while (startDate < endDate) {
        const isWeekend = startDate.day() === 0 || startDate.day() === 6;
        const isHoliday = Boolean(
          publicHolidays.find(
            (publicHoliday) =>
              publicHoliday.date.toISOString() === startDate.toISOString()
          )
        );

        workDays = workDays + (isWeekend || isHoliday ? 0 : 1);

        startDate.add(1, "days");
      }

      resolve({
        workDays,
        totalWorkMinutes: minimumDuration * workDays,
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  getRandomRolor,
  getAttendanceSummary,
  getMinimumAttendance,
};
