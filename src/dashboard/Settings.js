import React, { useRef, useState } from "react";
import storage from "../utils/storage";

export default function Settings(props) {
  const [favourites, setFavourites] = useState(props.tags ?? []);
  let updateTags = (tags) => {
    setFavourites(tags);
    props.setTags(tags);

    if (props.selectedTag == null || props.selectedTag == "") {
      props.updateSelectedTag(tags[0]);
    }
  };

  const inputRef = useRef();

  function addFavourite() {
    let favourite = inputRef.current.value;

    if (favourite == "") {
      return;
    }

    let temp_fav = new Set(favourites);
    temp_fav.add(favourite);
    temp_fav = Array.from(temp_fav);
    updateTags(temp_fav);
    storage.save("favourites", temp_fav);
  }

  function removeFavourite(favourite) {
    let temp_fav = new Set(favourites);
    temp_fav.delete(favourite);
    temp_fav = Array.from(temp_fav);
    updateTags(temp_fav);
    storage.save("favourites", temp_fav);

    let current_results = JSON.parse(storage.get("timeline_data") ?? "{}");
    if (current_results[favourite]) {
      delete current_results[favourite];
      storage.save("timeline_data", JSON.stringify(current_results));
    }
    props.updateSelectedTag(temp_fav[0] ?? null);
  }

  function clearStorage() {
    updateTags([]);
    props.updateSelectedTag("");
    storage.clear();
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div>
          <h1 className="heading text-[#c415c4] text-xl mt-12">Tags</h1>
        </div>
      </div>

      {favourites.length ? (
        favourites.map((favourite, index) => (
          <div
            className="flex justify-between white-glassmorphism mt-4 w-full"
            key={index}
          >
            <h1 className="desc text-gray-300 text-left items-center mb-3 text-sm mt-3 ml-3">
              {favourite}
            </h1>
            <svg
              className="w-6 h-6 text-gray-300 hover:text-red-300 mt-3 mb-3 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => removeFavourite(favourite)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              >
                {""}
              </path>
            </svg>
          </div>
        ))
      ) : (
        <div>
          <h5 className="text-gray-300 mt-5 desc">
            You dont have any favourite tags yet.
          </h5>
        </div>
      )}
      <div className="mt-10">
        <input
          type="text"
          className="glass p-3 accent-[#c415c4] text-gray-300"
          placeholder="Enter tag"
          ref={inputRef}
        />
        <button
          onClick={() => addFavourite()}
          className="ml-3 glass border desc p-3 text-gray-300 border-gray-300 hover:bg-[#c415c4] hover:text-black"
        >
          Add Tag
        </button>
      </div>
      <h1 className="heading text-[#c415c4] mt-20 text-xl">
        Storage Preferences
      </h1>
      <br />
      <h5 className="text-gray-300 mt-5 desc text-md">
        All the data is stored locally in your device. If your application
        crashes or experiences bugs - please clear the local storage and try
        again.
      </h5>
      <br />
      <button
        onClick={() => {
          if (window.confirm("Are you sure?")) {
            clearStorage();
          }
        }}
        className="mt-10 glass border text-lg border-gray-300 desc p-3 text-gray-300 w-40 hover:bg-[#c415c4] hover:text-black"
      >
        Clear storage
      </button>
    </div>
  );
}
