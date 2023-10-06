import {alertError} from "@/helper/alertHelper";
import Store from "@/store";
import httpService from "@/services/http/HttpService";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatMoneyBRL} from "@/helper/moneyHelper";

const getInvoiceReport = async (data) => {
    let userId = Store.getters.userData.user_id
    try {
        let url = `/users/${userId}/dashboard/invoice-report?competence_year=2023`
        let request = await httpService.get(url)
        data.dashboard.expense = request.data;

        let chart = new Chart(
            document.getElementById('chart'),
            {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
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
                data: {
                    labels: data.dashboard.expense.map(row => row.month),
                    datasets: [
                        {
                            label: "Gastos Mensais",
                            data: data.dashboard.expense.map(row => row.amount)
                        }
                    ]
                }
            }
        );
    }catch (e) {
        alertError("Atenção","Falha ao obter dados do dashboard");
    }
}

export {
    getInvoiceReport
}