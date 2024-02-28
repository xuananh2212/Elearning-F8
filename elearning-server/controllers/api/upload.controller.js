const cloudinary = require("../../config/cloudinary");

module.exports = {
     handleUploadImage: (req, res) => {
          console.log(req.file);
          cloudinary.uploader.upload(req.file.path, { upload_preset: "e-learning" }, function (err, result) {
               if (err) {
                    return res.status(500).json({
                         success: false,
                         message: "Error"
                    })
               }

               res.status(200).json({
                    success: true,
                    message: "Uploaded!",
                    data: result
               })
          })
     }
}