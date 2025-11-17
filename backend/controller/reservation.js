import ErrorHandler from "../error/error.js";
import { Reservation } from "../models/reservationSchema.js";

const send_reservation = async (req, res, next) => {
  console.log("⚡️ send_reservation route reached!");
  console.log("BODY RECEIVED:", req.body);

  const { firstName, lastName, email, date, time, phone } = req.body;
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }
  //mere schema me ye saari info h req,fn,ln,email,date,time,phone t agar ye nhi hoti to error de do please fill full reservation form

  try {
    await Reservation.create({ firstName, lastName, email, date, time, phone });
    //agar await nhi lagati to error through hota,lekin ab code tb tk aage nhi badhega jb tk mongoose ka kaam complete nhi ho jata
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  }
  catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }
    // Handle other errors
    return next(error);
  }
}


export default send_reservation;

