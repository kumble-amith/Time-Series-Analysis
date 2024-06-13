import { Bird, Rabbit, Turtle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function formatForRecharts(obj) {
  var dataForRecharts = [];

  for (var i = 0; i < obj.x.length; i++) {
    dataForRecharts.push({
      x: obj.x[i],
      y: obj.y[i],
    });
  }

  return dataForRecharts;
}

function convertPredValueWithDates(obj, startDate) {
  var predValueObjects = [];
  var currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  for (var i = 0; i < obj.predValue.length; i++) {
    var day = ("0" + currentDate.getDate()).slice(-2);
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
    var year = currentDate.getFullYear();

    var formattedDate = `${year}-${month}-${day}`;

    predValueObjects.push({
      x: formattedDate,

      py: obj.predValue[i],
      lost: obj.loss[i],
    });

    // Increase the date by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return predValueObjects;
}

export default function MainForm({ setCsvfile, csvfile, setData }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [state, setState] = useState({
    scalerUser: "MinMaxScaler",
    epoch: "",
    predDays: "",
    op: "",
  });

  const updateStateValue = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", csvfile);
    formData.append(
      "values",
      JSON.stringify({ ...state, fileName: csvfile.name })
    );

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      const formatedData = formatForRecharts(data);
      const predValue = convertPredValueWithDates(
        data,
        formatedData[formatedData.length - 1].x
      );
      setData({
        points: [...formatedData, ...predValue],
        predValue: predValue,
      });
      console.log({
        points: [...formatedData, ...predValue],
        predValue: predValue,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="grid w-full items-start gap-6">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Select Alogrithm
        </legend>
        {/* <div className="grid gap-3">
          <Label htmlFor="model">Model</Label>
          <Select>
            <SelectTrigger
              id="model"
              className="items-start [&_[data-description]]:hidden"
            >
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="genesis">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Rabbit className="size-5" />
                  <div className="grid gap-0.5">
                    <p>
                      Neural{" "}
                      <span className="font-medium text-foreground">
                        Genesis
                      </span>
                    </p>
                    <p className="text-xs" data-description>
                      Our fastest model for general use cases.
                    </p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="explorer">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Bird className="size-5" />
                  <div className="grid gap-0.5">
                    <p>
                      Neural{" "}
                      <span className="font-medium text-foreground">
                        Explorer
                      </span>
                    </p>
                    <p className="text-xs" data-description>
                      Performance and speed for efficiency.
                    </p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="quantum">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Turtle className="size-5" />
                  <div className="grid gap-0.5">
                    <p>
                      Neural{" "}
                      <span className="font-medium text-foreground">
                        Quantum
                      </span>
                    </p>
                    <p className="text-xs" data-description>
                      The most powerful model for complex computations.
                    </p>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        <div className="grid gap-3">
          <Label htmlFor="temperature">Epochs</Label>
          <Input
            onChange={(e) => updateStateValue("epoch", e.target.value)}
            id="temperature"
            min="1"
            type="number"
            placeholder="0.4"
            value={state.epoch}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="top-p">Input Column Name</Label>
            <Input
              onChange={(e) => updateStateValue("ip", e.target.value)}
              id="top-p"
              type="text"
              placeholder="Input Column Name"
              value={state.ip}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="top-k">Output Column Name</Label>
            <Input
              onChange={(e) => updateStateValue("op", e.target.value)}
              id="top-k"
              type="text"
              value={state.op}
              placeholder="Output Column Name"
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="temperature">Number of Points to Predict</Label>
          <Input
            id="temperature"
            min="1"
            max="100"
            type="number"
            placeholder="6"
            value={state.predDays}
            onChange={(e) => updateStateValue("predDays", e.target.value)}
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">Options</legend>
        <div className="grid gap-3">
          <Label htmlFor="role">Scalar</Label>
          <Select
            onValueChange={(value) => updateStateValue("scalerUser", value)}
            value={state.scalerUser}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MinMaxScaler">Minmax Scaler</SelectItem>
              <SelectItem value="StandardScaler">Standard Scaler</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-3">
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
