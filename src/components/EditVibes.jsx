import { useState } from "react";
import axios from "../lib/axios.js";
import {Loader} from "./Loader";
import vibes from "../constants/vibes";
import { toast } from 'react-hot-toast'


export const EditVibes = ({ open, setOpen, setUser, myVibes=[] }) => {
  const [selected, setSelected] = useState([...myVibes]);
  const [loading, setLoading] = useState(false);


  const toggleVibe = (vibe) => {
    if (selected.includes(vibe)) {
      setSelected(selected.filter((v) => v !== vibe));
    } else if (selected.length < 3) {
      setSelected([...selected, vibe]);
    }
  };

  const handleSave = async () => {
    if (selected.length === 0) return
    setLoading(true);
    try {
      const { data } = await axios.put("/app/vibes", { vibes: selected });
      console.log(data)
      setUser(p => ({...p, vibes: data.vibes}))
      setLoading(false);
      setOpen(false);
    } catch {
      setLoading(false);
      toast.error("Failed to update vibes. Try again.");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[80]"
        onClick={() => !loading && setOpen(false)}
      />
      <div
        className="fixed z-90 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-md"
        style={{ zIndex: 90 }}
      >
        <h2 className="text-xl font-semibold mb-4">Select your vibes (up to 3)</h2>

        {/* Preview Selected */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.length === 0 ? (
            <p className="text-gray-500 font-medium">No vibes selected yet.</p>
          ) : (
            selected.map((v) => (
              <button
                key={v}
                onClick={() => toggleVibe(v)}
                className="bg-primary font-bold text-sm text-white px-3 py-1 rounded-full cursor-pointer
                           hover:bg-secondary transition"
                type="button"
                aria-label={`Remove vibe ${v}`}
              >
                {v} ×
              </button>
            ))
          )}
        </div>

        {/* Vibes List */}
        <div className="flex flex-wrap items-center gap-3 max-h-64 overflow-y-auto mb-6 no-scrollbar">
          {vibes.map((v) => {
            const isSelected = selected.includes(v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggleVibe(v)}
                className={`rounded-full px-3 py-2 text-center border text-sm font-bold
                            transition select-none
                            ${
                              isSelected
                                ? "bg-primary text-white border-primary"
                                : "bg-dark2 cursor-pointer border-transparent hover:border-primary"
                            }`}
              >
                {v}
              </button>
            );
          })}
        </div>
          {
          	loading ? <div className="w-fit mx-auto"><Loader /></div> : <button onClick={handleSave} className="bg-primary font-bold text-white px-3 py-3 rounded-lg w-full">
          	SAVE
          </button>
          }
      </div>
    </>
  );
};