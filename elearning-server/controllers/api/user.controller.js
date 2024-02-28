module.exports = {
     handleProfile: (req, res) => {
          res.status(200).json({
               message: 'success',
               user: {
                    ...req.user.dataValues
               }
          })
     }
}