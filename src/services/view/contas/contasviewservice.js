import {accountlistAll, getAccountPeriodGeneralStatistic} from "@/services/api/accountService";
import {alertConfirm, alertError} from "@/helper/alertHelper";
import store from "@/store";

const renderPageTitle = (data, route) => {
    let module = route.params.module

    if(module === "contas"){
        if(data.filter.archived === 1){
            data.pageTitle = {
                title: "Contas(arquivadas)",
                subtitle: "Gerencie suas contas arquivadas",
                icon: "fa-solid fa-box-archive"
            }
        }else {
            data.pageTitle = {
                title: "Contas",
                subtitle: "Gerencie suas contas",
                icon: "fa-solid fa-receipt"
            }
        }
    }

    if(module === "cartoes"){
        if(data.filter.archived === 1){
            data.pageTitle = {
                title: "Cartões(arquivados)",
                subtitle: "Gerencie seus cartões arquivados",
                icon: "fa-solid fa-box-archive"
            }
        }else {
            data.pageTitle = {
                title: "Cartões",
                subtitle: "Gerencie seus cartões",
                icon: "fa-solid fa-credit-card"
            }
        }
    }

    if(module === "caixa"){
        if(data.filter.archived === 1){
            data.pageTitle = {
                title: "Caixa(arquivados)",
                subtitle: "Gerencie suas contas de caixa arquivados",
                icon: "fa-solid fa-box-archive"
            }
        }else {
            data.pageTitle = {
                title: "Caixa",
                subtitle: "Gerencie seu caixa mensal",
                icon: "fa-solid fa-money-bill"
            }
        }
    }
}

const renderModalTitle = (data, route, operation, accountDescription) => {

      let module = route.params.module

    if(module === "contas"){
            data.modal.title = operation === "new" ? "Nova conta" : `Editar - ${accountDescription}`
            data.modal.icon =  operation === "new" ? "fa-solid fa-circle-plus" : "fa-solid fa-pen-to-square"
        }

        if(module === "cartoes"){
            data.modal = {
                title : operation === "new" ? "Novo cartão" : `Editar - ${accountDescription}`,
                icon : operation === "new" ? "fa-solid fa-circle-plus" : "fa-solid fa-pen-to-square"
            }
        }

        if(module === "caixa"){
            data.modal = {
                title : operation === "new" ? "Novo Caixa" : `Editar - ${accountDescription}`,
                icon : operation === "new" ? "fa-solid fa-circle-plus" : "fa-solid fa-pen-to-square"
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
    if(store.getters.dateRange != null) {
        data.filter.range = store.getters.dateRange
        return
    }
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
    store.commit("setDateFilter", data.filter.range)
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