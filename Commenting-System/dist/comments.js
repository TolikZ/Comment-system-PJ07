import { getElements, sortBy } from './sortBy.js';
import { Comment } from './comment.js';
export class Comments {
    constructor(comments) {
        this._elements = {};
        this.updateComments = () => {
            this._commentContent = JSON.parse(localStorage.getItem('comments'));
            localStorage.setItem('favoriteState', 'false');
            this.output();
        };
        this.showFavoriteComments = () => {
            const isFavoriteState = localStorage.getItem('favoriteState') === 'true';
            if (isFavoriteState) {
                const favoriteComments = JSON.parse(localStorage.getItem('favorite'));
                this.renderComments(favoriteComments);
            }
            else {
                this._commentContent = JSON.parse(localStorage.getItem('comments'));
            }
        };
        this.patchCommentData = (data) => {
            this._commentContent = JSON.parse(localStorage.getItem('comments'));
            const patchedData = this._commentContent.map((comment) => comment.username === data.username ? data : comment);
            localStorage.setItem('comments', JSON.stringify(patchedData));
        };
        this._comments = comments;
        this._commentContent = JSON.parse(localStorage.getItem('comments'));
        this.output();
    }
    output() {
        if (!this._commentContent)
            return;
        const parentComments = this._commentContent.filter((item) => !item.parent);
        this.renderComments(sortBy(parentComments));
        this.loadingAnimation();
    }
    loadingAnimation() {
        document.addEventListener('DOMContentLoaded', () => this._comments.classList.add('comments'));
    }
    renderComments(comments) {
        this._comments.innerHTML = comments
            .map((comment) => `<div class="comments__wrapper" data-element="${comment.username}"></div>`)
            .join('');
        getElements(this._comments, this._elements);
        Object.entries(this._elements).forEach(([id, element]) => {
            new Comment(element, id, this.updateComments, this.patchCommentData, this.showFavoriteComments);
        });
    }
}
