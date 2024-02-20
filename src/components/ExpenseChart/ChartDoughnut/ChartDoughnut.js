import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartDoughnut = ({ labels, data, title }) => {
  return (
    <div>
      <h2 className="title">{title}</h2>
      <Doughnut
        data={{
          labels: labels,
          datasets: [
            {
              backgroundColor: [
                "#003f5c",
                "#374c80",
                "#7a5195",
                "#bc5090",
                "#ef5675",
                "#ff764a",
                "#ffa600",
              ],
              data: data,
            },
          ],
        }}
      />
    </div>
  );
};

export default ChartDoughnut;
