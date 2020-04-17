// DOM elements
const guideList = document.querySelector('.guides');
const guideLists = document.querySelector('.guidess');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');


// set up history
// const setupHistory = (data) => {

//   if (data.length) {
//     let html = '';
//     data.forEach(doc => {
//       const history = doc.data();
//       const li = `
//         <li>
//           <div class="collapsible-header grey lighten-4"> ${history.tag_num} </div> 
//           <div class="collapsible-body white"> <label for="tag_num" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Software: </label> ${history.owner} </div>
//           <div class="collapsible-body white"> <label for="tag_num" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Tag Number : </label> ${history.laptop_v} </div>
//           <div class="collapsible-body white"> <label for="license_key" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">License Key : </label> ${history.problem} </div>
//           <div class="collapsible-body white">  <label for="exp_date" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Expiration Date: </label> ${history.repairman} </div>
//           <div class="collapsible-body white">  <label for="exp_date" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Expiration Date: </label> ${history.date_in} </div>
//           <div class="collapsible-body white">  <label for="exp_date" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Expiration Date: </label> ${history.date_out} </div>
//         </li>
//       `;
//       htmk += li;
//     });
//     historyList.innerHTML = html;
//   } else {
//     historyList.innerHTML = '<h3 class="center-align" style="color:white; margin:90px;">Error</h3>';
//   }
  

// };


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
const setupGuides = (user, data) => {
  if (data.length) {
    let html = '';
    var dataArray = [];
    data.forEach(doc => {
      const guide = { id: doc.id, ...doc.data() };
      dataArray.push(guide)
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${guide.software} </div>  
          <div class="collapsible-body white"> <label for="tag_num" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Tag Number : </label> ${guide.tag_num} </div>
          <div class="collapsible-body white"> <label for="license_key" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">License Key : </label> ${guide.license_key} </div>
          <div class="collapsible-body white">  <label for="exp_date" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Expiration Date: </label> ${guide.exp_date} </div>
        </li>
      `;
      html += li;
    });

    var groupedGuides = _.groupBy(dataArray, (guide) => {
      return guide.software;
    });

    let guidenNames = Object.keys(groupedGuides)
    let tableHtml = ''
    guidenNames.forEach(software => {
      const li = `
      <li>
      <div class="collapsible-header grey lighten-4">${software}</div>
      <div class="collapsible-body white">
        <table id="${software.replace(/ /g, '')}">
        <input type="text" id="search${software.replace(/ /g, '')}" onkeyup="search(${software.replace(/ /g, '')})" placeholder="Search..." title="Type in a name">
     
        <thead>
          <tr>
            <th>Name</th>
            <th>License Key</th>
            <th>Tag Number</th>
            <th>Expiration Date</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          ${getTable(user.admin, groupedGuides[software])}
          </tbody>
        </table>
      </div>
    </li>
      `;
      tableHtml += li;
    });
    guideLists.innerHTML = tableHtml;
    //guideList.innerHTML = html;
  } else {
    //guideList.innerHTML = ;
    guideLists.innerHTML = '<h3 class="center-align" style="color:white; margin:90px;">Login to view data</h3>';
  }


};


const getTable = (isAdmin, rows) => {
  let rowHtml = ''
  rows.forEach(row => {
    let rHrml = `<tr>
           <td>${row.name}</td>
           <td>${row.license_key}</td>
           <td>${row.tag_num}</td>
           <td>${row.exp_date}</td>
           ${showDelete(row, isAdmin)}
          </tr>`

    rowHtml += rHrml
  })
  return rowHtml

}

const showDelete = (row, isAdmin) => {
  if (isAdmin) {
    return '<td> <button onclick=deleteRow(\'' + row.id + '\')>Delete</button></td>';
  } else {
    return ``
  }
}

const deleteRow = (rowId) => {
  db.collection('guides').doc(rowId).delete();
}

const search = (table) => {
  console.log(table)
  let input, filter, tr, td, i, txtValue;
  input = document.getElementById("search" + table.id);
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      console.log(td)
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});