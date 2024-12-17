import  eventModel  from "../models/EventModel";
import subEventModel from "../models/SubEventModel";
import { NextFunction, Request, Response } from "express";
import eventService from "../services/EventService";
import { EventDocument } from "../types/eventType";
import { NotFoundError, ValidationError } from "../exceptions/CustomError";

class EventController {
  
  // Create a new event
  async createEvent(req: Request, res: Response,next: NextFunction) {
    const eventData: Partial<EventDocument> = req.body;
    try {
      const event = await eventService.createEvent(eventData);
      res.status(200).json(event);
    } 
    catch(err){
      next(err);
    }
  }

  // Update an existing event
  async updateEvent(req: Request, res: Response,next: NextFunction) {
    const { id } = req.params;
    const eventData: Partial<EventDocument> = req.body;
    try {
      const updatedEvent = await eventService.updateEvent(id, eventData);
      res.status(200).json({success:true,updatedEvent});
    } catch (err) {
      next(err);
    }
  }

  // Delete an event
  async deleteEvent(req: Request, res: Response,next: NextFunction) {
    const { id } = req.params;
    try {
      await eventService.deleteEvent(id);
      res.status(200).json({success:true, message: "Event successfully deleted" });
    } catch (err) {
      next(err);
    }
  }

  // Get all events
  async getAllEvents(req: Request, res: Response,next: NextFunction) {
    try {
      const events = await eventService.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }

  // Search for events by a specific term
  async getMatchedEvents(req: Request, res: Response,next: NextFunction) {
    const searchTerm = req.query.searchTerm as string;
    try {
      const matchedEvents = await eventService.getMatchedEvents(searchTerm);
      res.status(200).json(matchedEvents);
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction){
    const { id }= req.params;
    console.log("Id is ",id);
    try {
      const event = await eventService.getEventById(id);
      console.log(event);
      res.status(200).json({success:true, data:event});
    } catch (err) {
      next(err);
    }
  }

  //subEventRoutes
  async addSubEvent(req: Request, res: Response, next: NextFunction){
    const subEventData = req.body;
    console.log(req.params.id);
    try{
      const event = await eventService.addSubEvent(req.params.id,subEventData);
      res.status(200).json(event);
    }catch(error){
      next(error);
    }
  }
  async getSubEvent(req: Request, res: Response, next: NextFunction){
    const { id, subEventId } = req.params;
    try{
      const subEvent = await eventService.getSubEvent(id,subEventId);
      res.status(200).json(subEvent);
    }catch(error){
      next(error);
    }
  }
  async updateSubEvent(req: Request, res: Response, next: NextFunction){
    const {id, subEventId} = req.params;
    const updateData  = req.body;
    try{
      const subEvent = await eventService.updateSubEvent(id,subEventId,updateData);
      res.status(200).json(subEvent); 
    }catch(error){
      next(error);
    }
  }
  async deleteSubEvent(req: Request, res: Response, next: NextFunction){
    const {id, subEventId } = req.params;
    try{
      const event = await eventService.deleteSubEvent(id,subEventId);
      res.status(200).json(event);
    }catch(err){
      next(err);
    }
  }
}

export default new EventController();