import request from "axios";
export function register(additional_fields, nik_photo, person_photo) {
  return new Promise((resolve, reject) => {
    // let find = " ";
    // let re = new RegExp(find, "g");
    // let foldername = additional_fields.name;
    // foldername = additional_fields.nik + "@" + foldername.replace(re, "-");
    console.log("foldername trainface", nik_photo, person_photo);
    // const req = request
    //   .post("http://192.168.73.156:5555/add_user")
    // nik_photo.forEach(file => {
    //   req.attach("ktp_photo_path", file);
    // });
    // person_photo.forEach(file => {
    //   req.attach("face_photo_path", file);
    // });
    // for (let key in additional_fields) {
    //   req.field(key, additional_fields[key]);
    // }
    // .set("Accept", "application/json")
    // .send(additional_fields)
    // .then(function(res) {
    //   alert("yay got " + JSON.stringify(res.body));
    // });
    // req.end(function(err, res) {
    //   console.log(err, res, "action add");
    //   if (err) {
    //     return reject(err);
    //   }
    //   console.log("train face", res);
    //   resolve("success");
    // });
    let data = {
      ...additional_fields,
      face_photo_path: person_photo
    };
    console.log(data, "testing");
    request({
      method: "post",
      url: "http://192.168.73.156:5555/verify_user",
      data: data
    })
      .then(function(response) {
        console.log(response);
        resolve(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}
