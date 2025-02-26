import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import data from "./questionData/data.json";
import moment from "moment";

export const MainQuestion = () => {
  const socket = useSocket();
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [presentStage, setPresentStage] = useState<string>("");

  const [myPick, setMyPick] = useState<{} | null>(null);
  const [chartArray, setChartArray] = useState<[] | null>([]);
  const [viewChartArray, setViewChartArray] = useState<[] | null>([]);
  const [timing, setTiming] = useState<number>(20);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (timing > 0) {
        setTiming(timing - 1);
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [timing]);

  useEffect(() => {
    socket?.emit("questionNumber", questionNumber);
    socket?.on("questionNumber", (read) => {
      setQuestionNumber(read);
    });

    socket?.emit("presentStage", presentStage);
    socket?.on("presentStage", (read) => {
      setPresentStage(read);
    });

    socket?.emit("chart", chartArray);
    socket?.on("chart", (read) => {
      setViewChartArray(read);
    });
  }, [
    socket,
    presentStage,
    questionNumber,
    myPick,
    // chartArray,
    // viewChartArray,
  ]);

  const myData: any = { ...data };

  return (
    <div className="relative">
      <div className="flex gap-4 justify-between mt-20 px-5 h-[800px] ">
        <div
          className={`text-[20px] h-[50px] w-[50px] rounded-full absolute top-[-60px] bg-slate-100 flex justify-center items-center shadow-inner border ${
            timing < 6 ? "text-red-500 font-bold" : "text-black "
          } `}
        >
          {timing}
        </div>
        <div className="w-[200px] border rounded-md h-full flex flex-col items-center justify-center">
          {Object.keys(data).map((el: string, i: number) => (
            <button
              key={i}
              className={` border px-10 py-3 ${
                presentStage === el ? "bg-blue-950 text-white" : "bg-slate-50"
              } rounded-md my-4`}
              onClick={() => {
                setPresentStage(el);
              }}
            >
              {el}
            </button>
          ))}
        </div>

        <div className="flex-1 border rounded-md px-8 ">
          <h1 className="text-center my-4 font-semibold text-[20px]">
            Question : {myData[presentStage]?.data[questionNumber]?.id}
          </h1>
          <p>{myData[presentStage]?.id}</p>
          <h1
            className="text-center my-4 font-semibold text-[20px] px-10 py-3 border rounded-md bg-red-500 text-white cursor-pointer"
            onClick={() => {
              setQuestionNumber((el) => el + 1);
              setTiming(20);
            }}
          >
            Next Question
          </h1>

          <p className="text-[20px] mt-10">
            {myData[presentStage]?.data[questionNumber]?.title}
          </p>

          <hr className="mb-8 mt-8" />

          {timing === 0 ? (
            <div className="flex justify-center items-center h-[50px] w-full bg-slate-100 border rounded-md shadow-inner text-red-500 text-[20px]">
              Time's Up!!!
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-10">
              {myData[presentStage]?.data[questionNumber]?.options.map(
                (el: any, i: number) => (
                  <div
                    key={i}
                    className={`cursor-pointer transition-all duration-300 border p-3 rounded-md flex-1
                    ${
                      myPick?.id === el.id
                        ? "bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                        : "bg-slate-50 hover:bg-slate-100"
                    }
                    `}
                    onClick={() => {
                      setMyPick({
                        ...el,
                        createdAt: moment(new Date().getTime()).format("LTS"),
                      });
                      let x: any = [
                        ...chartArray!,
                        {
                          ...el,
                          createdAt: moment(new Date().getTime()).format("LTS"),
                        },
                      ];
                      setChartArray(x!);
                    }}
                  >
                    {" "}
                    {el.id}.{" "}
                    <span className="capitalize ml-4">{el.option}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="p-3  flex gap-2 flex-wrap  max-w-[450px] max-h-[500px] ">
          {viewChartArray?.map((el: any, i: number) => (
            <div
              key={i}
              className={`border rounded-md w-[200px] h-[120px] p-2 text-[12px] flex flex-col justify-between ${
                el.correct ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <p>
                Name: <strong>Peter Oti</strong>
              </p>
              <p>
                Option:<strong>{el.id}</strong>
              </p>
              <p>
                Time: <strong>{el.createdAt}</strong>
              </p>
              <p>
                School: <strong>School's Name</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
