import React, { useState } from "react";
import Home from "../dashboard/Home";
import Todos from "../dashboard/Todos";
import Contributors from "../dashboard/Contributors";
import Settings from "../dashboard/Settings";
import Timeline from "../dashboard/Timeline";
import storage from "../utils/storage";
import { useMediaQuery } from "react-responsive";
// import Selection from "../components/Selection";

export default function Dashboard() {
  const [menu, setMenu] = useState(1);
  const [tags, setTags] = useState(storage.getTags());
  const [selectedTag, setSelectedTag] = useState(
    storage.getLastTag() ?? tags[0] ?? null
  );
  const updateTags = (tags) => setTags(tags);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [homepageResults, setHomePageResults] = useState(false);
  const [timelinePageResults, setTimelinePageResults] = useState(false);
  const [todoPageResults, setTodoPageResults] = useState(false);
  const [contributorsPageResults, setContributorsPageResults] = useState(false);

  function updateHomePageResults(results) {
    setHomePageResults(results);
  }

  function updateTimelinePageResults(results) {
    setTimelinePageResults(results);

    if (!results.is_storage_data) {
      let current_results = JSON.parse(storage.get("timeline_data") ?? "{}");
      current_results[results.tag] = {
        data: results.data,
        time: new Date().getTime(),
      };

      storage.save("timeline_data", JSON.stringify(current_results));
    }
  }

  function updateContributorsPageResults(results) {
    setContributorsPageResults(results);
  }

  function updateTodoPageResults(results) {
    setTodoPageResults(results);
  }

  function updateSelectedTag(tag) {
    setSelectedTag(tag);
    storage.save("lastTag", tag);
  }

  return isMobile ? (
    <div className={"text-gray-300 desc text-center pt-80 text-xl"}>
      View on a bigger device!
    </div>
  ) : (
    <div className="flex  min-h-screen">
      <div
        className="
        md:flex flex-col
        w-80
        h-screen
        px-4
        py-8
        hidden
        desc
        "
      >
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="fixed">
            <img
              src="assets/superflow3.png"
              className="w-28 text-center mb-10 ml-4"
            />
            <button
              className={
                "flex items-center px-4 py-2 rounded-md " +
                (menu == 1
                  ? "white-glassmorphism text-gray-300 rounded-md "
                  : "text-gray-300")
              }
              onClick={() => setMenu(1)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>

              <span className="mx-4 font-medium">Home</span>
            </button>

            <button
              className={
                "flex items-center px-4 py-2 mt-5 rounded-md " +
                (menu == 2
                  ? "white-glassmorphism text-gray-300 rounded-md "
                  : "text-gray-300")
              }
              onClick={() => setMenu(2)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <span className="mx-4 font-medium">Timeline</span>
            </button>

            <button
              className={
                "flex items-center px-4 py-2 mt-5 rounded-md " +
                (menu == 3
                  ? "white-glassmorphism text-gray-300 rounded-md "
                  : "text-gray-300")
              }
              onClick={() => setMenu(3)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>

              <span className="mx-4 font-medium">TODOs</span>
            </button>

            <button
              className={
                "flex items-center px-4 py-2 mt-5 rounded-md " +
                (menu == 4
                  ? "white-glassmorphism text-gray-300 rounded-md "
                  : "text-gray-300")
              }
              onClick={() => setMenu(4)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>

              <span className="mx-4 font-medium">Contributors</span>
            </button>

            <button
              className={
                "flex items-center px-4 py-2 mt-5 rounded-md " +
                (menu == 5
                  ? "white-glassmorphism text-gray-300 rounded-md "
                  : "text-gray-300")
              }
              onClick={() => setMenu(5)}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mx-4 font-medium">Settings</span>
            </button>

            <hr className="my-6 mt-32 dark:border-gray-600" />

            <button
              className="
              flex
              items-center
              px-4
              py-2
              mt-5
              text-gray-300
              transition-colors
              duration-200
              transform
              rounded-md
              dark:text-gray-400
              dark:hover:bg-gray-700 dark:hover:text-gray-300
              desc

              "
              href="#"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <a href="https://cipher-infoline.gitbook.io/superflow/">
                <span className="mx-4 font-medium">Guide</span>
              </a>
            </button>

            <a
              className="
              flex
              items-center
              px-4
              py-2
              mt-5
              text-gray-300
              transition-colors
              duration-200
              transform
              rounded-md
              dark:text-gray-400
              dark:hover:bg-gray-700 dark:hover:text-gray-300
              desc
              "
              href="https://github.com/autonome/superflow"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                ></path>
              </svg>

              <span className="mx-4 font-medium">Github</span>
            </a>
          </nav>
        </div>
      </div>
      <div className="hidden md:flex flex-col glass m-4 pl-10  px-4 w-full  mr-4 ml-6">
        {/* <MobileNavbar> */}
        <div className="flex w-full  mt-4 justify-between space-x-5">
          <div className="text-gray-300 h-14 heading text-4xl items-center mt-4">
            {menu == 1 && <>Home</>}
            {menu == 2 && <>Timeline</>}
            {menu == 3 && <>TODOs</>}
            {menu == 4 && <>Contributors</>}
            {menu == 5 && <>Settings</>}
          </div>
          {tags.length ? (
            <div
              className="items-center px-3  h-14   text-right 
            white-glassmorphism py-3 rounded-xl hidden md:flex"
            >
              <svg
                class="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
              {/* <Selection /> */}
              <select
                className="ml-5 p-2 heading text-white rounded-lg glass border border-gray-300 shadow-lg"
                onChange={(e) => updateSelectedTag(e.target.value)}
                defaultValue={selectedTag}
              >
                {tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              {/*//TODO*/}
            </div>
          ) : (
            <button
              onClick={() => setMenu(5)}
              className="p-3 desc  text-gray-300 rounded-lg glass border border-gray-300 shadow-lg hover:bg-orange-400 hover:text-black"
            >
              Get started by adding a tag
            </button>
            //TODO
          )}
        </div>

        {!isMobile && (
          <>
            {/* Handle the page switches here */}
            {menu == 1 && (
              <Home
                selectedTag={selectedTag}
                mainState={homepageResults}
                updateMainState={updateHomePageResults}
              />
            )}
            {menu == 2 && (
              <Timeline
                selectedTag={selectedTag}
                mainState={timelinePageResults}
                updateMainState={updateTimelinePageResults}
              />
            )}
            {menu == 3 && (
              <Todos
                selectedTag={selectedTag}
                mainState={todoPageResults}
                updateMainState={updateTodoPageResults}
              />
            )}
            {menu == 4 && (
              <Contributors
                selectedTag={selectedTag}
                mainState={contributorsPageResults}
                updateMainState={updateContributorsPageResults}
              />
            )}
            {menu == 5 && (
              <Settings
                tags={tags}
                setTags={updateTags}
                updateSelectedTag={updateSelectedTag}
                selectedTag={selectedTag}
              />
            )}
          </>
        )}
        {/* </MobileNavbar> */}
      </div>

      {isMobile && (
        /* For mobile devices */
        <div className="md:hidden sm:flex flex-col  pl-6 px-4 w-full min-h-screen">
          <div className="w-full min-h-screen mb-20  md:hidden sm:block">
            <div className="flex w-full  mt-4 justify-between space-x-5">
              <div className="text-gray-300 h-14 heading text-4xl items-center mt-4">
                {menu == 1 && (
                  <Home
                    selectedTag={selectedTag}
                    mainState={homepageResults}
                    updateMainState={updateHomePageResults}
                  />
                )}
                {menu == 2 && (
                  <Timeline
                    selectedTag={selectedTag}
                    mainState={timelinePageResults}
                    updateMainState={updateTimelinePageResults}
                  />
                )}
                {menu == 3 && (
                  <Todos
                    selectedTag={selectedTag}
                    mainState={todoPageResults}
                    updateMainState={updateTodoPageResults}
                  />
                )}
                {menu == 4 && (
                  <Contributors
                    selectedTag={selectedTag}
                    mainState={contributorsPageResults}
                    updateMainState={updateContributorsPageResults}
                  />
                )}
                {menu == 5 && (
                  <Settings
                    tags={tags}
                    setTags={updateTags}
                    updateSelectedTag={updateSelectedTag}
                    selectedTag={selectedTag}
                  />
                )}
              </div>
              {tags.length ? (
                <div
                  className="items-center px-4 -mx-2  h-14   text-right
            py-3 rounded-xl hidden md:flex"
                >
                  {/* <Selection /> */}
                  <select
                    className="ml-5 p-2 heading text-white rounded-lg glass  border border-gray-300 shadow-lg"
                    onChange={(e) => updateSelectedTag(e.target.value)}
                    defaultValue={selectedTag}
                  >
                    {/*//TODO*/}
                    {tags.map((tag, index) => (
                      <option key={index} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <button
                  onClick={() => setMenu(5)}
                  className="bg-black text-white px-3"
                >
                  Add tag
                </button> //TODO
              )}
            </div>
            <section
              id="bottom-navigation"
              className="w-full block fixed inset-x-0 bottom-0 z-10 h-14 items-center pt-3 pl-7 darkglass text-gray-300 shadow"
            >
              <div id="tabs" className="flex justify-between text-center ">
                <a
                  onClick={() => setMenu(1)}
                  className="w-full ml-5  focus:text-orange-400 hover:text-orange-400 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </a>
                <a
                  onClick={() => setMenu(2)}
                  className="w-full focus:text-orange-400 hover:text-orange-400 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </a>
                <a
                  onClick={() => setMenu(3)}
                  className="w-full focus:text-orange-400 hover:text-orange-400 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </a>
                <a
                  onClick={() => setMenu(4)}
                  className="w-full focus:text-orange-400 hover:text-orange-400 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </a>
                <a
                  onClick={() => setMenu(5)}
                  className="w-full focus:text-orange-400 hover:text-orange-400 justify-center inline-block text-center pt-2 pb-1"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
