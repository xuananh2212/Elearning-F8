const cloudinary = require('cloudinary').v2;

cloudinary.config({
     cloud_name: 'daxftrleb',
     api_key: '759369867626566',
     api_secret: 'roRh59w1bi4wNDot3xTlgS-4jvg'
});

module.exports = cloudinary;