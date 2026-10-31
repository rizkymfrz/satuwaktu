function formatCount(value: number) {
  return value.toLocaleString("id-ID");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatWeekday(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long" });
}

function formatMonthShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { month: "short" });
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

function formatRange(from: string, to: string) {
  const short = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  return short(from) === short(to)
    ? short(from)
    : `${short(from)} – ${short(to)}`;
}

function timeAgo(iso: string) {
  const then = new Date(iso);
  const now = new Date();
  let months =
    (now.getFullYear() - then.getFullYear()) * 12 +
    (now.getMonth() - then.getMonth());
  if (now.getDate() < then.getDate()) {
    months -= 1;
  }
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return rest ? `${years} tahun ${rest} bulan lalu` : `${years} tahun lalu`;
  }
  if (months >= 1) {
    return `${months} bulan lalu`;
  }
  const days = Math.floor((now.getTime() - then.getTime()) / 86400000);
  return days <= 0 ? "Hari ini" : `${days} hari lalu`;
}

function daysSince(iso: string) {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86400000),
  );
}

function formatClock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

export {
  daysSince,
  formatClock,
  formatCount,
  formatDate,
  formatLongDate,
  formatMonthShort,
  formatMonthYear,
  formatRange,
  formatShortDate,
  formatTime,
  formatWeekday,
  timeAgo,
};
