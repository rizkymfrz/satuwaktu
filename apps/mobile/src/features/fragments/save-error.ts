import { isApiError } from "@repo/sdk";

function saveErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) {
    switch (error.status) {
      case 0:
        return "Tidak bisa terhubung ke server.";
      case 400:
        return error.details[0] ?? error.message;
      case 401:
        return "Sesi berakhir. Masuk lagi untuk menyimpan.";
      case 404:
        return "Fragmen tidak ditemukan.";
      case 413:
        return "Foto terlalu besar.";
      case 415:
        return "Format foto tidak didukung.";
      case 429:
        return "Terlalu banyak percobaan, coba lagi sebentar.";
    }
    if (error.status >= 500) {
      return "Server bermasalah, coba lagi nanti.";
    }
  }
  return fallback;
}

export { saveErrorMessage };
