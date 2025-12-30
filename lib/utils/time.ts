export function generateTimeOptions(interval = 5) {
  const times: string[] = [];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }

  return times;
}
