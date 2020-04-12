// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details'); 
const adminItems = document.querySelectorAll('.admin');


const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="blue-text">${user.admin ? 'Admin' : ''}</div>
      `;
      accountDetails.innerHTML = html;
    });
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    adminItems.forEach(item => item.style.display = 'none');
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    adminItems.forEach(item => item.style.display = 'none');
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// setup data
const setupGuides = (data) => {

  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${guide.name} </div>  
          <div class="collapsible-body white"> <label for="tag_num" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Tag Number : </label> ${guide.tag_num} </div>
          <div class="collapsible-body white"> <label for="license_key" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">License Key : </label> ${guide.license_key} </div>
          <div class="collapsible-body white">  <label for="exp_date" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Expiration Date: </label> ${guide.exp_date} </div>
        </li>
      `;
      html += li;
    });
    guideList.innerHTML = html
  } else {
    guideList.innerHTML = '<h3 class="center-align" style="color:white; margin:90px;">Login to view data</h3>';
  }
  

};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});