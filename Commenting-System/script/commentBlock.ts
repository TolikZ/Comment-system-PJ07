import { ElementsType, getElements } from './sortBy.js';
import { CallToAction } from './cta.js';
import { CommentForm } from './commentForm.js';
import { Comments } from './comments.js';

enum Elements {
  cta = 'cta',
  commentForm = 'commentForm',
  comments = 'comments',
}

export class CommentBlock {
  private readonly _commentBlock: HTMLElement;
  private readonly _elements: ElementsType = {};

  private _cta!: CallToAction;
  private _comments!: Comments;

  private _innerCommentBlock = `
    <div class="comment__cta" data-element="${Elements.cta}"></div>
    <div class="comment__form" data-element="${Elements.commentForm}"></div>
    <div data-element="${Elements.comments}"></div>
  `;

  constructor(commentBlock: HTMLElement) {
    this._commentBlock = commentBlock;

    this.output();
  }

  public output() {
    this._commentBlock.innerHTML = this._innerCommentBlock;
    getElements(this._commentBlock, this._elements);

    if (!localStorage.getItem('comments')) localStorage.setItem('comments', '[]');
    localStorage.setItem('sort', 'date');
    if (!localStorage.getItem('favorite')) localStorage.setItem('favorite', '[]');
    localStorage.setItem('favoriteState', 'false');

    this._cta = new CallToAction(
      this._elements[Elements.cta],
      this.updateComments,
      this.showFavoriteComments
    );
    new CommentForm(this._elements[Elements.commentForm], this.updateComments, this.updateCounter);
    this._comments = new Comments(this._elements[Elements.comments]);
  }

  updateCounter = () => {
    this._cta.updateCounter();
  };

  updateComments = () => {
    this._comments.updateComments();
  };

  showFavoriteComments = () => {
    this._comments.showFavoriteComments();
  };
}