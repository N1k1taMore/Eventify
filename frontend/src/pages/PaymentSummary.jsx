import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { UserContext } from '../UserContext';
import Qrcode from 'qrcode';

export default function PaymentSummary() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user } = useContext(UserContext);
  const [ticketDetails, setTicketDetails] = useState({
    userid: user ? user._id : '',
    eventid: '',
    ticketDetails: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      eventname: '',
      eventdate: '',
      eventtime: '',
      ticketprice: '',
      qr: '',
      transactionId: '',
    }
  });
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    if (!id) return;

    axios.get(`/event/${id}/ordersummary/paymentsummary`).then((response) => {
      setEvent(response.data);
      setTicketDetails(prevTicketDetails => ({
        ...prevTicketDetails,
        eventid: response.data._id,
        ticketDetails: {
          ...prevTicketDetails.ticketDetails,
          eventname: response.data.title,
          eventdate: response.data.eventDate.split("T")[0],
          eventtime: response.data.eventTime,
          ticketprice: response.data.ticketPrice,
        }
      }));
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, [id]);

  if (!event) return '';

  const handleChangeTransactionId = (e) => {
    const { value } = e.target;
    setTicketDetails(prevTicketDetails => ({
      ...prevTicketDetails,
      ticketDetails: {
        ...prevTicketDetails.ticketDetails,
        transactionId: value,
      }
    }));
  };

  const createTicket = async (e) => {
    e.preventDefault();

    try {
      const qrCode = await generateQRCode(
        ticketDetails.ticketDetails.eventname,
        ticketDetails.ticketDetails.name
      );

      const updatedTicketDetails = {
        ...ticketDetails,
        ticketDetails: {
          ...ticketDetails.ticketDetails,
          qr: qrCode,
        }
      };

      await axios.post(`/ticket/createticket`, updatedTicketDetails);
      alert("Ticket Created");
      setRedirect(true);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  async function generateQRCode(name, eventName) {
    try {
      const qrCodeData = await Qrcode.toDataURL(
        `Event Name: ${name} \n Name: ${eventName}`
      );
      return qrCodeData;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  }

  if (redirect) {
    return <Navigate to={'/wallet'} />;
  }

  return (
    <>
      <div>
        <Link to={`/event/${event._id}/ordersummary`}>
          <button className='inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-sm'>
            <IoMdArrowBack className='font-bold w-6 h-6 gap-2' /> Back
          </button>
        </Link>
      </div>
      <div className="ml-12 bg-gray-100 shadow-lg mt-8 p-16 w-3/5 float-left">
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-bold mb-4">Transaction ID</h2>
          <input
            type="text"
            name="transactionId"
            value={ticketDetails.ticketDetails.transactionId}
            onChange={handleChangeTransactionId}
            placeholder="Transaction ID"
            className="input-field w-80 ml-3 h-10 bg-gray-50 border border-gray-300 rounded-sm p-2.5"
          />
        </div>
        <div className="float-right">
          <p className="text-sm font-semibold pb-2 pt-8">Total : INR. {event.ticketPrice}</p>
          <button
            type="button"
            onClick={createTicket}
            className="primary"
          >
            Make Payment
          </button>
        </div>
      </div>
      <div className="float-right bg-blue-100 w-1/4 p-5 mt-8 mr-12">
        <h2 className="text-xl font-bold mb-8">Order Summary</h2>
        <div className="space-y-1">
          <div>
            <p className="float-right">1 Ticket</p>
          </div>
          <p className="text-lg font-semibold">{event.title}</p>
          <p className="text-xs">{event.eventDate.split("T")[0]},</p>
          <p className="text-xs pb-2"> {event.eventTime}</p>
          <hr className="my-2 border-t pt-2 border-gray-400" />
          <p className="float-right font-bold">INR. {event.ticketPrice}</p>
          <p className="font-bold">Sub total: {event.ticketPrice}</p>
        </div>
      </div>
    </>
  );
}
