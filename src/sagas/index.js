"use strict";

import {all} from 'redux-saga/effects';
import authSagas from './Auth';
import accountingSagas from './Accounting';
import approvalSagas from './Approval';
import businessSupportSagas from './BusinessSupport';
import codeSagas from './Code';
import humanresourceSagas from './HumanResource';
import productionManagementSagas from './ProductionManagement';
import noticeSagas from './Notice';
import commonSagas from './Common';
import branchSagas from './Branch';


export default function* rootSaga(getState) {
    yield all([
        authSagas(),
        humanresourceSagas(),
        codeSagas(),
        accountingSagas(),
        businessSupportSagas(),
        noticeSagas(),
        approvalSagas(),
        commonSagas(),
        branchSagas(),
        productionManagementSagas(),
    ]);
}
