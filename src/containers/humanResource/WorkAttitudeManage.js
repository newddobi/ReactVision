import React from 'react';
import { connect } from 'react-redux';
import { getWorkAttitudeList } from 'actions/HumanResource';
import CardBox from "components/CardBox";
import WorkAttitudeList from 'components/humanResource/GetWorkAttitudeList';
import ModifyWorkAttitude from 'components/humanResource/ModifyWorkAttitude';
import CircularProgress from '@material-ui/core/CircularProgress';

class WorkAttitudeManage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            search:{searchKeyword:null},
            modifyOpen:false
        }
    }

    //근태수정화면 열기
    handleModifyOpen = () => {
        this.setState({modifyOpen:true});
    }

    //근태수정화면 닫기
    handleModifyClose = () => {
        this.setState({modifyOpen:false});
    }

    render(){

        const { workAttitudeList } = this.props;

        if(workAttitudeList === undefined){
            this.props.getWorkAttitudeList(this.state.search)
        }

        return(
            <div>
            <CardBox styleName="col-lg-13" cardStyle="p-0" headerOutside>
                {workAttitudeList !== undefined ? (<WorkAttitudeList handleModifyOpen={this.handleModifyOpen}/>)
                                                    :(<div className="loader-view" style={{height: 'calc(100vh - 200px)'}}>
                                                        <CircularProgress/>
                                                      </div>)}
            </CardBox>
            <ModifyWorkAttitude open={this.state.modifyOpen}
                                handleModifyClose={this.handleModifyClose}/>
            </div>
        );
    }
}

const mapStateToProps = ({ humanResource }) => {
    const { workAttitudeList } = humanResource;
    return { workAttitudeList };
  }
  
  export default connect(mapStateToProps, { getWorkAttitudeList })(WorkAttitudeManage);