const express = require("express");
const router=express.Router()
const TicketModel=require('../models/Ticket')
const EventModel=require('../models/Event')
const verifyToken = require("../verifyToken");

router.post("/createticket",verifyToken, async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new TicketModel(ticketDetails);
      await newTicket.save();
      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});

router.get("/user/:userId", (req, res) => {
   const userId = req.params.userId;

   TicketModel.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

router.delete("/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await TicketModel.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});



module.exports=router