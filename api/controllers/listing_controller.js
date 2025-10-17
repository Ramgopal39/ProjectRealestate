import Listing from "../models/listing_model.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        return next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        return res.status(200).json(listing);
    } catch (error) {
        return next(error);
    }
}