import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {connect} from 'react-redux'
import {addApprovalForm} from 'actions/Approval'
import ApprovalFormCKEditor from './ApprovalFormCKEditor';
import Snackbar from '@material-ui/core/Snackbar';


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            approvalFormTitle : "",
            approvalForm : "",
            registrantEmployeeName: JSON.parse(localStorage.getItem("user")).employeeName,
            registrantEmployeeNo : JSON.parse(localStorage.getItem("user")).employeeNo,
            snackbar:false,
            snackbarContents:""
        }
    }



  handleTitle = (event) => {
      this.setState({
        ...this.state,
        approvalFormTitle : event.target.value
      })
  }

  handleForm = (event) => {
      this.setState({
          ...this.state,
          approvalForm : event.editor.getData()
      })
  }

  handleClickOpen = () => {
    this.setState({
      ...this.state,
      open: true
    });
  };
  handleAdd = () => {
    if(this.state.approvalFormTitle == ""){
      this.handleRequestSnackBarOpen("결재양식명은 반드시 입력하셔야합니다.")
    }else if(this.state.approvalForm == ""){
      this.handleRequestSnackBarOpen("결재양식이 작성되지 않았습니다.")
    }else{
     // this.props.addApprovalForm(this.state);
      this.handleRequestClose();
    }

  }
  handleRequestClose = () => {
    this.setState({
      open: false,
      approvalFormTitle : "",
      approvalForm : "",
    });
  };

  //스낵바 열기
  handleRequestSnackBarOpen = (contents) => {
    this.setState({
      snackbar:true,
      snackbarContents:contents
    })
  }

  //스낵바 닫기
  handleRequestSnackBarClose = () => {
    this.setState({
      snackbar:false,
      snackbarContents:""
    })
  }

  render() {
    return (
      <div>
        <Button style={{backgroundColor:"#CC4F3A"}} variant="contained" className="text-white" onClick={this.handleClickOpen}>등록</Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleRequestClose}
          TransitionComponent={Transition}
        >
          <AppBar className="position-relative" style={{backgroundColor:"#CC4F3A"}}>
            <Toolbar>
              <IconButton onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
              <Typography variant="title" color="inherit" style={{
                flex: 1,
              }}>
                결재양식등록
              </Typography>
              <Button style={{backgroundColor:"#f2f2f2"}} onClick={this.handleAdd}>
                등록
              </Button>
            </Toolbar>
          </AppBar>
          <div>
          <span style={{float:"left", paddingLeft:"50px"}}>
           <TextField
                error
                id="outlined-required"
                label="결재양식명"
                value={this.state.approvalFormTitle}
                placeholder="결재양식의 이름을 입력하세요."
                margin="normal"
                variant="outlined"
                onChange={this.handleTitle}
            />
            </span>
            <span style={{float:"center", paddingLeft:"50px"}}>
            <TextField
              margin="normal"
              id="registrantEmployeeName"
              label="등록자"
              value={this.state.registrantEmployeeName}
            />
            </span>
            </div>
            <Divider/>
            <ApprovalFormCKEditor handleForm={this.handleForm} content={this.state.approvalForm}></ApprovalFormCKEditor>
        </Dialog>
        <Snackbar
            anchorOrigin={{vertical:'top', horizontal:'center'}}
            open={this.state.snackbar}
            autoHideDuration="1800"
            onClose={this.handleRequestSnackBarClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackbarContents}</span>}
          />
      </div>
    );
  }


}

const mapStateToProps = ({approval}) => {
    const {} = approval;
    return {};
}

export default connect(mapStateToProps, {addApprovalForm}) (FullScreenDialog);