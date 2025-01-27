// add admin cloud function
const adminForm = document.querySelector(".admin-actions");
const addmsg = document.querySelector(".addMsg");

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector("#admin-email").value;
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail }).then((result) => {
    console.log(result);
    window.alert(result.data.message);
  });
});
console.log(auth.currentUser);
// listen for auth status changes
auth.onAuthStateChanged((user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    if (document.getElementById("guidess")) {
      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupGuides(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupSoftware(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupFname(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupLname(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupTag(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupLi(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupVS(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupAPR(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );
    } else {
      db.collection("maintenance").onSnapshot(
        (snapshot) => {
          setupMaintenance(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupTag(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupname(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("maintenance").onSnapshot(
        (snapshot) => {
          setupLV(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );

      db.collection("maintenance").onSnapshot(
        (snapshot) => {
          setupRM(user, snapshot.docs);
        },
        (err) => console.log(err.message),
      );
    }
  } else {
    setupUI();
    setupGuides(false, []);
    setupMaintenance(false, []);
  }
});

// create new data
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(createForm);

  if (createForm.own) {
    let formData = {
      tag_num: createForm.tag.value,
      owner: createForm.own.value,
      laptop_v: createForm.lv.value,
      repairman: createForm.rm.value,
      problem: createForm.problem.value,
      date_in: createForm.date_in.value,
      date_out: createForm.date_out.value,
    };
    if (
      !formData.tag_num ||
      !formData.owner ||
      !formData.laptop_v ||
      !formData.repairman ||
      !formData.problem ||
      !formData.date_in
    ) {
      addmsg.innerHTML =
        '<h5 class="card-panel black-text red center-align"> Kindly Enter Fields First</h5>';
      setTimeout(() => {
        addmsg.innerHTML = "";
      }, 2100);
    } else {
      db.collection("maintenance")
        .add(formData)
        .then(() => {
          // close the create modal & reset form
          const modal = document.querySelector("#modal-create");
          M.Modal.getInstance(modal).close();
          createForm.reset();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  } else {
    let formData = {
      fname: createForm.first.value,
      lname: createForm.last.value,
      software: createForm.sw.value,
      tag_num: createForm.tag.value,
      license_key: createForm.lk.value,
      version: createForm.vs.value,
      apr: createForm.a.value,
      exp_date: createForm.exp_date.value,
      comment: createForm.comment.value,
    };
    
    // if (
    //   !formData.software ||
    //   !formData.license_key ||
    //   !formData.version ||
    //   !formData.apr ||
    //   !formData.exp_date
    // ) {
    //   addmsg.innerHTML =
    //     '<h5 class="card-panel black-text red center-align"> Kindly Enter Fields First</h5>';
    //   setTimeout(() => {
    //     addmsg.innerHTML = "";
    //   }, 2100);
    // } else {
      let exprdate = formData.exp_date.split("-");
      let formdate = new Date(+exprdate[0], +exprdate[1] - 1, +exprdate[2]);
    if (numDays(formdate, new Date()) < 0)
    {
      window.alert('Please enter the right date.');
    } else {

      db.collection("guides")
        .add(formData)
        .then(() => {
          // close the create modal & reset form
          const modal = document.querySelector("#modal-create");
          M.Modal.getInstance(modal).close();
          createForm.reset();
        })
        .catch((err) => {
          console.log(err.message);
        });
      }
    // }

  }
});

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // sign up the user & add firestore data
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        Fname: signupForm["Fname"].value,
        Lname: signupForm["Lname"].value,
      });
    })
    .then(() => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
  window.location.href = "index.html";
});
// sidenav logout
const sidenavlogout = document.querySelector("#logoutsidenav");
sidenavlogout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
  window.location.href = "index.html";
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // log the user in
  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      lohinForm.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});
