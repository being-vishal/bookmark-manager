const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
const profilePhoto = document.getElementById('profile-photo');
const logOutBtn = document.getElementById('log-out-btn');

var userInfo = {};

const signOut = () => {
    auth.signOut()
    .then(() => {
      alert(`Click OK to LOG out successfully! & buh byee! See you later ${userInfo.displayName}  >_<`);
      location = "index.html";
    }).catch((error) => {
      console.log(error);
    });
}
logOutBtn.addEventListener('click',signOut);


auth.onAuthStateChanged(user => {
    if (user) {
        userInfo = user;
        profilePhoto.setAttribute("src",`${user.photoURL}`);
    } else {
        location = "index.html";
    }
});


// Toggle Modal 
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


// Handle Data entered in form
let date = new Date();
let time = date.getTime();
let counter = time;
function storeBookmark(e) {
    e.preventDefault();
    let websiteName = websiteNameEl.value;
    let websiteURL = websiteUrlEl.value;
    if (!websiteName || !websiteURL) {
        alert('Please Submit values for both fields.');
        return false;
    }

    let id = counter += 1;
    auth.onAuthStateChanged(user => {
        if (user) {
            fs.collection(user.uid).doc('_' + id).set({
                id: '_' + id,
                websiteName, 
                websiteURL
            }).then(() => {
                console.log('bookmark added');
            }).catch(err => {
                console.log(err.message);
            })
        }
        else {
            alert('Oops! it seems you have been logged out. Please sign in again.');
            location:"index.html";
        }
    })
    bookmarkForm.reset();
    closeModal();
}


//Delete Bookmarks(
function deleteBookmark(e){
    let id = e.target.parentElement.parentElement.getAttribute('data-id');
    auth.onAuthStateChanged(user => {
        if (user) {
            fs.collection(user.uid).doc(id).delete();
        }
    })
}
    

function buildBookmarks(bookmark){
    const name = bookmark.data().websiteName;
    const url = bookmark.data().websiteURL;
    const id = bookmark.id;
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    item.setAttribute('data-id', id);
    // Trash Icon
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fas' , 'fa-trash-alt');
    trashIcon.setAttribute('title' , 'Delete Bookmark');
    trashIcon.addEventListener('click', e => {
        let id = e.target.parentElement.getAttribute('data-id');
        auth.onAuthStateChanged(user => {
            if (user) {
              fs.collection(user.uid).doc(id).delete();
           }
        })
    })
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
    item.append(trashIcon,linkInfo);
    bookmarksContainer.appendChild(item);

}


// Submit Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);


// realtime listners
auth.onAuthStateChanged(user => {
    if (user) {
        fs.collection(user.uid).onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == "added") {
                    buildBookmarks(change.doc);
                }
                else if (change.type == 'removed') {
                    let li = bookmarksContainer.querySelector('[data-id=' + change.doc.id + ']');
                    bookmarksContainer.removeChild(li);
                }
            })
        })
    }
})


//Dark Mode       
const toggleSwitch = document.querySelector('input[type = "checkbox"]');
const toggleIcon =  document.getElementById('toggle-icon');
//Switch Theme
function switchTheme(event){
   if(event.target.checked){
       document.documentElement.setAttribute('data-theme' , 'dark');
       localStorage.setItem('theme' , 'dark');
       toggleIcon.children[0].classList.replace('fa-sun' , 'fa-moon');
   }else{
       document.documentElement.setAttribute('data-theme' , 'light');
       localStorage.setItem('theme' , 'light');
       toggleIcon.children[0].classList.replace('fa-moon','fa-sun');
   }
}
// Checkbox Event listener
toggleSwitch.addEventListener('change' , switchTheme);
//Check Local Storage for theme
const currentTheme = localStorage.getItem('theme'); 
if(currentTheme){
    document.documentElement.setAttribute('data-theme' , currentTheme);
    if(currentTheme === 'dark'){
        toggleSwitch.checked = true;
        toggleIcon.children[0].classList.replace('fa-sun' , 'fa-moon');
    }
}