import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import axios from "../utils/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { PolarArea } from "react-chartjs-2";

import storage from "../utils/storage";
import Loader from "../components/Loader";

export default function Timeline(props) {
  let tag = props.selectedTag;
  let lastFetchedTag = props.mainState ? props.mainState.tag : null;

  const [isDataFetched, setIsDataFetched] = useState(
    props.mainState && tag === props.mainState.tag
  );

  let stored_data = JSON.parse(storage.get("timeline_data") ?? "{}");

  let isDataFetching = false;

  const [total, setTotal] = useState(
    props.mainState && tag == props.mainState.tag
      ? props.mainState.data.total
      : {}
  );
  const [noAnswers, setNoAnswers] = useState(
    props.mainState && tag == props.mainState.tag
      ? props.mainState.data.not_answered
      : {}
  );
  const [unanswered, setUnanswered] = useState(
    props.mainState && tag == props.mainState.tag
      ? props.mainState.data.unanswered
      : {}
  );

  const [createdAt, setCreatedAt] = useState(
    props.mainState && tag == props.mainState.tag
      ? props.mainState.data.created_at
      : {}
  );

  let current_date = new Date();
  let date_before_3_months = Math.round(
    new Date().setMonth(current_date.getMonth() - 3) / 1000
  );
  let date_before_6_months = Math.round(
    new Date().setMonth(current_date.getMonth() - 6) / 1000
  );
  let date_before_9_months = Math.round(
    new Date().setMonth(current_date.getMonth() - 9) / 1000
  );
  let date_before_12_months = Math.round(
    new Date().setMonth(current_date.getMonth() - 12) / 1000
  );

  const endpoints = [
    "questions",
    "questions/no-answers",
    "questions/unanswered",
  ];

  const requests = {
    months1_3: {
      params: {
        tagged: tag,
        fromdate: date_before_3_months,
        filter: "!aj9TLrP)IfsuP_",
      },
    },
    months4_6: {
      params: {
        tagged: tag,
        fromdate: date_before_6_months,
        todate: date_before_3_months,
        filter: "!aj9TLrP)IfsuP_",
      },
    },
    months7_9: {
      params: {
        tagged: tag,
        fromdate: date_before_9_months,
        todate: date_before_6_months,
        filter: "!aj9TLrP)IfsuP_",
      },
    },
    months9_12: {
      params: {
        tagged: tag,
        fromdate: date_before_12_months,
        todate: date_before_9_months,
        filter: "!aj9TLrP)IfsuP_",
      },
    },
  };

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async function fetchCreatedAt() {
    let response = await axios.get(`questions`, {
      params: {
        tagged: tag,
        sort: "creation",
        order: "asc",
        pagesize: 1,
        filter: "!0WJ3YL7_.H..ZHFL0ZSaCDbpb",
      },
    });

    return response.data.items[0].creation_date * 1000;
  }

  async function fetchData() {
    if (lastFetchedTag === tag || isDataFetching) {
      return;
    }

    setIsDataFetched(false);
    isDataFetching = true;

    let is_storage_data = false;
    let total_obj_var = {};
    let unanswered_obj_var = {};
    let not_answered_obj_var = {};
    let created_at = null;

    if (
      stored_data[tag] &&
      new Date().setDate(new Date().getDate() - 7) < stored_data[tag].time
    ) {
      let data = stored_data[tag].data;
      total_obj_var = data.total;
      unanswered_obj_var = data.unanswered;
      not_answered_obj_var = data.not_answered;
      created_at = data.created_at;

      is_storage_data = true;
    } else {
      await asyncForEach(endpoints, async (endpoint) => {
        await asyncForEach(
          Object.entries(requests),
          async ([request_name, request]) => {
            await axios
              .get(endpoint, {
                params: request.params,
              })
              .then(async (response) => {
                switch (endpoint) {
                  case "questions":
                    total_obj_var[request_name] = response.data.total;

                    break;
                  case "questions/no-answers":
                    not_answered_obj_var[request_name] = response.data.total;
                    break;
                  case "questions/unanswered":
                    unanswered_obj_var[request_name] =
                      response.data.total - not_answered_obj_var[request_name];
                    break;
                }
              });
          }
        );

        //Wait for few seconds to prevent IP Ban
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });
      });

      created_at = await fetchCreatedAt();
    }

    lastFetchedTag = tag;
    setIsDataFetched(true);
    setTotal(total_obj_var);
    setNoAnswers(not_answered_obj_var);
    setUnanswered(unanswered_obj_var);
    setCreatedAt(created_at);
    props.updateMainState({
      tag: tag,
      data: {
        total: total_obj_var,
        unanswered: unanswered_obj_var,
        not_answered: not_answered_obj_var,
        created_at: created_at,
      },
      is_storage_data,
    });
    isDataFetching = false;
  }

  function renderLineChart() {
    if (isDataFetched) {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );

      const options = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },
          y: {
            ticks: {
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
          },
        },
        color: "white",
      };

      const labels = [
        "9 months ago",
        "6 months ago",
        "3 months ago",
        "Present",
      ];

      const data = {
        labels,
        datasets: [
          {
            label: "Total",
            data: Object.values(total).reverse(),
            borderColor: "rgba(75, 192, 192, 0.5)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Not-accepted",
            data: Object.values(unanswered).reverse(),
            borderColor: "rgba(255, 206, 86, 0.5)",
            backgroundColor: "rgba(255, 206, 86, 0.5)",
          },
          {
            label: "Unanswered ",
            data: Object.values(noAnswers).reverse(),
            borderColor: "rgba(255, 99, 132, 0.5)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };

      return (
        <Line
          style={{ maxHeight: 354, maWidth: 1174 }}
          options={options}
          data={data}
        />
      );
    }
    return "";
  }

  function renderBarChart() {
    if (isDataFetched) {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

      const options = {
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },
          y: {
            ticks: {
              color: "white",
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        color: "white",
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            bodySpacing: 6,
            callbacks: {
              title: function () {},
            },
          },
        },
      };

      const labels = [
        "9 months ago",
        "6 months ago",
        "3 months ago",
        "Present",
      ];

      const data = {
        labels,
        datasets: [
          {
            label: "Total",
            data: Object.values(total).reverse(),
            backgroundColor: ["rgba(75, 192, 192, 0.3)"],
            borderColor: ["rgba(75, 192, 192, 1)"],
            borderWidth: 1,
          },
          {
            label: "Not-accepted",
            data: Object.values(unanswered).reverse(),
            backgroundColor: ["rgba(255, 206, 86, 0.3)"],
            borderColor: ["rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
          {
            label: "Unanswered",
            data: Object.values(noAnswers).reverse(),
            backgroundColor: ["rgba(255, 99, 132, 0.3)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      };

      return (
        <Bar
          style={{ maxHeight: 354, maWidth: 1174 }}
          options={options}
          data={data}
        />
      );
    }
    return "";
  }

  function renderPolarAreaChart() {
    if (isDataFetched) {
      ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

      const options = {
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false,
              color: "white",
            },
          },
          y: {
            ticks: {
              display: false,
              color: "white",
            },
          },
        },
        color: "white",
      };

      const data = {
        labels: ["Present", "3 months ago", "6 months ago", "9 months ago"],
        datasets: [
          {
            label: "Total Questions",
            data: Object.values(total),
            backgroundColor: [
              "rgba(54, 162, 235, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
            ],
            borderWidth: 1,
          },
        ],
      };

      return (
        <PolarArea
          style={{ maxHeight: 354, maxWidth: 1174 }}
          data={data}
          options={options}
        />
      );
    }
    return "";
  }

  useEffect(async () => {
    if (tag) {
      await fetchData();
    }
  }, [tag]);

  return tag ? (
    isDataFetched ? (
      <div className="flex flex-col">
        <Tab.Group>
          <Tab.List className="text-center space-x-3 mb-3">
            <Tab
              className={({ selected }) =>
                selected
                  ? "glass p-2 text-orange-300 border border-orange-300 desc"
                  : "white-glassmorphism p-2 text-gray-300 desc"
              }
            >
              Line Chart
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? "glass p-2 text-orange-300 border border-orange-300 desc"
                  : "white-glassmorphism p-2 text-gray-300 desc"
              }
            >
              Bar Chart
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? "glass p-2 text-orange-300 border border-orange-300 desc"
                  : "white-glassmorphism p-2 text-gray-300 desc"
              }
            >
              Polar Area Chart
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="p-1 shadow-xl  rounded-2xl">
                <div className="block white-glassmorphism border rounded-xl">
                  <div className="sm:p-5">{renderLineChart()}</div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="p-1 shadow-xl  rounded-2xl">
                <div className="block white-glassmorphism border rounded-xl">
                  <div className="sm:p-5" style={{ minHeight: 393.6 }}>
                    {renderBarChart()}
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="p-1 shadow-xl  rounded-2xl">
                <div className="block white-glassmorphism border rounded-xl">
                  <div className="sm:p-5">{renderPolarAreaChart()}</div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className="flex flex-wrap -mx-3 overflow-hidden">
          <div className="my-3 px-3 w-1/2 overflow-hidden lg:w-1/4 xl:w-1/4">
            <div className="p-1 shadow-xl  rounded-2xl">
              <div className="block p-6 white-glassmorphism    border sm:p-8 rounded-xl">
                <div className="sm:pr-8">
                  <h5 className="text-md font-bold heading text-green-300">
                    {total.months1_3 > total.months4_6 ? (
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-red-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg%22%3E"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        ></path>
                      </svg>
                    )}
                  </h5>

                  <p className="mt-2 text-sm desc text-gray-300">
                    Tag health over time
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-3 px-3 w-1/2 overflow-hidden lg:w-1/4 xl:w-1/4">
            <div className="p-1 shadow-xl  rounded-2xl">
              <div className="block p-6 white-glassmorphism    border sm:p-8 rounded-xl">
                <div className="sm:pr-8">
                  <h5 className="text-md font-bold heading text-green-300">
                    {unanswered.months1_3 + noAnswers.months1_3 <
                    unanswered.months4_6 + noAnswers.months4_6 ? (
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-red-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg%22%3E"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        ></path>
                      </svg>
                    )}
                  </h5>

                  <p className="mt-2 text-sm desc text-gray-300">
                    Tag supportiveness
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-3 px-3 w-1/2 overflow-hidden  lg:w-1/4 xl:w-1/4">
            <div className="p-1 shadow-xl  rounded-2xl">
              <div className="block p-6 white-glassmorphism    border sm:p-8 rounded-xl">
                <div className="sm:pr-8">
                  <h5 className="text-md font-bold heading text-orange-300">
                    {createdAt ? new Date(createdAt).toDateString() : ""}
                  </h5>

                  <p className="mt-2 text-sm desc text-gray-300">
                    Tag Created at
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-3 px-3 w-1/2 overflow-hidden lg:w-1/4 xl:w-1/4">
            <div className="p-1 shadow-xl  rounded-2xl">
              <div className="block p-6 white-glassmorphism    border sm:p-8 rounded-xl">
                <div className="sm:pr-8">
                  <h5 className="text-md font-bold heading text-orange-300">
                    {createdAt
                      ? (
                          new Date().getFullYear() -
                          new Date(createdAt).getFullYear()
                        ).toString() + " years"
                      : ""}
                  </h5>

                  <p className="mt-2 text-sm desc text-gray-300">Tag age</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Loader />
    )
  ) : (
    <div className="desc text-gray-300 flex justify-center mt-60">
    You have not added any tag yet
  </div>
  );
}
