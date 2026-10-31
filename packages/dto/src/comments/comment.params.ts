export const MAX_COMMENT_LENGTH = 200;
export const DEFAULT_COMMENT_PAGE_SIZE = 20;
export const MAX_COMMENT_PAGE_SIZE = 50;

export interface ListCommentsParams {
  cursor?: string;
  limit?: number;
}

export interface CreateCommentParams {
  text: string;
}

export type CreateReplyParams = CreateCommentParams;
