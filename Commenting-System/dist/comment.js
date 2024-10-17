import { getElements, _ } from './sortBy.js';
import { CommentForm } from './commentForm.js';
var Elements;
(function (Elements) {
    Elements["avatar"] = "avatar";
    Elements["name"] = "name";
    Elements["parent"] = "parent";
    Elements["parentName"] = "parentName";
    Elements["date"] = "date";
    Elements["comment"] = "comment";
    Elements["favorite"] = "favorite";
    Elements["rating"] = "rating";
    Elements["reply"] = "reply";
    Elements["replies"] = "replies";
    Elements["minus"] = "minus";
    Elements["plus"] = "plus";
    Elements["commentForm"] = "commentForm";
})(Elements || (Elements = {}));
export class Comment {
    constructor(comment, username, updateComments, patchCommentData, showFavoriteComments) {
        this._elements = {};
        this._innerComment = `
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
        this.renderReplies = () => {
            const replies = this._elements[Elements.replies];
            this._repliesData.forEach((reply) => {
                const currentElement = replies.querySelector(`[data-username="${reply.username}"]`);
                if (!currentElement) {
                    const element = document.createElement('div');
                    element.classList.add('reply__wrapper');
                    element.dataset.username = reply.username;
                    replies.appendChild(element);
                    new Comment(element, reply.username, this._updateComments, this._patchCommentData, this._showFavoriteComments);
                }
            });
        };
        this.onReply = () => {
            if (!this._elements[Elements.replies]) {
                this._comment.insertAdjacentHTML('beforeend', `<div class="comments__replies" data-element="replies"></div>`);
                this._elements[Elements.replies] = this._comment.querySelector(`[data-element="${Elements.replies}"]`);
            }
            const replies = this._elements[Elements.replies];
            const currentForm = null;
            if (!currentForm) {
                replies.insertAdjacentHTML('afterbegin', `<div class="comment__form comment__form_reply" data-element="${Elements.commentForm}"></div>`);
                getElements(this._comment, this._elements);
                const formReply = this._elements[Elements.commentForm];
                new CommentForm(formReply, this.updateReplies, _, this._newComment);
            }
        };
        this.onMinus = () => {
            if (this._newComment.minus && !this._newComment.plus) {
                this._newComment.rating--;
                this._newComment.plus = true;
            }
            else if (this._newComment.minus) {
                this._newComment.rating--;
                this._newComment.minus = false;
            }
            this._patchCommentData(this._newComment);
            this._updateComments();
        };
        this.onPlus = () => {
            if (!this._newComment.minus && this._newComment.plus) {
                this._newComment.rating++;
                this._newComment.minus = true;
            }
            else if (this._newComment.plus) {
                this._newComment.rating++;
                this._newComment.plus = false;
            }
            this._patchCommentData(this._newComment);
            this._updateComments();
        };
        this.onFavorite = () => {
            this._newComment.favorite = !this._newComment.favorite;
            this.updateFavoriteButton();
            const favorites = JSON.parse(localStorage.getItem('favorite')).filter((comment) => comment.username !== this._newComment.username);
            if (this._newComment.favorite) {
                favorites.push(this._newComment);
            }
            localStorage.setItem('favorite', JSON.stringify(favorites));
            this._patchCommentData(this._newComment);
            this._showFavoriteComments();
        };
        this.updateReplies = () => {
            const storageComments = [...JSON.parse(localStorage.getItem('comments'))];
            this._repliesData = storageComments.filter((item) => item.parent === this._newComment.username);
            this._elements[Elements.commentForm].remove();
            this.renderReplies();
            this._updateComments();
        };
        this._comment = comment;
        const storageComments = [...JSON.parse(localStorage.getItem('comments'))];
        this._newComment = storageComments.find((item) => item.username === username);
        this._repliesData = storageComments.filter((item) => item.parent === this._newComment.username);
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
            this._comment.insertAdjacentHTML('beforeend', `<div class="comments__replies" data-element="${Elements.replies}"></div>`);
            this._elements[Elements.replies] = this._comment.querySelector(`[data-element=${Elements.replies}]`);
            this.renderReplies();
        }
    }
    configureComment() {
        const avatar = this._elements[Elements.avatar];
        const name = this._elements[Elements.name];
        const comment = this._elements[Elements.comment];
        const date = this._elements[Elements.date];
        const rating = this._elements[Elements.rating];
        const parent = this._elements[Elements.parent];
        const parentName = this._elements[Elements.parentName];
        const reply = this._elements[Elements.reply];
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
        }
        else {
            rating.classList.add('rating__plus');
        }
        if (!isParent) {
            parent === null || parent === void 0 ? void 0 : parent.remove();
            delete this._elements[Elements.parent];
        }
        else {
            const parentData = [
                ...JSON.parse(localStorage.getItem('comments')),
            ].find((item) => item.username === this._newComment.parent);
            if (parentData) {
                parentName.innerHTML = parentData.name;
                reply === null || reply === void 0 ? void 0 : reply.remove();
            }
        }
    }
    addListeners() {
        const reply = this._elements[Elements.reply];
        const minus = this._elements[Elements.minus];
        const plus = this._elements[Elements.plus];
        const favorite = this._elements[Elements.favorite];
        reply.addEventListener('click', this.onReply);
        minus.addEventListener('click', this.onMinus);
        plus.addEventListener('click', this.onPlus);
        favorite.addEventListener('click', this.onFavorite);
    }
    updateFavoriteButton() {
        const favoriteButton = this._elements[Elements.favorite];
        favoriteButton.innerHTML = this._newComment.favorite
            ? `<img src="./images/heart-solid.svg" alt="completed heart"> В избранном`
            : `<img src="./images/heart.svg" alt="empty heart"> В избранное`;
    }
}
