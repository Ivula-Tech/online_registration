const submitForm = () => {
  const userName = document.getElementById("Name").value;
  const userEmail = document.getElementById("Email").value;
  const Password = document.getElementById("Password").value;
  const confPass = document.getElementById("ConfirmPass").value;
  const phone = document.getElementById("Number").value;

  const fileInput = document.getElementById("File");
  var file = fileInput.files[0];

  var formData = new FormData();
  formData.append("in_file", file);

  //   const image = document.getElementById("File").value;
  const stationName = document.getElementById("StationName").value;
  const estDel = document.getElementById("estDel").value;
  const town = document.getElementById("town").value;

  const tier = "contractor";
  const stationLocation = {
    lat: "her",
    long: "here",
  };
  const rating = "";

  console.log("username", categList, userName);

  categList != "" &&
  categList != " " &&
  estDel != "" &&
  estDel != " " &&
  userName != "" &&
  userName != " " &&
  userEmail != "" &&
  userEmail != " " &&
  stationName != "" &&
  stationName != " " &&
  Password != "" &&
  Password != " "
    ? (() => {
        if (Password == confPass) {
          axios
            .post("http://eltus.ivula.co.ke/filing.php", formData)
            .then(function (response) {
              const imageLink = response.data;

              axios
                .post("http://localhost:8000/auth_service", null, {
                  params: {
                    userName: userName,
                    password: Password,
                    userEmail: userEmail,
                    phoneNumber: phone,
                    type: "contractor",
                  },
                })
                .then((res) => {
                  if (res.token != "The email provided is already taken") {
                    axios
                      .post(
                        "http://localhost:8000/front_end_service/addStation",
                        null,
                        {
                          headers: {
                            authorization: res.data.token,
                          },
                          params: {
                            stationOwner: "6426d0422f9bb5ea523ab77c",
                            stationName: stationName,
                            stationLocation: stationLocation,
                            gasCategories: categList,
                            stationImage: imageLink,
                            town: town,
                            estDel: estDel,
                          },
                        }
                      )
                      .then((res) => {
                        if (
                          res.data.data !=
                          "An error occured, Kindly try again later"
                        ) {
                          console.log(res.data.token);
                          alert('Sign in was succeful, redirect to the app')
                        } else {
                          alert("Sign ina la full");
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    alert("Sign In success full");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch(function (error) {
              alert("upload was unsuccefull kindly try again");
            });
        } else {
          alert("The passwords did not match");
        }
      })()
    : (() => {
        alert("Could not submit form, you must have left some fields empty");
      })();
};
