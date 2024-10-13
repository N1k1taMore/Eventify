const express = require("express");
const router=express.Router()
const EventModel =require("../models/Event");
const TicketModel=require("../models/Ticket")
const verifyToken = require("../verifyToken");

router.post("/createEvent",verifyToken, async (req, res) => {
    try {
       const newEvent = new EventModel({...req.body,createdBy: req.userId });
       await newEvent.save();
       res.status(201).json(newEvent);
    } catch (error) {
       res.status(500).json({ error: "Failed to save the event to MongoDB" });
    }
 });

 router.delete("/:id", verifyToken, async (req, res) => {
   try {
       const id = req.params.id;

       // Find the event by ID
       const event = await EventModel.findById(id);

       // Check if the event exists
       if (!event) {
           return res.status(404).json({ error: "Event not found" });
       }

       // Check if the logged-in user is the creator of the event
       if (event.createdBy.toString() !== req.userId) {
           return res.status(403).json({ error: "You are not authorized to delete this event" });
       }

       // Delete the event
       await EventModel.findByIdAndDelete(id);
       res.status(204).send();
   } catch (error) {
       console.error("Error deleting Event:", error);
       res.status(500).json({ error: "Failed to delete Event" });
   }
});

router.get("/getEvent", async (req, res) => {
    try {
       const events = await EventModel.find();
       res.status(200).json(events);
    } catch (error) {
       res.status(500).json({ error: "Failed to fetch events from MongoDB" });
    }
 });

// like event
router.post('/:id', verifyToken, async (req, res) => {
   try {
     const id = req.params.id;
     const event = await EventModel.findById(id);
 
     if (!event) {
       return res.status(404).json({ message: "Event not found" });
     }

     event.likes = (event.likes || 0) + 1;
     await event.save();
 
     res.status(200).json({ message: "Event liked successfully", likes: event.likes });
   } catch (error) {
     console.error("Error liking event:", error);
     res.status(500).json({ error: "An error occurred while liking the event" });
   }
 });
 
 //individual event
router.get("/:id", async (req, res) => {
   const {id} = req.params;
   try {
      const event = await EventModel.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

router.get("/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await EventModel.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

router.get("/:id/ordersummary/paymentsummary",verifyToken, async (req, res) => {
      const { id } = req.params;
      try {
         const event = await EventModel.findById(id);
         res.json(event);
      } catch (error) {
         res.status(500).json({ error: "Failed to fetch event from MongoDB" });
      }
   })

router.get("/:id/getticket",verifyToken, async (req, res) => {
      const eventId = req.params.id;
      
      try { 
         const event = await EventModel.findById(eventId);
         if (!event || event.createdBy.toString() !== req.userId) {
         return res.status(403).json({ error: "You are not authorized to view tickets for this event" });
         }
        const tickets = await TicketModel.find({ eventid: eventId });

        res.json(tickets);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching tickets" });
      }
    });
    
module.exports=router
 