import {reactive} from "vue";
import {findAllGoalContributions, saveGoalContribution} from "@/services/api/goalContribuitionService";
import {generatePagesArray, paginateArray} from "@/services/utils/Pagination";
import {alertError} from "@/helper/alertHelper";
import {findAll} from "@/services/api/goalService";

const aportesData = reactive({
     modal: {
         show: false,
         title: "test"
     },
    goalId: "",
    goalContributions:[],
    goalContributionsPaginated:[],
    goalContribution: {
        description: "",
        amount: "",
        operation_type: ""
    },
    goalBalance: {
        meta: 0,
        goalContributions: 0,
        goalRemaining: 0,
        percentage: 0,
    },
    goalContributionsPagination: {
        currentPage: 0,
        limit: 10,
        pages:[]
    }
})

const openAportesModal = (item) => {
    aportesData.modal.show = true;
    aportesData.modal.title = `${item.description} - Aportes`;
    aportesData.goalId = item.id;
    aportesData.goalBalance.meta = item.amount;
    aportesData.goalBalance.goalContributions = item.balance.goal_contributions;
    aportesData.goalBalance.goalRemaining = item.balance.goal_remaining;
    aportesData.goalBalance.percentage = item.balance.percentage;
    findAllGoalContributions(aportesData)
}

const navigatePagesAportes = (direction) => {
    if (direction === 'prev') {
        if(aportesData.goalContributionsPagination.currentPage > 0) {
            aportesData.goalContributionsPagination.currentPage -=1
            aportesData.goalContributionsPaginated = paginateArray(aportesData.goalContributions,aportesData.goalContributionsPagination.limit, aportesData.goalContributionsPagination.currentPage)
            aportesData.goalContributionsPagination.pages = generatePagesArray(
                aportesData.goalContributionsPagination.currentPage + 1,
                aportesData.goalContributions.length,
                aportesData.goalContributionsPagination.limit,
                5
            )
            return;
        }
    }

    if (direction === 'next') {
        let totalPages = Math.ceil(aportesData.goalContributions.length / aportesData.goalContributionsPagination.limit);
        let currentPage = (aportesData.goalContributionsPagination.currentPage + 1);
        if( currentPage >= totalPages) {
            return
        }
        aportesData.goalContributionsPagination.currentPage +=1
        aportesData.goalContributionsPaginated = paginateArray(aportesData.goalContributions,aportesData.goalContributionsPagination.limit, aportesData.goalContributionsPagination.currentPage)
        aportesData.goalContributionsPagination.pages = generatePagesArray(
            aportesData.goalContributionsPagination.currentPage + 1,
            aportesData.goalContributions.length,
            aportesData.goalContributionsPagination.limit,
            5
        )
    }
}

const linkNavigationPageArray = (page) => {
    aportesData.goalContributionsPagination.currentPage = page;
    aportesData.goalContributionsPaginated = paginateArray(aportesData.goalContributions,aportesData.goalContributionsPagination.limit, aportesData.goalContributionsPagination.currentPage)
    aportesData.goalContributionsPagination.pages = generatePagesArray(
        page,
        aportesData.goalContributions.length,
        aportesData.goalContributionsPagination.limit,
        5
    )
}

const closeModal = (goalData) => {
    aportesData.modal.show = false;
    findAll(goalData)
}




let submitGoalContribution = (goalId) => {
    if(!aportesData.goalContribution.description) {
        alertError("Atenção","Preencha o campo descrição");
        return
    }

    if(!aportesData.goalContribution.amount) {
        alertError("Atenção","Preencha o campo valor");
        return;
    }

    if(!aportesData.goalContribution.operation_type) {
        alertError("Atenção","Preencha o campo tipo");
        return;
    }
    saveGoalContribution(aportesData)
}


export {
    aportesData,
    openAportesModal,
    navigatePagesAportes,
    linkNavigationPageArray,
    closeModal,
    submitGoalContribution
}