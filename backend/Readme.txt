run server - npx nodemon server/app.js

I used Postman for testing: POST request needs to be run first before the GET request can allow you to dowload pdf (You have to scan to download the report.)
POST http://localhost:3000/api/scan-url
GET http://localhost:3000/api/download-pdf?url=https://example.com
