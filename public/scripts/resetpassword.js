const resetForm = document.querySelector("#reset-form");
const email = document.querySelector("#email");

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  auth
    .sendPasswordResetEmail(email.value)
    .then((res) => {
      document.querySelector(
        ".msg",
      ).innerHTML = ` <h5 class="card-panel green white-text ">Check your email to reset you password!</h5>`;

      setTimeout(() => {
        document.querySelector(".msg").innerHTML = "";
      }, 4000);
    })
    .catch((error) => {
      const errorMessage = error.message;

      document.querySelector(
        ".msg",
      ).innerHTML = ` <h5 class="card-panel green white-text ">${errorMessage}</h5>`;

      setTimeout(() => {
        document.querySelector(".msg").innerHTML = "";
      }, 4000);
    });
});
