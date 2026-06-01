export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  order: number;
  createdAt: Date;
}
