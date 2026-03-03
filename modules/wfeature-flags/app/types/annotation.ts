export interface FlagAnnotation {
  id: string;
  flagKey: string;
  type: AnnotationType;
  content: string;
  author: AnnotationAuthor;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isResolved: boolean;
  replies: AnnotationReply[];
}

export type AnnotationType = 'note' | 'warning' | 'todo' | 'question' | 'decision';

export interface AnnotationAuthor {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface AnnotationReply {
  id: string;
  content: string;
  author: AnnotationAuthor;
  createdAt: number;
}

export interface AnnotationFilter {
  flagKey?: string;
  type?: AnnotationType[];
  author?: string;
  isPinned?: boolean;
  isResolved?: boolean;
}

export interface AnnotationStats {
  total: number;
  byType: Record<AnnotationType, number>;
  unresolved: number;
  pinned: number;
}
