import { isApiError } from "@repo/sdk";

function loginErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 401) {
      return "Kata sandi salah";
    }
    if (error.status === 429) {
      return "Terlalu banyak percobaan, coba lagi sebentar";
    }
    if (error.status === 0) {
      return "Tidak bisa terhubung ke server";
    }
  }
  return "Gagal masuk, coba lagi";
}

export { loginErrorMessage };
