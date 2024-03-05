const cloudinary = require("../../configs/cloudinary");

module.exports = {
     handleUploadImage: (req, res) => {
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
                    data: result.url
               })
          })
     },
     handleUploadVideo: (req, res) => {
          cloudinary.uploader.upload(
               req.file.path,
               {
                    upload_preset: "e-learning",
                    resource_type: "video",
               },
               function (err, result) {
                    if (err) {
                         return res.status(500).json({
                              success: false,
                              message: "Error"
                         })
                    }
                    res.status(200).json({
                         success: true,
                         message: "Uploaded!",
                         data: result.url
                    })
               })
     }
}