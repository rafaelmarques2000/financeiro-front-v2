import {alertError} from "@/helper/alertHelper";
import Store from "@/store";
import httpService from "@/services/http/HttpService";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatMoneyBRL} from "@/helper/moneyHelper";


function destroyChart() {
    let oldChart = Chart.getChart('expenseChart');

    if (oldChart !== undefined) {
        oldChart.destroy()
    }
}

const getInvoiceReport = async (data) => {
    let userId = Store.getters.userData.user_id

    try {
        let url = `/users/${userId}/dashboard/invoice-report?competence_year=${data.filters.year}`
        let request = await httpService.get(url)
        data.dashboard.expense = request.data;

        if(!data.dashboard.expense.length){
            destroyChart()
            return
        }
        destroyChart();

        let chart = new Chart(
            document.getElementById('expenseChart'),
            {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false,
                maintainAspectRatio: false,
                type: 'bar',
                plugins:[ChartDataLabels],
                options:{
                    plugins: {
                        legend:{
                           display: true,
                           position: "bottom"
                        },
                        tooltip:{
                            enabled: false
                        },
                        datalabels:{
                            anchor: 'end',
                            align: 'top',
                            formatter: function(value, context) {
                                return formatMoneyBRL(value);
                            }
                        }
                    }
                },
                layout:{
                  padding:{
                      top: 200
                  }
                },
                data: {
                    labels: data.dashboard.expense.map(row => row.month),
                    datasets: [
                        {
                            label: "Gastos Mensais",
                            data: data.dashboard.expense.map(row => row.amount),
                            backgroundColor: [ // Cores para cada barra
                                'rgba(255, 99, 132, 0.5)', // Cor para a Barra 1
                                'rgba(54, 162, 235, 0.5)', // Cor para a Barra 2
                                'rgba(255, 206, 86, 0.5)' // Cor para a Barra 3
                            ],
                        }
                    ]
                }
            }
        );

    }catch (e) {
        console.log(e)
        alertError("Atenção","Falha ao obter dados do dashboard");
    }
}

export {
    getInvoiceReport
}