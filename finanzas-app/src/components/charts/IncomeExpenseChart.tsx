import { Doughnut } from 'react-chartjs-2';
import './chartConfig';

interface Props {
  income: number;
  expense: number;
}

const IncomeExpenseChart: React.FC<Props> = ({ income, expense }) => {
  const data = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ['#2dd36f', '#eb445a'],
      }
    ]
  };

  return <Doughnut data={data} />;
};

export default IncomeExpenseChart;
