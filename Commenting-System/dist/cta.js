import { getElements } from './sortBy.js';
var Elements;
(function (Elements) {
    Elements["commentsFilter"] = "commentsFilter";
    Elements["counter"] = "counter";
    Elements["selectButton"] = "selectButton";
    Elements["selectDropdown"] = "selectDropdown";
    Elements["favoriteFilter"] = "favoriteFilter";
})(Elements || (Elements = {}));
export class CallToAction {
    constructor(cta, updateComments, showFavoriteComments) {
        this._elements = {};
        this._selectData = [
            { key: 'date', value: 'По дате' },
            { key: 'rating', value: 'По количеству оценок' },
            { key: 'relevance', value: 'По актуальности' },
            { key: 'replies', value: 'По количеству ответов' },
        ];
        this._selectFavorite = `
    <button class="comment__cta-btn-count active" data-element="${Elements.commentsFilter}">
      Комментарии <span data-element="${Elements.counter}"></span>
    </button>
    <div class="select-favorite">
      <div class="select">
        <button class="select__btn" data-element="${Elements.selectButton}">
          <span>По дате</span> <img src="./images/arrow-select.svg" alt="arrow select">
        </button>
        <ul class="select__dropdown hide"
        data-element="${Elements.selectDropdown}">
          ${this._selectData
            .map((item) => `<li class="select__option" value="${item.key}"><img src="./images/checkbox.svg" alt="checkbox"> ${item.value}</li>`)
            .join('')}
        </ul>
      </div>
      <button class="favorite" data-element="${Elements.favoriteFilter}">
        <span>Избранное</span> <img src="./images/favorite-heart.svg" alt="favorite heart">
      </button>
    </div>
  `;
        this.onSelectButton = () => {
            const button = this._elements[Elements.selectButton];
            const icon = button.lastElementChild;
            const dropdown = this._elements[Elements.selectDropdown];
            icon.classList.toggle('rotate');
            dropdown.classList.toggle('hide');
        };
        this.onSelectDropdown = (event) => {
            const button = this._elements[Elements.selectButton];
            const dropdown = this._elements[Elements.selectDropdown];
            if (event.target instanceof HTMLElement) {
                const listItem = event.target.closest('li');
                if (listItem) {
                    const favoriteFilter = this._elements[Elements.favoriteFilter];
                    const commentsFilter = this._elements[Elements.commentsFilter];
                    commentsFilter.classList.add('active');
                    favoriteFilter.classList.remove('active');
                    const sortType = listItem.getAttribute('value');
                    const sortTypeLabel = this._selectData.find((item) => item.key === sortType);
                    localStorage.setItem('sort', sortType);
                    button.innerHTML = `<span>${sortTypeLabel === null || sortTypeLabel === void 0 ? void 0 : sortTypeLabel.value}</span> <img src="./images/arrow-select.svg" alt="arrow select">`;
                    const ListItems = dropdown.querySelectorAll('li');
                    ListItems.forEach((item) => {
                        const checkMark = item.querySelector('img');
                        checkMark.style.visibility = 'hidden';
                    });
                    const checkMark = listItem.querySelector('img');
                    checkMark.style.visibility = 'visible';
                }
            }
            dropdown.classList.toggle('hide');
            this._updateComments();
        };
        this._cta = cta;
        this._updateComments = updateComments;
        this._showFavoriteComments = showFavoriteComments;
        this.output();
    }
    output() {
        this._cta.innerHTML = this._selectFavorite;
        getElements(this._cta, this._elements);
        this.updateCounter();
        this.addListeners();
        const defaultSort = localStorage.getItem('sort');
        const defaultListItem = this._elements[Elements.selectDropdown].querySelector(`li [value="${defaultSort}"] img`);
        if (defaultListItem) {
            defaultListItem.style.visibility = 'visible';
        }
    }
    updateCounter() {
        const counter = this._elements[Elements.counter];
        const commentsCounter = JSON.parse(localStorage.getItem('comments')).filter((item) => !item.parent).length;
        counter.innerHTML = `(${commentsCounter})`;
    }
    addListeners() {
        const selectButton = this._elements[Elements.selectButton];
        const selectDropdown = this._elements[Elements.selectDropdown];
        const favoriteFilter = this._elements[Elements.favoriteFilter];
        const commentsFilter = this._elements[Elements.commentsFilter];
        selectButton.addEventListener('click', this.onSelectButton);
        selectDropdown.addEventListener('click', this.onSelectDropdown);
        favoriteFilter.addEventListener('click', () => {
            favoriteFilter.classList.add('active');
            commentsFilter.classList.remove('active');
            localStorage.setItem('favoriteState', 'true');
            this._showFavoriteComments();
        });
        commentsFilter.addEventListener('click', () => {
            commentsFilter.classList.add('active');
            favoriteFilter.classList.remove('active');
            this._updateComments();
        });
    }
}
