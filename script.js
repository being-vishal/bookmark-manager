const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal 
function showModal() {
    modal.classList.add('show-modal');
    // Focus on first input in the form   
    websiteNameEl.focus();
}

function closeModal() {
    modal.classList.remove('show-modal');
}


// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


//Fetch Bookmarks
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'Vishal Shinde',
                url: 'https://being-vishal.github.io/vishals-website/',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}


// Handle Data entered in form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!nameValue || !urlValue) {
        alert('Please Submit values for both fields.');
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
    closeModal();
}


//Delete Bookmarks(
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i,1);  
        } 
    });
    //Update bookmarks array
    localStorage.setItem('bookmarks' , JSON.stringify(bookmarks) );
    fetchBookmarks();
}


// Build Bookmarks DOM
function buildBookmarks(){
    //Remove all Bookmarks 
    bookmarksContainer.textContent = '';
    // Build Items
    bookmarks.forEach((bookmark) => {
        const { name , url}=bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Trash Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas' , 'fa-trash-alt');
        closeIcon.setAttribute('title' , 'Delete Bookmark');
        closeIcon.setAttribute('onclick' , `deleteBookmark('${url}')`);
        // Favicon Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src' , `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt' , 'Logo');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href' , `${url}`);
        link.setAttribute('target' ,'_blank' );
        link.textContent= name;

        //Append everything in a container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}


// Submit Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);


// On load fetch bookmarks
fetchBookmarks();