export interface HealthView {
  status: "ok";
  database: "up";
  uptime: number;
  timestamp: string;
}
