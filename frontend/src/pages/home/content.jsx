import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Graph from "./graph";

export default function Content({ setCsvfile, data, setData }) {
  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setCsvfile(e.target.files[0]);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      {data != null ? (
        <div className="h-full w-full">
          <Graph data={data} />
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">Data File</Label>
          <Input onChange={handleImage} id="file" type="file" />
        </div>
      )}
    </div>
  );
}
