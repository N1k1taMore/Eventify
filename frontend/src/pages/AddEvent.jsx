import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function AddEvent() {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setdescription] = useState('');
  const [organizedBy, setorganizedBy] = useState('');
  const [eventDate, seteventDate] = useState('');
  const [eventTime, seteventTime] = useState('');
  const [location, setlocation] = useState('');
  const [ticketPrice, setticketPrice] = useState('');
  const [file, setFile] = useState(null);
  const [qrcode, setqrcode] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const event = {
      title,
      description,
      organizedBy,
      eventDate,
      eventTime,
      location,
      ticketPrice,
      userId: user._id,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append('image', filename);
      data.append('file', file);
      event.image = filename;

      try {
        const imgUpload = await axios.post('/upload', data);
        console.log(imgUpload.data);
      } catch (err) {
        console.log(err);
      }
    }
    if (qrcode) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append('image', filename);
      data.append('file', qrcode);
      event.qrcode = filename;

      try {
        const imgUpload = await axios.post('/upload', data);
        console.log(imgUpload.data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const res = await axios.post('/event/createEvent', event, {
        withCredentials: true,
      });
      navigate('/');
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col ml-20 mt-10">
      <div>
        <h1 className="font-bold text-[36px] mb-5">Post an Event</h1>
      </div>

      <form className="flex flex-co">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col">
            Title:
            <input
              type="text"
              name="title"
              className=" rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="flex flex-col">
            Description:
            <textarea
              name="description"
              className=" rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => setdescription(e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            Organized By:
            <input
              type="text"
              className=" rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              name="organizedBy"
              onChange={(e) => setorganizedBy(e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            Event Date:
            <input
              type="date"
              className=" rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              name="eventDate"
              onChange={(e) => seteventDate(e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            Event Time:
            <input
              type="time"
              name="eventTime"
              className=" rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => seteventTime(e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            Location:
            <input
              type="text"
              name="location"
              className=" rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => setlocation(e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            Ticket Price:
            <input
              type="number"
              name="ticketPrice"
              className=" rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => setticketPrice(e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            Image:
            <input
              type="file"
              name="image"
              className=" rounded mt-2 pl-5 px-4 py-10 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          <label className="flex flex-col">
            Qr code:
            <input
              type="file"
              name="image"
              className=" rounded mt-2 pl-5 px-4 py-10 ring-sky-700 ring-2 h-8 border-none"
              onChange={(e) => setqrcode(e.target.files[0])}
            />
          </label>
          <button className="primary" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
