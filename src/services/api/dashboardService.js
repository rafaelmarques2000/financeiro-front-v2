import {alertError} from "@/helper/alertHelper";
import Store from "@/store";
import httpService from "@/services/http/HttpService";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatMoneyBRL} from "@/helper/moneyHelper";
import {formatDate} from "@/services/utils/date";


function destroyChart(chart) {
    let oldChart = Chart.getChart(chart);

    if (oldChart !== undefined) {
        oldChart.destroy()
    }
}

const getInvoiceReport = async (data) => {
    let userId = Store.getters.userData.user_id

    try {
        data.loading.show = true;
        let url = `/users/${userId}/dashboard/invoice-report?competence_year=${data.filters.year}`
        let request = await httpService.get(url)
        data.dashboard.expense = request.data;

        if(!data.dashboard.expense.length){
            data.loading.show = false;
            destroyChart("expenseChart")
            return
        }
        destroyChart("expenseChart");

        let chart = new Chart(
            document.getElementById('expenseChart'),
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
        data.loading.show = false;

    }catch (e) {
        data.loading.show = false;
        alertError("Atenção","Falha ao obter dados do dashboard");
    }
}

const getExpensePerCategory = async (data) => {
    try{
        data.loading.show = true;
        let userId = Store.getters.userData.user_id
        let url = `/users/${userId}/dashboard/expense-per-category?initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}&module=${data.filters.module}`
        let request = await httpService.get(url)
        data.dashboard.expensePerCategory = request.data

        if(!data.dashboard.expensePerCategory.length){
            data.loading.show = false;
            destroyChart("expense-per-category")
            return
        }
        destroyChart("expense-per-category");

        let chart = new Chart(
            document.getElementById("expense-per-category"),
            {
                type: "pie",
                responsive: true,
                plugins:[ChartDataLabels],
                options:{
                    plugins: {
                        legend:{
                            display: true,
                            position: "bottom"
                        },
                        tooltip:{
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                     return parseFloat(context.raw).toFixed(2) + "%"
                                }
                            }
                        },
                        datalabels:{
                            textAlign: 'center',
                            font: {
                                size: 14
                            },
                            position: 'default',
                            formatter: function(value, context) {
                                return value.toFixed(2) + '%';
                            }
                        }
                    }
                },
                data:{
                    labels: data.dashboard.expensePerCategory.map(row => row.description),
                    datasets:[
                        {
                            data: data.dashboard.expensePerCategory.map(row => row.percentage)
                        }
                    ]
                }
            }
        )
        let labels = chart.data.labels
        let chartColors =  chart.data.datasets[0].backgroundColor;
        let colors = []
        labels.forEach((item , index) => {
             colors.push({
                 description: item,
                 color: chartColors[index]
             })
        })
        data.config.expensePerCategoryBackgroundColors = colors
        data.loading.show = false;
    }catch (e) {
        console.log(e)
        data.loading.show = false;
        alertError("Atenção","Falha ao obter dados do dashboard");
    }
}

export {
    getInvoiceReport,
    getExpensePerCategory
}