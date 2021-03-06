import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import axios from 'axios';
import { GET_GROUP_CODE_LIST, GET_CODE_LIST, GET_FOR_CODE_DETAIL, GET_NEW_CODE_NO, CHECK_DUPLICATE_CODE_NAME, ADD_CODE, CONVERT_CODE_USAGE_STATUS, UPDATE_CODE, CONVERT_CODE_USAGE_STATUS_LIST } from "actionTypes/ActionTypes";
import { carryNewCodeNo, carryGroupCodeList, carryCodeList, carryForCodeDetail, checkDuplicateResult, addCodeResult } from "actions/Code";

const getGroupCodeListAxios = async () =>{
    //console.log("sagas/Code.js getGroupCodeList() start...");
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/getGroupCodeList",
    })
    .then(response => response.data)
    .catch(error => console.log(error))
}

const getCodeListAxios = async (search) =>{
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/getCodeList",
        data : search
    })
    .then(response => response.data)
    .catch(error => console.log(error))
}

const getNewCodeNoAxios = async (data) =>{
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/addCodePreparing/"+data
    })
    .then(response => response.data)
    .catch(error => console.log(error))
}

const checkDuplicateCodeNameAxios = async (data) =>{
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/checkDuplicateCodeName",
        data: data
    })
    .then(response => response.data)
    .catch(error => error)
}

const addCodeAxios = async(data) => {
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/addCode",
        data: data
    })
    .then(response => response.data)
    .catch(error => console.log(error))
}

const convertCodeUsageAxios = async(data) => {
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/convertCodeUsageStatus",
        data: data
    })
    .then(resoponse => resoponse.data)
    .catch(error => console.log(error))
}

const convertCodeUsageListAxios = async(data) => {
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/convertCodeUsageStatusList",
        data: data
    })
    .then(resoponse => resoponse.data)
    .catch(error => console.log(error))
}

const updateCodeAxios = async(data) => {
    return await axios({
        method:"POST",
        url:"http://localhost:8080/code/modifyCode",
        data : data
    })
    .then(response => response.data)
    .catch(error => console.log(error))
}

function* getGroupCodeList(){
    //console.log("sagas/Code.js getGroupCodeList() 실행");
    const groupCodeList = yield call(getGroupCodeListAxios);
    yield put(carryGroupCodeList(groupCodeList));
}

function* getCodeList(action){
    const codeList = yield call(getCodeListAxios, action.payload);
    yield put(carryCodeList(codeList));
}

function* getForCodeDetail(action){
    const listForCodeDetail = yield call(getCodeListAxios, action.payload);
    yield put(carryForCodeDetail(listForCodeDetail));
}

function* getNewCodeNo(action){
    const newCodeNo = yield call(getNewCodeNoAxios, action.payload);
    yield put(carryNewCodeNo(newCodeNo));
}

function* checkDuplicateCodeName(action){
    const codeBool = yield call(checkDuplicateCodeNameAxios, action.payload);
    yield put(checkDuplicateResult(codeBool));
}

function* addCode(action){
    const _addCodeResult = yield call(addCodeAxios, action.payload);
    yield put(addCodeResult(_addCodeResult));
}

function* updateCode(action){
    yield call(updateCodeAxios, action.payload)
    yield put(addCodeResult());
}

function* convertCodeUsage(action){
    yield call(convertCodeUsageAxios, action.payload);
    yield put(carryForCodeDetail());
}

function* convertCodeUsageList(action){
    yield call(convertCodeUsageListAxios, action.payload);
    yield put(carryForCodeDetail());
}

export function* getCodeListSaga(){
    yield takeEvery(GET_CODE_LIST, getCodeList);
}

export function* getGroupCodeListSaga(){
    yield takeEvery(GET_GROUP_CODE_LIST, getGroupCodeList);
}

export function* getForCodeDetailSaga(){
    yield takeEvery(GET_FOR_CODE_DETAIL, getForCodeDetail)
}

export function* getNewCodeNoSaga(){
    yield takeEvery(GET_NEW_CODE_NO, getNewCodeNo)
}

export function* checkDuplicateCodeNameSaga(){
    yield takeEvery(CHECK_DUPLICATE_CODE_NAME, checkDuplicateCodeName)
}

export function* addCodeSaga(){
    yield takeEvery(ADD_CODE, addCode)
}

export function* convertCodeUsageSaga(){
    yield takeEvery(CONVERT_CODE_USAGE_STATUS, convertCodeUsage)
}

export function* convertCodeUsageListSaga(){
    yield takeEvery(CONVERT_CODE_USAGE_STATUS_LIST, convertCodeUsageList)
}

export function* updateCodeSaga(){
    yield takeEvery(UPDATE_CODE, updateCode)
}

export default function* rootSaga(){
    console.log("/sagas/Code.js rootSaga() 실행")
    yield all([fork(getGroupCodeListSaga), 
               fork(getCodeListSaga),
               fork(getForCodeDetailSaga),
               fork(getNewCodeNoSaga),
               fork(checkDuplicateCodeNameSaga),
               fork(addCodeSaga),
               fork(convertCodeUsageSaga),
               fork(convertCodeUsageListSaga),
               fork(updateCodeSaga)
        ]);
}