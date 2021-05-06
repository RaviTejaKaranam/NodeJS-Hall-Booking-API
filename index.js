//Importing Express
const express = require("express");
//Initialising the app
const app = express();
//Giving access to req.body to express 
app.use(express.json())

//Testing
app.get("/", (req, res) => {
  res.send("Welcome");
});


const rooms = []; 
const customers = [] 
const bookedRooms = [] 


//end point to create room a room with random seats, amenities, price
//Initially the room is set as available with no customerID
app.post("/create-rooms", (req, res) => {
  rooms.push({
    id: rooms.length + 1,
    name: `Room - ${rooms.length + 1}`,
    seatsAvailable: Math.floor(Math.random() * (100 - 50) + 50),
    amenities: Math.floor(Math.random() * (5 - 0)),
    priceForHour : Math.floor(Math.random() * (1000-500) + 500),
    available : true,
    customerId : null
  });
  res.status(200).json({
    message: "Record Created",
  });
});


//End point to get all the rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

//End point to book a room if avaiable
app.put("/book-room/:id", (req,res)=>{
  if(rooms[req.params.id - 1].available) {
    rooms[req.params.id - 1].available = false,
    rooms[req.params.id - 1].customerId = req.params.id
    customers.push({
      id : req.params.id,
      roomId : +req.params.id,
      date: new Date(),
      startTime: new Date().getTime(),
      endTime : new Date().getTime() * 1.5
    })

    res.json({
      message : "Room booked"
    })
  }
  //If room does not exist or is already booked
  else{
    res.json({
      message : 'Room not available'
    })
  }
  }
)
//Get the details of a single room
app.get("/get-room/:id", (req, res) => {
  if(rooms[req.params.id - 1]){
    res.json(rooms[req.params.id - 1]);
  }
  else{
    res.json({
      message : "Room not found"
    })
  }
});
//Get the details of the customers
app.get("/customers", (req,res) => {
  res.json(customers)
})

//Get the details of the rooms that are booked along with customer details 
app.get("/booked-rooms", (req,res)=>{
  for(let room of rooms){
    if(!room.available){
      const bookedRoomCustomerDetails = customers.find((customer) => {
        console.log(customer.roomId, room.id)
        return customer.roomId === room.id
      })
      bookedRooms.push({
        customerId : bookedRoomCustomerDetails.id,
        roomId : room.id,
        date : bookedRoomCustomerDetails.date,
        startTime : bookedRoomCustomerDetails.startTime,
        endTime : bookedRoomCustomerDetails.endTime
      })
      }
  }
  res.json(bookedRooms)
})

//Setting the port 
const port = 3010;
app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
