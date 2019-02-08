function getDayName(num) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  if (num === 0) return days.pop()
  return days[num - 1]
}

//displays today, tomorrow, or day of week
export function getDisplayedDay(dateDeep) {
  let date = new Date(dateDeep.getTime());
  let todaysDate = new Date();
  let tomorrowsDate = new Date();
  tomorrowsDate.setDate(todaysDate.getDate() + 1);

  if (date.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
    return "Today";
  } else if (date.setHours(0, 0, 0, 0) === tomorrowsDate.setHours(0, 0, 0, 0)) {
    return "Tomorrow";
  } else {
    return getDayName(date.getDay());
  }
}


export const FBRegex = /(?:https?\:\/\/)?(?:www\.)?facebook\.com\/events\/\d{10,20}\/?/ig;
