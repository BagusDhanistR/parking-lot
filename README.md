# parking-lot
This is a mini project about ticketing on parking lot
this project has unit testing using jest and supertest 
run testing by using command  `npm run test`

## Ticket

List of available endpoints:
​

-   `POST /ticket/create`
-   `GET /ticket/getAll`

 ## Create Ticket
----
* **URL**

    ``/ticket/create`

* **Method:**
  
    ``POST` 
  
*  **URL Params** : none

* **Data Params**
  * **Body:** <br />
  ```json
    {
        "vehicle_type": "mobil",
        "time_in": "2022-11-29T10:55:32.571Z",
        "time_out": "2022-11-29T10:56:07.329Z"
    }
  ```
* **Success Response:** 
  * **Code:** 200 <br />
    **Content:** 
  ```json
    {
        "message": "ticket successfully created",
        "ticket": {
            "id": 16,
            "vehicle_type": "mobil",
            "time_in": "2022-11-29T10:55:32.571Z",
            "time_out": "2022-11-29T10:56:07.329Z",
            "total_payment": 0,
            "updatedAt": "2022-11-29T15:46:35.787Z",
            "createdAt": "2022-11-29T15:46:35.787Z"
        }   
    }
  ```
 
* **Error Response:**
   * **Code:** 401 <br />
      **Content:** 
      ```json
        { 
            "message": "unrecognize vehicle type"
        }
      ```
    * **Code:** 401 <br />
      **Content:** 
      ```json
        {
            "message": "internal server error",
            "error": "SequelizeValidationError"
        }
      ```

## Get All Ticket
----
* **URL**

    ``/ticket/getAll?vehicle_type="(mobil/motor)"&from_date=DATE&to_date=DATE&low_price="price"&high_price_price="price"`

* **Method:**
  
    ``GET` 

* **Success Response:** 
  * **Code:** 200 <br />
    **Content:** 
  ```json
    {
        "message": "here's your data",
        "tickets": [
            {
            "id": 5,
            "vehicle_type": "mobil",
            "time_in": "2022-11-29T11:22:07.146Z",
            "time_out": "2022-11-29T13:50:07.145Z",
            "total_payment": 15000,
            "createdAt": "2022-11-29T11:34:28.839Z",
            "updatedAt": "2022-11-29T11:34:28.839Z"
            }
        ] 
    }
  ```
 
* **Error Response:**
   * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```json
    { 
      "message" : "internal server error" 
    }
    ```