import { error } from "console";
import volunteerRepository from "../repository/VolunteerRepo";
import { VolunteerDocument } from "../types/volunteerType";
import { ConflictError, ValidationError } from "../exceptions/CustomError";

class VolunteerService{
    async createVolunteer(volunteerData: Partial<VolunteerDocument>): Promise<VolunteerDocument|null>{
            const { vol_email, vol_name, vol_phNo, vol_id, vol_evtName } = volunteerData;
            if (!vol_email || !vol_name || !vol_phNo || !vol_id || !vol_evtName) {
                // res.json({ Error: "True", Message: "All Fields are required..." });
                throw new ValidationError("Ensure to enter every field");
            }
            const volunteerExist = await volunteerRepository.findBy({ vol_email:vol_email });
            console.log(volunteerExist);
            if (volunteerExist) {
                throw new ConflictError("Already Registered for this Event...");
            }

            return await volunteerRepository.create(volunteerData);
        
    }
    async deleteVolunteer(id: string): Promise<VolunteerDocument|null>{
        try{
            return await volunteerRepository.delete(id);
        }catch(err){
            console.log("Error while deleting volunteer in service layer");
            return null;
        }
    }

    async updateVolunteer(id: string, transactionData: Partial<VolunteerDocument>): Promise<VolunteerDocument|null>{
        try{
            return await volunteerRepository.update(id,transactionData);
        }catch(error){
            console.error("Error updating transaction:", error);
            return null;
        }
    }
    async getAllVolunteers(): Promise<VolunteerDocument[]|null>{
        // console.log("Into the service");
        try{
            return await volunteerRepository.getAll();
        }catch(err){
            console.error("Error getting all transactions:",err);
            return null;
        }
    }

    async getMacthedVolunteers(searchTerm: string): Promise<VolunteerDocument[]|null>{
        // console.log("Into the service");
        console.log(searchTerm);
        try{
            return await volunteerRepository.getMatched(searchTerm);
        }catch(err){
            console.error("Error in getting matched transactions:",err);
        }
    }
}

export default new VolunteerService();