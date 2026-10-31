import type { UploaderView } from "../fragments/fragment.view.js";

export interface ReplyView {
  id: string;
  text: string;
  createdAt: string;
  author: UploaderView;
}

export interface CommentView {
  id: string;
  text: string;
  createdAt: string;
  replies: ReplyView[];
}

export interface CommentPage {
  items: CommentView[];
  nextCursor: string | null;
}
