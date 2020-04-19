// DOM elements
const guideList = document.querySelector('.guides');
const guideLists = document.querySelector('.guidess');
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
const setupGuides = (user, data) => {
  console.log(data)
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
        <input type="text" id="search${software.replace(/ /g, '')}" onkeyup="search(${software.replace(/ /g, '')})" placeholder="Search" title="Type in a name">
     
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


const setupMaintenance = (user, data) => {
  console.log(user)
  console.log(data)
  if (data.length) {
    let html = '';
    var dataArray = [];
    data.forEach(doc => {
      const maintenance = { id: doc.id, ...doc.data() };
      dataArray.push(maintenance)
      const li = `
        <li>
        <div class="collapsible-header grey lighten-4">${maintenance.tag_num}</div>
        <div class="collapsible-body white">
          <table>
         
          <thead>
            <tr>
              <th>Owner</th>
              <th>Asset Number</th>
              <th>Repairman</th>
              <th>Laptop Version</th>
              <th>Problem</th>
              <th>Date In</th>
              <th>Date Out</th>
              <th></th>
          
              </tr>
            </thead>
            <tbody>
            <tr>
           <td>${maintenance.owner}</td>
           <td>${maintenance.tag_num}</td>
           <td>${maintenance.repairman}</td>
           <td>${maintenance.laptop_v}</td>
           <td>${maintenance.problem}</td>
           <td>${maintenance.date_in}</td>
           <td>${maintenance.date_out}</td>
           ${mhowDelete(maintenance, user.admin)}
          </tr>
            </tbody>
          </table>
        </div>
      </li>
        `;
      html += li;
    });
    guideList.innerHTML = html;
  } else {
    //guideList.innerHTML = ;
    guideLists.innerHTML = '<h3 class="center-align" style="color:white; margin:90px;">Login to view data</h3>';
  }
}


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

const mhowDelete = (row, isAdmin) => {
  if (isAdmin) {
    return '<td> <button onclick=mdeleteRow(\'' + row.id + '\')>Delete</button></td>';
  } else {
    return ``
  }
}
const mdeleteRow = (rowId) => {
  db.collection('maintenance').doc(rowId).delete();
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

const msearch = () => {
  var input, filter, table, li, td, i, txtValue;
  input = document.getElementById("mSearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("mtable");
  li = table.getElementsByTagName("li");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    td = li[i].getElementsByTagName("div")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
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