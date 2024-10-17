export function getElements(basis, elements) {
    [...basis.querySelectorAll('[data-element]')].forEach((element) => {
        if (element instanceof HTMLElement) {
            elements[element.dataset.element] = element;
        }
    });
}
export const _ = () => { };
export function sortBy(comments) {
    const sortAttribute = localStorage.getItem('sort');
    switch (sortAttribute) {
        case 'date':
            return comments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'relevance':
            return comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        case 'rating':
            return comments.sort((a, b) => b.rating - a.rating);
        case 'replies':
            const storageComments = [...JSON.parse(localStorage.getItem('comments'))];
            const parentWithReplyCount = comments.map((comment) => {
                const replyCount = storageComments.filter((item) => item.parent === comment.username).length;
                return Object.assign(Object.assign({}, comment), { replyCount });
            });
            return parentWithReplyCount.sort((a, b) => b.replyCount - a.replyCount);
    }
}
