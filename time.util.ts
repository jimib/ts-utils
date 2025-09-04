const timeStart = Date.now();

export const getTimeSince = (time: number) => getTime() - time;
export const getTime = () => Date.now() - timeStart;

export const getTimeInSecondsSince = (time: number) => getTimeSince(time * 1000) / 1000;
export const getTimeInSeconds = () => getTime() / 1000;
