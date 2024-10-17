import { CommentType } from './comment.js';

export interface ElementsType {
  [key: string]: HTMLElement;
}

export function getElements(basis: HTMLElement, elements: ElementsType) {
  [...basis.querySelectorAll('[data-element]')].forEach((element: Element) => {
    if (element instanceof HTMLElement) {
      elements[element.dataset.element as keyof typeof elements] = element;
    }
  });
}

export const _ = () => { };

export function sortBy(comments: CommentType[]) {
  const sortAttribute = localStorage.getItem('sort');

  switch (sortAttribute) {
    case 'date':
      return comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    case 'relevance':
      return comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    case 'rating':
      return comments.sort((a, b) => b.rating - a.rating);

    case 'replies':
      const storageComments = [...JSON.parse(localStorage.getItem('comments') as string)];
      const parentWithReplyCount = comments.map((comment) => {
        const replyCount = storageComments.filter((item) => item.parent === comment.username).length;
        return { ...comment, replyCount };
      });
      return parentWithReplyCount.sort((a, b) => b.replyCount - a.replyCount);
  }
}