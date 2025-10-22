import Listing from "../models/listing_model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        return next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404, 'Listing not found'));
    }
    if (String(req.user.id) !== String(listing.userRef)){
        return next(errorHandler(403, 'You can delete only your listing'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Listing has been deleted' });
    } catch (error) {
        return next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }
        return res.status(200).json(listing);
    } catch (error) {
        return next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404, 'Listing not found'));
    }
    if (String(req.user.id) !== String(listing.userRef)){
        return next(errorHandler(403, 'You can update only your listing'));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedListing);
    } catch (error) {
        return next(error);
    }
}
