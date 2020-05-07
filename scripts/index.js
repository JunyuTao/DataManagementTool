// DOM elements
const guideList = document.querySelector(".guides");
const guideLists = document.querySelector(".guidess");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");
const addSoftware = document.querySelector(".software");
const addFname = document.querySelector(".fname");
const addLname = document.querySelector(".lname");
const addTag = document.querySelector(".tag_num");
const addLi = document.querySelector(".license_key");
const addVS = document.querySelector(".version");
const addAPR = document.querySelector(".apr");
const addOwner = document.querySelector(".owner");
const addLV = document.querySelector(".laptop_v");
const addRM = document.querySelector(".repairman");
const fn = document.getElementById("fnw");

const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach((item) => (item.style.display = "block"));
    }
    // account info
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
        <div style="font-size:medium;">Logged In as: ${user.email}</div>
        <div style="padding:20px; font-size:large;" >${doc.data().Fname} ${
          doc.data().Lname
        }</div>
        <div class="blue-text;" style="font-size:large;color: rgb(103, 187, 235);padding:1px;">${
          user.admin ? "Admin" : ""
        }</div>
      `;
        accountDetails.innerHTML = html;
      });
    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
  } else {
    adminItems.forEach((item) => (item.style.display = "none"));

    // clear account info
    accountDetails.innerHTML = "";
    // toggle user elements
    adminItems.forEach((item) => (item.style.display = "none"));
    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
  }
};

// setup data
const setupGuides = (user, data) => {
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    var expiringTitles = [];
    data.forEach((doc) => {
      const guide = { id: doc.id, ...doc.data() };
      let exprdate = guide.exp_date.split("-");
      let formdate = new Date(+exprdate[0], +exprdate[1] - 1, +exprdate[2]);
      if (numDaysBetween(formdate, new Date()) < 90) {
        expiringTitles.push(guide.software);
      }
      dataArray.push(guide);
      const li = `
        // <li>
        //   <div class="collapsible-header grey lighten-4"> ${guide.software} </div>  
        //   <div class="collapsible-body white"> <label for="tag_num" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Tag Number : </label> ${guide.tag_num} </div>
        //   <div class="collapsible-body white"> <label for="license_key" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">License Key : </label> ${guide.license_key} </div>
        //   <div class="collapsible-body white">  <label for="exp_date" style="font-size:medium; color: rgb(1, 119, 187); font-weight: bold">Expiration Date: </label> ${guide.exp_date} </div>
        // </li>
      `;
      html += li;
    });

    var groupedGuides = _.groupBy(dataArray, (guide) => {
      return guide.software;
    });

    let guidenNames = Object.keys(groupedGuides);
    let tableHtml = "";
    guidenNames.forEach((software) => {
      let counter = 0;

      for (let i = 0; i < groupedGuides[software].length; i++) {
        if (groupedGuides[software][i].tag_num) {
          counter++;
        }
      }

      let style = ``;

      if (expiringTitles.includes(software)) {
        style = `style= "background: red !important; color:white;"`;
      }

      let data = "";

      if (user.admin) {
        data = `${counter}/${groupedGuides[software].length}`;
      }

      if(software == ""){

        const li = `
      <li style="position: absolute;top: 100px;">
      <div style= "background: rgb(1, 119, 187) !important; color: white;" class="collapsible-header grey lighten-4"><div><p style="font-size:larger;" >Mechanics with no Software Assigned</div></div>
      <div class="collapsible-body white">
        <table id="${software.replace(/ /g, "")}">
        <input type="text" id="search${software.replace(
          / /g,
          "",
        )}" onkeyup="search(${software.replace(
        / /g,
        "",
      )})" placeholder="Search" title="Type in a name">
     
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>License Key</th>
            <th>Version</th>
            <th>Tag#</th>
            <th>APR</th>
            <th>Expiration Date</th>
            <th>Comment</th>
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
      }
      else{

      const li = `
      <li>
      <div ${style} class="collapsible-header grey lighten-4"><div>${software}</div><div class="adminStats" style="margin-left:auto;">${data}</div> </div>
      <div class="collapsible-body white">
        <table id="${software.replace(/ /g, "")}">
        <input type="text" id="search${software.replace(
          / /g,
          "",
        )}" onkeyup="search(${software.replace(
        / /g,
        "",
      )})" placeholder="Search" title="Type in a name">
     
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>License Key</th>
            <th>Version</th>
            <th>Tag#</th>
            <th>APR</th>
            <th>Expiration Date</th>
            <th>Comment</th>
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
        }
    });
    guideLists.innerHTML = tableHtml;
    //guideList.innerHTML = html;
  } else {
    //guideList.innerHTML = ;
    guideLists.innerHTML =
      '<div class="center-align" style="color:white; margin:90px; background-color:rgb(1, 119, 187);border-radius: 25px;border: 2px solid white;"><h3>Don’t have an account?</h3><p class="center-align" style="color:white; margin:90px;">If you are not a Missouri Department of Transportation employee you are not authorized to use this portal. Please contact your local Information Systems Department if you need additional help setting up an account.</p></div>';
  }
};

const setupMaintenance = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    var dataArray = [];
    data.forEach((doc) => {
      const guide = { id: doc.id, ...doc.data() };
      dataArray.push(guide);
    });

    var groupedMaintenance = _.groupBy(dataArray, (m) => {
      return m.tag_num;
    });

    let maintenanceNames = Object.keys(groupedMaintenance);
    let tableHtml = "";
    maintenanceNames.forEach((maintenance) => {
      const li = `
        <li>
        <div class="collapsible-header grey lighten-4">${maintenance}</div>
        <div class="collapsible-body white">
          <table>
         
          <thead>
            <tr>
              <th>Owner</th>
              <th>Tag#</th>
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
            ${mgetTable(user.admin, groupedMaintenance[maintenance])}
          </tr>
            </tbody>
          </table>
        </div>
      </li>
        `;
      tableHtml += li;
    });
    guideList.innerHTML = tableHtml;
  } else {
    //guideList.innerHTML = '';
    guideLists.innerHTML =
      '<div class="center-align" style="color:white; margin:90px; background-color:rgb(1, 119, 187);border-radius: 25px;border: 2px solid white;"><h3>Don’t have an account?</h3><p class="center-align" style="color:white; margin:90px;">If you are not a Missouri Department of Transportation employee you are not authorized to use this portal. Please contact your local Information Systems Department if you need additional help setting up an account.</p></div>';
  }
};

const numDaysBetween = (d1, d2) => {
  let diff = Math.abs(d1.getTime() - d2.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const numDays = (d1, d2) => {
  let dif = d1.getTime() - d2.getTime();
  return Math.floor(dif / (1000 * 60 * 60 * 24));
};

const getTable = (isAdmin, rows) => {
  let rowHtml = "";
  rows.forEach((row) => {
    // write logic here to check expiration date
    let style = "";
    let exprdate = row.exp_date.split("-");
    let formdate = new Date(+exprdate[0], +exprdate[1] - 1, +exprdate[2]);
    if (numDaysBetween(formdate, new Date()) < 90) {
      style = `style="background: red; color:white;"`;
    }
    let rHrml = `<tr ${style}>
           <td>${row.fname}</td>
           <td>${row.lname}</td>
           <td>${row.license_key}</td>
           <td>${row.version}</td>
           <td>${row.tag_num}</td>
           <td>${row.apr}</td>
           <td >${row.exp_date}</td>
           <td style="table-layout: auto;width: 25%;" >${row.comment}</td>
           ${showDelete(row, isAdmin)}
           ${showEdit(row, isAdmin)}
          </tr>`;

    rowHtml += rHrml;
  });
  return rowHtml;
};

const mgetTable = (isAdmin, rows) => {
  console.log(rows);
  let rowHtml = "";
  rows.forEach((row) => {
    let rHrml = `<tr>
    <td>${row.owner}</td>
    <td>${row.tag_num}</td>
    <td>${row.repairman}</td>
    <td>${row.laptop_v}</td>
    <td style="table-layout: auto;width: 20%;" >${row.problem}</td>
    <td>${row.date_in}</td>
    <td>${row.date_out}</td>
    ${mhowDelete(row, isAdmin)}
    ${mhowEdit(row, isAdmin)}
          </tr>`;

    rowHtml += rHrml;
  });
  return rowHtml;
};

const showDelete = (row, isAdmin) => {
  if (isAdmin) {
    return (
      "<td> <button onclick=deleteRow('" + row.id + "')>Delete</button></td>"
    );
  } else {
    return ``;
  }
};

//============================================ EDIT HERE =================================== //
//edit for software
const showEdit = (row, isAdmin) => {
  if (isAdmin) {
    return `<td> <button onclick=deleteS("${row.id}") data-target="modal-editS" class="modal-trigger">Edit</button></td>`;
  } else {
    return ``;
  }
};

//edit for maintenance
const mhowEdit = (row, isAdmin) => {
  if (isAdmin) {
    return `<td> <button onclick=deleteM("${row.id}") class="modal-trigger" data-target="modal-edit">Edit</button></td>`;
  } else {
    return ``;
  }
};

/////////////////////////////////////////////////////////////////////////////////////
const editS = document.querySelector(".editSoftware");
const deleteS = (id) => {
  const k = db
    .collection("guides")
    .doc(id)
    .get()
    .then((doc) => {
      editS.innerHTML = `
      <div class = "editMsg" ></div>

  <div class="modal-content">
  <h4>Edit Data</h4><br />
  <form id="edit-form1">
    <p style="background-color: rgb(103, 187, 235); color:white; font-size: larger; font-weight: bold;">Add New Mechanics or Existing Mechanics...............................................................................</p>

      <div class="select">
          <label for="fname">First Name</label>
          <input list="fname" id="first" value="${doc.data().fname}">
          <datalist id="fname" class="fname">
  </datalist>
      </div>

      <div class="select">
          <label for="lname">Last Name</label>
          <input list="lname" id="last" value="${doc.data().lname}">
          <datalist id="lname" class="lname">
  </datalist>
      </div>

      <div class="select">
          <label for="tag_num">Tag Number</label>
          <input list="tag_num" id="tag" value="${doc.data().tag_num}">
          <datalist id="tag_num" class="tag_num">
  </datalist>
      </div>
      <p style="background-color: rgb(103, 187, 235); color:white; font-size: larger; font-weight: bold;" >Add New Software or Existing Software.....................................................................................</p>

      <div class="select">
          <label for="software">Software</label>
          <input list="software" id="sw" value="${doc.data().software}">
          <datalist id="software" class="software">
  </datalist>
      </div>

      <div class="select">
          <label for="license_key">License Key</label>
          <input list="license_key" id="lk" value="${doc.data().license_key}">
          <datalist id="license_key" class="license_key">
  </datalist>
      </div>

      <div class="select">
          <label for="version">Version</label>
          <input list="version" id="vs" value="${doc.data().version}">
          <datalist id="version" class="version">
  </datalist>
      </div>

      <div class="select">
          <label for="apr">APR</label>
          <input list="apr" id="a" value="${doc.data().apr}">
          <datalist id="apr" class="apr">
  </datalist>
      </div>

      <div class="input-field">
          <input style="color: rgb(143, 143, 143);" id="exp_date" type="date" value=${
            doc.data().exp_date
          } required>
          <label for="exp_date">Expiration Date</label>
      </div>

      <div class="input-field">
        <textarea id="comment" class="materialize-textarea">${
          doc.data().comment
        }</textarea>

    </div>

      <button class="btn yellow darken-2 z-depth-0">Save</button>
  </form>
</div>
`;

      const editForm1 = document.querySelector("#edit-form1");

      editForm1.addEventListener("submit", (e) => {
        e.preventDefault();

        let formData = {
          fname: editForm1.first.value,
          lname: editForm1.last.value,
          software: editForm1.sw.value,
          tag_num: editForm1.tag.value,
          license_key: editForm1.lk.value,
          version: editForm1.vs.value,
          apr: editForm1.a.value,
          exp_date: editForm1.exp_date.value,
          comment: editForm1.comment.value,
        };

        let exprdate = formData.exp_date.split("-");
        let formdate = new Date(+exprdate[0], +exprdate[1] - 1, +exprdate[2]);
        if (numDays(formdate, new Date()) < 0)
        {
          window.alert('Please enter the right date.');
        } else {
        db.collection("guides")
          .doc(id)
          .update(formData)
          .then(() => {
            document.querySelector(".editMsg").innerHTML =
              '<h5 class="card-panel white-text green darken-1 center-align">Data Upaded!</h5>';

            setTimeout(() => {
              window.location = "Software.html";
            }, 1500);
          })
          .catch((err) => {
            console.log(err.message);
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const editM = document.querySelector(".editM");
const deleteM = (id) => {
  const m = db
    .collection("maintenance")
    .doc(id)
    .get()
    .then((doc) => {
      editM.innerHTML = `
      <div class = "editMsg1" ></div>
   
      <div class="modal-content">
    <h4>Edit History</h4><br />
    <form id="edit-form2">
        <div class="select">
            <label for="tagnum">Tag Number</label>
            <input list="tag_num" id="tag" value="${doc.data().tag_num}">
            <datalist id="tag_num" class="tag_num">
    </datalist>
        </div>
  
        <div class="select">
            <label for="owner">Owner</label>
            <input list="owner" id="own" value="${doc.data().owner}">
            <datalist id="owner" class="owner">
    </datalist>
        </div>
  
        <div class="select">
            <label for="laptop_v">Laptop Version</label>
            <input list="laptop_v" id="lv" value="${doc.data().laptop_v}">
            <datalist id="laptop_v" class="laptop_v">
      </datalist>
        </div>
  
        <div class="input-field">
            <textarea id="problem" class="materialize-textarea" required>${
              doc.data().problem
            }</textarea>
        </div>
  
        <div class="select">
            <label for="repairman">Repairman</label>
            <input list="repairman" id="rm" value="${doc.data().repairman}">
            <datalist id="repairman" class="repairman">
      </datalist>
        </div>
  
        <div class="input-field">
            <input style="color: rgb(143, 143, 143);" id="date_in" type="date" value=${
              doc.data().date_in
            } required>
            <label for="date_in">Date In</label>
        </div>
  
        <div class="input-field">
            <input style="color: rgb(143, 143, 143);" id="date_out" type="date" value=${
              doc.data().date_out
            } required>
            <label for="date_out">Date Out</label>
        </div>
  
        <button class="btn yellow darken-2 z-depth-0">Save</button>
    </form>
  </div>
`;

      const editForm2 = document.querySelector("#edit-form2");

      editForm2.addEventListener("submit", (e) => {
        e.preventDefault();

        let formData2 = {
          tag_num: editForm2.tag.value,
          owner: editForm2.own.value,
          laptop_v: editForm2.lv.value,
          repairman: editForm2.rm.value,
          problem: editForm2.problem.value,
          date_in: editForm2.date_in.value,
          date_out: editForm2.date_out.value,
        };

        db.collection("maintenance")
          .doc(id)
          .update(formData2)
          .then(() => {
            document.querySelector(".editMsg1").innerHTML =
              '<h5 class="card-panel white-text green darken-1 center-align">Data Updated!</h5>';

            setTimeout(() => {
              window.location = "MHistory.html";
            }, 1500);
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const mhowDelete = (row, isAdmin) => {
  if (isAdmin) {
    return (
      "<td> <button onclick=mdeleteRow('" + row.id + "')>Delete</button></td>"
    );
  } else {
    return ``;
  }
};

const mdeleteRow = (rowId) => {
  db.collection("maintenance").doc(rowId).delete();
};

const deleteRow = (rowId) => {
  db.collection("guides").doc(rowId).delete();
};

const search = (table) => {
  console.log(table);
  let input, filter, tr, td, i, txtValue;
  input = document.getElementById("search" + table.id);
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      console.log(td);
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

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
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

const setupSoftware = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidess = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidess.software)) {
        dataArray.push(guidess.software);
        const li = `
  <option value="${guidess.software}">
  `;
        html += li;
      }
    });
    addSoftware.innerHTML = html;
  }
};

const setupFname = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let htmll = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidesss = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidesss.fname)) {
        dataArray.push(guidesss.fname);
        const lii = `
    <option value="${guidesss.fname}">
    `;
        htmll += lii;
      }
    });
    addFname.innerHTML = htmll;
  }
  // if(addFname.value == null){
  //   fn.forEach((item) => (item.style.display = "none"));
  // }else{
  //   fn.forEach((item) => (item.style.display = "none"));
  // }
};

const setupLname = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidessss = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidessss.lname)) {
        dataArray.push(guidessss.lname);
        const liii = `
      <option value="${guidessss.lname}">
      `;
        html += liii;
      }
    });
    addLname.innerHTML = html;
  }
};

const setupTag = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidessss = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidessss.tag_num)) {
        dataArray.push(guidessss.tag_num);
        const liii = `
        <option value="${guidessss.tag_num}">
        `;
        html += liii;
      }
    });
    addTag.innerHTML = html;
  } 
};

const setupLi = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidessss = { id: doc.id, ...doc.data() };
      if(!dataArray.includes(guidessss.license_key)) {
        dataArray.push(guidessss.license_key);
        const liii = `
          <option value="${guidessss.license_key}">
          `;
        html += liii;
      }
    });
    addLi.innerHTML = html;
  }
};

const setupVS = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidessss = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidessss.version)) {
        dataArray.push(guidessss.version);
        const liii = `
            <option value="${guidessss.version}">
            `;
        html += liii;
      }
    });
    addVS.innerHTML = html;
  }
};

const setupAPR = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidessss = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidessss.apr)) {
        dataArray.push(guidessss.apr);
        const liii = `
              <option value="${guidessss.apr}">
              `;
        html += liii;
      }
    });
    addAPR.innerHTML = html;
  }
};

const setupname = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let htmll = "";
    var dataArray = [];
    data.forEach((doc) => {
      const guidesss = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(guidesss.fname && guidesss.lname)) {
        dataArray.push(guidesss.fname);
        dataArray.push(guidesss.lname);
        const lii = `
                <option value="${guidesss.fname} ${guidesss.lname}">
                `;
        htmll += lii;
      }
    });
    addOwner.innerHTML = htmll;
  }
};

const setupLV = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const maintenance = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(maintenance.laptop_v)) {
        dataArray.push(maintenance.laptop_v);
        const liii = `
                  <option value="${maintenance.laptop_v}">
                  `;
        html += liii;
      }
    });
    addLV.innerHTML = html;
  }
};

const setupRM = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    let html = "";
    var dataArray = [];
    data.forEach((doc) => {
      const maintenance = { id: doc.id, ...doc.data() };
      if (!dataArray.includes(maintenance.repairman)) {
        dataArray.push(maintenance.repairman);
        const liii = `
                    <option value="${maintenance.repairman}">
                    `;
        html += liii;
      }
    });
    addRM.innerHTML = html;
  }
};

// $("#btn-resetPassword").click(function()
// {
//   var auth = firebase.auth();
//   var email = $("#email").val();

//   if(eamil != "")
//   {
//     auth.sendPasswordResetEmail(email).then(function()
//     {
//       window.alert("Email has been sent to you, please check.");
//     }).catch(function(error)
//     {
//       var errorCode = error.code;
//       var errorMessage = error.message;

//       console.log(errorCode);
//       console.log(errorMessage);

//       window.alert("message : " + errorMessage);
//     });
//   }
//   else{
//     window.alert("Please write your email first.")
//   }
// });


const Checkname = (user, data) => {
  console.log(user);
  console.log(data);
  if (data.length) {
    var DataArray = [];
    data.forEach((doc) => {
      const Guidessss = { id: doc.id, ...doc.data() };
      if (DataArray.includes(Guidessss.fname && Guidessss.lname)) {
        
        window.alert("Just added a new mechanic!")
        
      }
    });
  }
};