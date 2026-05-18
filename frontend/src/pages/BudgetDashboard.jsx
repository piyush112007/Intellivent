import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function BudgetDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}/full-data`);
      const data = res.data.data || res.data;
      setEvent(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add single expense
  const addBudget = async () => {
    try {
      await API.post(`/events/${id}/budget`, {
        item,
        amount: Number(amount),
      });

      setItem("");
      setAmount("");
      fetchEvent();
    } catch {
      alert("Error adding budget");
    }
  };

  // ✅ Add multiple expenses
  const addMultiple = async () => {
    try {
      await API.post(`/events/${id}/budgets`, {
        budget: [
          { item: "Food", amount: 2000 },
          { item: "Decoration", amount: 1500 },
        ],
      });

      fetchEvent();
    } catch {
      alert("Error adding multiple budgets");
    }
  };

 if (loading) {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div className="h-8 w-64 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

        <div className="h-10 w-28 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

      </div>

      {/* ADD FORM */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6">

        <div className="h-6 w-40 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded mb-6"></div>

        <div className="grid md:grid-cols-2 gap-3 mb-4">

          <div className="h-11 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

          <div className="h-11 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

        </div>

        <div className="flex gap-3">

          <div className="h-10 w-36 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

          <div className="h-10 w-48 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="mb-6">

        <div className="h-6 w-52 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

      </div>

      {/* EXPENSE LIST */}
      <div className="space-y-3">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center"
          >

            <div className="h-5 w-40 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

            <div className="h-5 w-24 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

          </div>
        ))}

      </div>

    </div>
  );
}
  const totalSpent =
    event.budget?.reduce((sum, b) => sum + b.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 md:px-10 py-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Budget Dashboard</h1>

        <button
          onClick={() => navigate(`/event/${id}`)}
          className="bg-orange-600 px-4 py-2 rounded hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* ADD FORM */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Expense</h2>

        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <input
            placeholder="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={addBudget}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 hover:cursor-pointer"
          >
            Add Expense
          </button>

          <button
            onClick={addMultiple}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
          >
            Add Sample Multiple
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-6">
        <p className="text-lg">Total Spent: ₹{totalSpent}</p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {event.budget?.length === 0 ? (
          <p className="text-gray-400">No expenses yet</p>
        ) : (
          event.budget.map((b, i) => (
            <div
              key={i}
              className="bg-gray-800 p-3 rounded flex justify-between"
            >
              <p>{b.item}</p>
              <p>₹{b.amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BudgetDashboard;