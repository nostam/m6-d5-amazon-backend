/* Market Place / Amazon Like + MongoDB
     Upgrade your previously created API using a MongoDB Database.
     //---------------------------------------------------------
     START FROM PREVIOUS VERSION OF AMAZON / MARKETPLACE API!
     //---------------------------------------------------------
     Every product in your marketplace has this information:
     {
         "name": "app test 1",  //REQUIRED
         "description": "somthing longer", //REQUIRED
         "brand": "nokia", //REQUIRED
         "imageUrl": "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80", //REQUIRED
         "price": 100, //REQUIRED
         "category": "smartphones"
         "createdAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED (take a look at Mongoose docs to get how this can be automatically generated)
         "updatedAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
     }
     And the reviews looks like:
      {
         "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
         "rate": 3, //REQUIRED, max 5
         "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
     },
     //DATABASE
     Create the necessary collections. Is up to you to choose how many collections are needed to handle Products, Reviews, Shopping Cart[EXTRA]
     //BACKEND
     You are in charge of building the Backend using NodeJS + Express + Mongoose.
     You are going to study how is the better choice of design for the APIs for handling CRUD for products and reviews
     Extra method for product's image upload (POST /products/{id}/upload)

     Add the possibility to filter Products and paginate Products

     [EXTRA] Create the required endpoints for Shopping cart
     //NOTE:
     for GET methods, add PAGINATION in order to get X elements at a time
     //FRONTEND

     Create some filters (like checkboxes, toggles, switches, ...) to obtain a filtered list of Products from the db. Add backend pagination
     Check from the frontend if everything is still working ;) */