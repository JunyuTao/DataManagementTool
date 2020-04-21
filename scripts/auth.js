
// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
    window.alert("Success!");
  });
});
console.log(auth.currentUser)
// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    if(document.getElementById("guidess") ) {
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(user, snapshot.docs);
    }, err => console.log(err.message));
    }
    else{
    db.collection('maintenance').onSnapshot(snapshot => {
      setupMaintenance(user, snapshot.docs);
    }, err => console.log(err.message));
    }
  } else {
    setupUI();
    setupGuides(false, []);
    setupMaintenance(false, []);
  }
});

// create new data
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(createForm)

  if (createForm.owner) {
    let formData = {
      tag_num: createForm.tag_num.value,
      owner: createForm.owner.value,
      laptop_v: createForm.laptop_v.value,
      repairman : createForm.repairman.value,
      problem: createForm.problem.value,
      date_in: createForm.date_in.value,
      date_out: createForm.date_out.value,
    }
    console.log(formData)
    db.collection('maintenance').add(formData).then(() => {
      // close the create modal & reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    }).catch(err => {
      console.log(err.message);
    });
  } else {
    let formData = {
      name: createForm.name.value,
      software: createForm.software.value,
      tag_num: createForm.tag_num.value,
      license_key: createForm.license_key.value,
      exp_date: createForm.exp_date.value,
    }
    db.collection('guides').add(formData).then(() => {
      // close the create modal & reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    }).catch(err => {
      console.log(err.message);
    });
  }
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  window.location.href = "Software.html";
});
// sidenav logout
const sidenavlogout = document.querySelector('#logoutsidenav');
sidenavlogout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  window.location.href = "Software.html";
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    lohinForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  })

})