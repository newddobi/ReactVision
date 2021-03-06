import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';

const HumanResource = ({match}) => (

    <div className="app-wrapper">
        {JSON.parse(localStorage.getItem('user')).accessMenuCodeNo == '01' ||
        JSON.parse(localStorage.getItem('user')).accessMenuCodeNo == '05' ? (
         <Switch>
             <Redirect exact from={`${match.url}/`} to={`${match.url}/appointment`}/>
             <Route path={`${match.url}/appointment`} component={asyncComponent(() => import('./routes/Appointment'))}/>
             <Route path={`${match.url}/department`} component={asyncComponent(() => import('./routes/Department'))}/>
             <Route path={`${match.url}/humanResourceCard`} component={asyncComponent(() => import('./routes/HumanResourceCard'))}/>
             <Route path={`${match.url}/workAttitude`} component={asyncComponent(() => import('./routes/WorkAttitude'))}/>
             <Route path={`${match.url}/workAttitudeCode`} component={asyncComponent(() => import('./routes/WorkAttitudeCode'))}/>
         </Switch>
        )
        :(  <Switch>
            {alert("접근권한이 없습니다.")}
            <Redirect to={`/app/home`}/>
            </Switch>
        )}
       
    </div>
);

export default HumanResource;