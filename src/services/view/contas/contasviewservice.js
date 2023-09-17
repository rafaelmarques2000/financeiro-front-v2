import {accountlistAll, getAccountPeriodGeneralStatistic} from "@/services/api/accountService";
import {alertConfirm, alertError} from "@/helper/alertHelper";

const renderPageTitle = (data, route) => {
    let module = route.params.module

    if(module === "contas"){
        data.pageTitle = {
            title: "Contas",
            subtitle: "Gerencie suas contas",
            icon: "fa-solid fa-receipt"
        }
    }

    if(module === "cartoes"){
        data.pageTitle = {
            title: "Cartões",
            subtitle: "Gerencie seus cartões",
            icon: "fa-solid fa-credit-card"
        }
    }

    if(module === "caixa"){
        data.pageTitle = {
            title: "Caixa",
            subtitle: "Gerencie seu caixa mensal",
            icon: "fa-solid fa-money-bill"
        }
    }
}

const renderModalTitle = (data, route) => {
      let module = route.params.module
        if(module === "contas"){
            data.modal.title = "Nova conta"
            data.modal.icon = "fa-solid fa-circle-plus"
        }

        if(module === "cartoes"){
            data.modal = {
                title: "Novo cartão",
                icon: "fa-solid fa-circle-plus"
            }
        }

        if(module === "caixa"){
            data.modal = {
                title: "Novo caixa",
                icon: "fa-solid fa-circle-plus"
            }
        }
}

const openCloseFilter = (data) => {
    if(data.filter.open) {
        data.filter.open = false
        return;
    }
    data.filter.open = true
}

const setInitialDateFilter = (data) => {
    const now = new Date();
    data.filter.range = {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }
}

const navigatePages = (data, route, direction) => {
    if(direction === 'prev') {
        if(data.pagination.current_page > 1) {
            data.pagination.current_page -=1
            accountlistAll(data, route)
            return;
        }
    }

    if(direction === 'next') {
        if(data.pagination.current_page >= data.pagination.totalPages) {
            return
        }
        data.pagination.current_page +=1
        accountlistAll(data, route)
    }
}

const searchFilter = (data, route) => {
    if(data.filter.range == null) {
        alertError("Atenção", "Preencha o filtro de data com inicio e fim para continuar")
        return;
    }
    getAccountPeriodGeneralStatistic(data, route)
    accountlistAll(data, route)
}

export {
    renderPageTitle,
    renderModalTitle,
    openCloseFilter,
    searchFilter,
    setInitialDateFilter,
    navigatePages
}