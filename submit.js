
const getLocation = async ()=>{
  return new Promise((res,rej)=>{
    navigator.geolocation.getCurrentPosition(res,rej)
  })
}


const submitForm = async () => {
  if (navigator.geolocation) {
    let position =await getLocation()
    console.log(position)
    const stationLocation = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
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
                let hash = CryptoJS.MD5(Password).toString();
                axios
                  .post("http://192.168.1.109:8342/auth_service", null, {
                    params: {
                      userName: userName,
                      password: hash,
                      userEmail: userEmail,
                      phoneNumber: phone,
                      type: "contractor",
                    },
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      console.log(res.data.token);

                      console.log("details ", res.data.id);
                      axios
                        .post(
                          "http://192.168.1.109:8342/front_end_service/addStation",
                          null,
                          {
                            headers: {
                              authorization: res.data.token,
                            },
                            params: {
                              stationOwner: res.data.id,
                              stationName: stationName,
                              stationLocation: stationLocation,
                              gasCategories: categList,
                              stationImage: imageLink,
                              town: town,
                              estDel: estDel,
                              phoneNumber: phone,
                            },
                          }
                        )
                        .then((res) => {
                          if (
                            res.data.data !=
                            "An error occured, Kindly try again later"
                          ) {
                            console.log(res.data.token);
                            window.location.reload();
                            alert("Sign in was succeful, redirect to the app");
                          } else {
                            alert("Sign ina la full");
                          }
                        })
                        .catch((err) => {
                          alert("failed to register, ", err.message);
                          console.log("failed to register");
                        });
                    } else {
                      alert("Sign In unsuccessfull");
                    }
                  })
                  .catch((err) => {
                    // const response = JSON.parse(err.request.responseText)
                    // alert(response.token);
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
  } else {
    alert("We are sorry but you browser does not support this signup");
  }
};
