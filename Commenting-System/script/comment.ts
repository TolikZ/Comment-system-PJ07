import { ElementsType, getElements, _ } from './sortBy.js';
import { UserType } from './request.js';
import { CommentForm } from './commentForm.js';

enum Elements {
  avatar = 'avatar',
  name = 'name',
  parent = 'parent',
  parentName = 'parentName',
  date = 'date',
  comment = 'comment',
  favorite = 'favorite',
  rating = 'rating',
  reply = 'reply',
  replies = 'replies',
  minus = 'minus',
  plus = 'plus',
  commentForm = 'commentForm',
}

export type ParentComment = {
  comment: string;
  date: Date;
  favorite: boolean;
  rating: number;
  plus: boolean;
  minus: boolean;
  replies?: ChildComment[];
  parent?: never;
} & UserType;

export type ChildComment = {
  comment: string;
  date: Date;
  favorite: boolean;
  rating: number;
  plus: boolean;
  minus: boolean;
  parent: string;
  replies?: never;
} & UserType;

export type CommentType = ParentComment | ChildComment;

export class Comment {
  private _comment: HTMLElement;
  private readonly _elements: ElementsType = {};
  private readonly _newComment: CommentType;
  private _repliesData: ChildComment[];

  private readonly _updateComments: () => void;
  private readonly _patchCommentData: (data: CommentType) => void;
  private readonly _showFavoriteComments: () => void;

  private _innerComment = `
    <div class="comments__container">
      <div class="comments__info">
        <img alt="commenter avatar" class="avatar" data-element="${Elements.avatar}">
        <p class="comment__name" data-element="${Elements.name}"></p>
        <div class="reply-target" data-element="${Elements.parent}">
          <img class="reply-target__icon" src="./images/arrow-reply.svg" alt="arrow answer">
          <p class="reply-target__name" data-element="${Elements.parentName}"></p>
        </div>
        <p class="comments__date" data-element="${Elements.date}"></p>
      </div>
        <p class="comment__text" data-element="${Elements.comment}"></p>
        <div class="reply">
          <button class="reply__btn" data-element="${Elements.reply}">
            <img src="./images/arrow-reply.svg" alt="arrow reply"> Ответить
          </button>
          <button class="favorite" data-element="${Elements.favorite}"></button>
          <div class="rating">
            <div class="rating__btn rating__btn-minus" data-element="${Elements.minus}">
              -
            </div>
            <p data-element="${Elements.rating}"></p>
            <div class="rating__btn rating__btn-plus" data-element="${Elements.plus}">
              +
            </div>
          </div>
      </div>
    </div>
  `;

  constructor(
    comment: HTMLElement,
    username: string,
    updateComments: () => void,
    patchCommentData: (data: CommentType) => void,
    showFavoriteComments: () => void
  ) {
    this._comment = comment;
    const storageComments = [...JSON.parse(localStorage.getItem('comments') as string)];
    this._newComment = storageComments.find((item: CommentType) => item.username === username);
    this._repliesData = storageComments.filter(
      (item: CommentType) => item.parent === this._newComment.username
    );

    this._updateComments = updateComments;
    this._showFavoriteComments = showFavoriteComments;
    this._patchCommentData = patchCommentData;
    this.output();
  }

  output() {
    this._comment.innerHTML = this._innerComment;
    getElements(this._comment, this._elements);
    this.configureComment();
    this.addListeners();
    if (this._repliesData.length) {
      this._comment.insertAdjacentHTML(
        'beforeend',
        `<div class="comments__replies" data-element="${Elements.replies}"></div>`
      );
      this._elements[Elements.replies] = this._comment.querySelector(
        `[data-element=${Elements.replies}]`
      ) as HTMLElement;
      this.renderReplies();
    }
  }

  renderReplies = () => {
    const replies = this._elements[Elements.replies] as HTMLElement;
    this._repliesData.forEach((reply) => {
      const currentElement = replies.querySelector(`[data-username="${reply.username}"]`);

      if (!currentElement) {
        const element = document.createElement('div');
        element.classList.add('reply__wrapper');
        element.dataset.username = reply.username;
        replies.appendChild(element);
        new Comment(
          element,
          reply.username,
          this._updateComments,
          this._patchCommentData,
          this._showFavoriteComments
        );
      }
    });
  };

  configureComment() {
    const avatar = this._elements[Elements.avatar] as HTMLImageElement;
    const name = this._elements[Elements.name] as HTMLParagraphElement;
    const comment = this._elements[Elements.comment] as HTMLParagraphElement;
    const date = this._elements[Elements.date] as HTMLDataElement;
    const rating = this._elements[Elements.rating] as HTMLDivElement;

    const parent = this._elements[Elements.parent] as HTMLDivElement;
    const parentName = this._elements[Elements.parentName] as HTMLParagraphElement;
    const reply = this._elements[Elements.reply] as HTMLButtonElement;
    const isParent = this._newComment.parent;

    avatar.setAttribute('src', this._newComment.avatar);
    name.innerHTML = this._newComment.name;
    comment.innerHTML = this._newComment.comment;
    date.innerHTML = new Date(this._newComment.date)
      .toLocaleString('ru-Ru', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ' ');

    this.updateFavoriteButton();

    rating.innerHTML = `${this._newComment.rating}`;
    if (this._newComment.rating < 0) {
      rating.classList.add('rating__minus');
    } else {
      rating.classList.add('rating__plus');
    }

    if (!isParent) {
      parent?.remove();
      delete this._elements[Elements.parent];
    } else {
      const parentData: CommentType | undefined = [
        ...JSON.parse(localStorage.getItem('comments') as string),
      ].find((item: CommentType) => item.username === this._newComment.parent);

      if (parentData) {
        parentName.innerHTML = parentData.name;
        reply?.remove();
      }
    }
  }

  addListeners() {
    const reply = this._elements[Elements.reply] as HTMLButtonElement;
    const minus = this._elements[Elements.minus] as HTMLDivElement;
    const plus = this._elements[Elements.plus] as HTMLDivElement;
    const favorite = this._elements[Elements.favorite] as HTMLButtonElement;

    reply.addEventListener('click', this.onReply);
    minus.addEventListener('click', this.onMinus);
    plus.addEventListener('click', this.onPlus);
    favorite.addEventListener('click', this.onFavorite);
  }

  onReply = () => {
    if (!this._elements[Elements.replies]) {
      this._comment.insertAdjacentHTML(
        'beforeend',
        `<div class="comments__replies" data-element="replies"></div>`
      );
      this._elements[Elements.replies] = this._comment.querySelector(
        `[data-element="${Elements.replies}"]`
      ) as HTMLElement;
    }

    const replies = this._elements[Elements.replies] as HTMLElement;
    const currentForm: CommentForm | null = null;

    if (!currentForm) {
      replies.insertAdjacentHTML(
        'afterbegin',
        `<div class="comment__form comment__form_reply" data-element="${Elements.commentForm}"></div>`
      );
      getElements(this._comment, this._elements);

      const formReply = this._elements[Elements.commentForm] as HTMLFormElement;
      new CommentForm(formReply, this.updateReplies, _, this._newComment);
    }
  };

  onMinus = () => {
    if (this._newComment.minus && !this._newComment.plus) {
      this._newComment.rating--;
      this._newComment.plus = true;
    } else if (this._newComment.minus) {
      this._newComment.rating--;
      this._newComment.minus = false;
    }
    this._patchCommentData(this._newComment);
    this._updateComments();
  };

  onPlus = () => {
    if (!this._newComment.minus && this._newComment.plus) {
      this._newComment.rating++;
      this._newComment.minus = true;
    } else if (this._newComment.plus) {
      this._newComment.rating++;
      this._newComment.plus = false;
    }
    this._patchCommentData(this._newComment);
    this._updateComments();
  };

  onFavorite = () => {
    this._newComment.favorite = !this._newComment.favorite;
    this.updateFavoriteButton();

    const favorites = JSON.parse(localStorage.getItem('favorite') as string).filter(
      (comment: CommentType) => comment.username !== this._newComment.username
    );

    if (this._newComment.favorite) {
      favorites.push(this._newComment);
    }

    localStorage.setItem('favorite', JSON.stringify(favorites));

    this._patchCommentData(this._newComment);
    this._showFavoriteComments();
  };

  updateFavoriteButton() {
    const favoriteButton = this._elements[Elements.favorite] as HTMLButtonElement;
    favoriteButton.innerHTML = this._newComment.favorite
      ? `<img src="./images/heart-solid.svg" alt="completed heart"> В избранном`
      : `<img src="./images/heart.svg" alt="empty heart"> В избранное`;
  }

  updateReplies = () => {
    const storageComments = [...JSON.parse(localStorage.getItem('comments') as string)];
    this._repliesData = storageComments.filter(
      (item: CommentType) => item.parent === this._newComment.username
    );
    this._elements[Elements.commentForm].remove();
    this.renderReplies();
    this._updateComments();
  };
}