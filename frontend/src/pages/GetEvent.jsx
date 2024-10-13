import axios from "axios";
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";


export default function EventTickets() {
    const {id} = useParams();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if(!id){
        return;
      }

    axios.get(`/event/${id}/getticket`)
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setTickets(response.data);
        }
      })
      .catch((error) => {
        setError("An error occurred while fetching tickets.");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>{error}</p>;
  if (tickets.length === 0) return <p>No tickets available for this event.</p>;

  return (
<div className="mx-5 xl:mx-32 md:mx-10 mt-5">
  <h1 className="text-3xl font-bold mb-4">Tickets for Event</h1>
  <table className="min-w-full bg-white border border-gray-300">
    <thead>
      <tr>
        <th className="py-2 px-4 border-b">User Name</th>
        <th className="py-2 px-4 border-b">Email</th>
        <th className="py-2 px-4 border-b">Transaction ID</th>
        <th className="py-2 px-4 border-b">Price</th>
    
      </tr>
    </thead>
    <tbody>
      {tickets.map((ticket) => (
        <tr key={ticket._id} className="hover:bg-gray-100">
          <td className="py-2 px-4 border-b">{ticket.ticketDetails.name}</td>
          <td className="py-2 px-4 border-b">{ticket.ticketDetails.email}</td>
          <td className="py-2 px-4 border-b">{ticket.ticketDetails.transactionId}</td>
          <td className="py-2 px-4 border-b">INR {ticket.ticketDetails.ticketprice}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
