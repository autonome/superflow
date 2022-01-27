import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import axios from "../utils/axios";

export default function Todos(props) {
  let tag = props.selectedTag;
  let lastFetchedTag = props.mainState ? props.mainState.tag : null;

  const [type, setType] = useState(
    props.mainState ? props.mainState.type : "unanswered"
  );
  const [order, setOrder] = useState(
    props.mainState ? props.mainState.order : "desc"
  );
  const [page, setPage] = useState(props.mainState ? props.mainState.page : 1);

  const [data, setData] = useState(
    props.mainState ? props.mainState.results : null
  );
  const [isDataFetched, setIsDataFetched] = useState(
    props.mainState && tag === props.mainState.tag
  );

  let isDataFetching = false;

  function fetchData() {
    if (
      (lastFetchedTag === tag &&
        props.mainState.type === type &&
        props.mainState.order === order &&
        props.mainState.page == page) ||
      isDataFetching
    ) {
      return;
    }

    isDataFetching = true;
    setIsDataFetched(false);

    let request_page = page;

    if (
      lastFetchedTag &&
      (lastFetchedTag !== tag ||
        props.mainState.type !== type ||
        props.mainState.order !== order)
    ) {
      request_page = 1;
      setPage(1);
    }

    axios
      .get(`questions/${type}`, {
        params: {
          order,
          tagged: tag,
          sort: "creation",
          page: request_page,
        },
      })
      .then((response) => {
        setData(response.data);
        setIsDataFetched(true);
        lastFetchedTag = tag;
        props.updateMainState({
          tag: tag,
          type: type,
          order: order,
          page: request_page,
          results: response.data,
        });
        isDataFetching = false;
      });
  }

  useEffect(async () => {
    if (tag) {
      await fetchData();
    }
  }, [tag, type, order, page]);

  return tag ? (
    <div>
      <select
        onChange={(e) => setType(e.target.value)}
        className="mt-3 mb-4 p-2 heading text-white rounded-lg glass border border-gray-300 shadow-lg"
        defaultValue={type}
      >
        <option value="unanswered">Not accepted</option>
        <option value="no-answers">Unanswered</option>
      </select>
      <select
        onChange={(e) => setOrder(e.target.value)}
        className="ml-5 p-2 heading text-white rounded-lg glass border border-gray-300 shadow-lg"
        defaultValue={order}
      >
        <option value="desc">Latest</option>
        <option value="asc">Oldest</option>
      </select>
      <div className="flex flex-col">
        {isDataFetched ? (
          <div>
            {data.items.map((question, index) => (
              <div className="p-1 shadow-xl mb-4 mt-6  rounded-2xl" key={index}>
                <a
                  className="block p-6 white-glassmorphism    border sm:p-8 rounded-xl"
                  href={question.link}
                  target="_blank"
                >
                  <div className="flex justify-between">
                    <div className=" sm:pr-8 flex-col">
                      <p className="mt-2 text-sm desc text-orange-300">
                        {question.title}
                      </p>
                    </div>
                    {type === "unanswered" && (
                      <div className=" sm:pr-8 flex-col">
                        <p className="mt-2 text-sm desc text-gray-300">
                          Answer count: {question.answer_count}
                        </p>
                      </div>
                    )}
                  </div>
                  <hr className="my-4" />
                  <div className="justify-between flex">
                    <div className=" sm:pr-8 flex-col">
                      <a
                        href={question.owner.link}
                        className="mt-2 text-sm desc text-gray-300"
                      >
                        by Author: {question.owner.display_name}
                      </a>
                    </div>
                    <div className=" sm:pr-8 flex-col">
                      <p className="mt-2 text-sm desc text-gray-300">
                        Created on:{" "}
                        {new Date(
                          question.creation_date * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
            <div className={"flex justify-between"}>
              {page > 1 ? (
                <button
                  className={"bg-white p-2 px-4 mt-2 mb-5"}
                  onClick={() => {
                    setPage(page - 1);
                  }}
                >
                  Previous
                </button>
              ) : (
                ""
              )}
              {data.has_more ? (
                <button
                  className={"bg-white p-2 px-4 mt-2 mb-5"}
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Next
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  ) : (
    <div className="desc text-gray-300 flex justify-center mt-60">
    You have not added any tag yet
  </div>
  );
}
