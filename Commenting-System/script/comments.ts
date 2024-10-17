import { ElementsType, getElements, sortBy } from './sortBy.js';
import { Comment, CommentType } from './comment.js';

export class Comments {
  private readonly _comments: HTMLElement;
  private readonly _elements: ElementsType = {};
  private _commentContent: CommentType[];

  constructor(comments: HTMLElement) {
    this._comments = comments;
    this._commentContent = JSON.parse(localStorage.getItem('comments') as string);

    this.output();
  }

  output() {
    if (!this._commentContent) return;

    const parentComments = this._commentContent.filter((item) => !item.parent);
    this.renderComments(sortBy(parentComments)!);
    this.loadingAnimation();
  }

  private loadingAnimation() {
    document.addEventListener('DOMContentLoaded', () =>
      this._comments.classList.add('comments')
    );
  }

  updateComments = () => {
    this._commentContent = JSON.parse(localStorage.getItem('comments') as string);
    localStorage.setItem('favoriteState', 'false');
    this.output();
  };

  showFavoriteComments = () => {
    const isFavoriteState = localStorage.getItem('favoriteState') === 'true';

    if (isFavoriteState) {
      const favoriteComments: CommentType[] = JSON.parse(
        localStorage.getItem('favorite') as string
      );

      this.renderComments(favoriteComments);
    } else {
      this._commentContent = JSON.parse(localStorage.getItem('comments') as string);
    }
  };

  private renderComments(comments: CommentType[]) {
    this._comments.innerHTML = comments
      .map((comment) => `<div class="comments__wrapper" data-element="${comment.username}"></div>`)
      .join('');
    getElements(this._comments, this._elements);

    Object.entries(this._elements).forEach(([id, element]) => {
      new Comment(
        element,
        id,
        this.updateComments,
        this.patchCommentData,
        this.showFavoriteComments
      );
    });
  }

  patchCommentData = (data: CommentType) => {
    this._commentContent = JSON.parse(localStorage.getItem('comments') as string);
    const patchedData = this._commentContent.map((comment) =>
      comment.username === data.username ? data : comment
    );
    localStorage.setItem('comments', JSON.stringify(patchedData));
  };
}