
// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
    }, err => console.log(err.message));
  } else {
    setupUI();
    setupGuides([]);
  }
});

  // create new data
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('guides').add({
    name: createForm.name.value,
    software: createForm.software.value,
    tag_num: createForm.tag_num.value,
    license_key: createForm.license_key.value,
    exp_date: createForm.exp_date.date,
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
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